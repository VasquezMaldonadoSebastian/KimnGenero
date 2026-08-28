import type { RequestHandler } from "express";

type BucketKey = string;
type MetricBucket = {
  count: number;
  totalMs: number;
  maxMs: number;
  durationsMs: number[];
  status2xx: number;
  status4xx: number;
  status5xx: number;
};

const buckets = new Map<BucketKey, MetricBucket>();
const MAX_SAMPLES_PER_ENDPOINT = 500;

function getKey(method: string, path: string) {
  return `${method.toUpperCase()} ${path}`;
}

function classifyStatus(status: number) {
  if (status >= 500) return "5xx";
  if (status >= 400) return "4xx";
  return "2xx";
}

function percentile(sorted: number[], p: number) {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1));
  return sorted[idx] ?? 0;
}

export function metricsMiddleware(): RequestHandler {
  return (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
      // Best effort "endpoint" label.
      const path =
        (req.route?.path as string | undefined) ??
        req.path ??
        req.originalUrl?.split("?")[0] ??
        "unknown";
      const key = getKey(req.method, path);

      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;

      const prev =
        buckets.get(key) ??
        ({
          count: 0,
          totalMs: 0,
          maxMs: 0,
          durationsMs: [],
          status2xx: 0,
          status4xx: 0,
          status5xx: 0,
        } satisfies MetricBucket);

      const samplesMs = prev.durationsMs;
      if (samplesMs.length >= MAX_SAMPLES_PER_ENDPOINT) {
        samplesMs.shift();
      }
      samplesMs.push(durationMs);

      const statusClass = classifyStatus(res.statusCode);
      buckets.set(key, {
        count: prev.count + 1,
        totalMs: prev.totalMs + durationMs,
        maxMs: Math.max(prev.maxMs, durationMs),
        durationsMs: samplesMs,
        status2xx: prev.status2xx + (statusClass === "2xx" ? 1 : 0),
        status4xx: prev.status4xx + (statusClass === "4xx" ? 1 : 0),
        status5xx: prev.status5xx + (statusClass === "5xx" ? 1 : 0),
      });
    });

    next();
  };
}

export function getMetricsSnapshot() {
  const out: Array<{
    endpoint: string;
    count: number;
    avgMs: number;
    p50Ms: number;
    p95Ms: number;
    p99Ms: number;
    maxMs: number;
    status2xx: number;
    status4xx: number;
    status5xx: number;
    errorRate5xx: number;
  }> = [];
  for (const [endpoint, b] of Array.from(buckets.entries())) {
    const sorted = [...b.durationsMs].sort((a, c) => a - c);
    out.push({
      endpoint,
      count: b.count,
      avgMs: b.count > 0 ? b.totalMs / b.count : 0,
      p50Ms: percentile(sorted, 0.5),
      p95Ms: percentile(sorted, 0.95),
      p99Ms: percentile(sorted, 0.99),
      maxMs: b.maxMs,
      status2xx: b.status2xx,
      status4xx: b.status4xx,
      status5xx: b.status5xx,
      errorRate5xx: b.count > 0 ? b.status5xx / b.count : 0,
    });
  }
  out.sort((a, b) => b.p95Ms - a.p95Ms);
  return out;
}

