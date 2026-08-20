import express from "express";
import { createIndicatorRoutes } from "./api/v1/indicators/indicators.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { AppError } from "./errors/AppError";
import type { IndicatorService } from "./services/indicatorService";
import { createHttpLogger } from "./observability/logger";
import { getMetricsSnapshot, metricsMiddleware } from "./middleware/metrics.middleware";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { getAllowedFrameSrc, isCspReportOnly } from "./config/security";

type CreateAppDeps = {
  indicatorService: IndicatorService;
};

export function createApp(deps: CreateAppDeps) {
  const app = express();

  app.set("etag", "strong");

  app.use(
    helmet({
      // Embedded dashboards often require cross-origin resources; keep COEP off.
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        reportOnly: isCspReportOnly(),
        useDefaults: true,
        directives: {
          // Keep defaults + allow dashboards in frames.
          "frame-src": ["'self'", ...getAllowedFrameSrc()],
          "img-src": ["'self'", "data:", "https:"],
          "connect-src": ["'self'", "https:"],
          "script-src": ["'self'", "'unsafe-inline'", "https:"],
          "style-src": ["'self'", "'unsafe-inline'", "https:"],
        },
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    })
  );

  if (process.env.NODE_ENV !== "test") {
    app.use(createHttpLogger());
    app.use(metricsMiddleware());
  }

  // Lightweight perf baseline: enable gzip/br when available.
  app.use(compression());
  app.use(express.json({ limit: "100kb" }));

  // Rate limiting para proteger la API de abuso
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // 100 requests por IP por ventana
      message: { error: "Too many requests, please try again later" },
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", createIndicatorRoutes(deps.indicatorService));

  app.get("/api/reportes-agrupados", (_req, res, next) => {
    try {
      res.json(deps.indicatorService.getGroupedReports());
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/metrics", (_req, res) => {
    res.json(getMetricsSnapshot());
  });

  // Consistent error payload for API routes.
  app.use("/api", (_req, _res, next) => {
    next(new AppError("NOT_FOUND", "Route not found", 404));
  });

  app.use(errorMiddleware);

  return app;
}
