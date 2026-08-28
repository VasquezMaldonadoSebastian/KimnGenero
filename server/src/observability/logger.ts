import pino from "pino";
import pinoHttp from "pino-http";
import { randomUUID } from "crypto";

function getReqIdFromHeaders(headers: Record<string, unknown>) {
  const header = headers["x-request-id"];
  if (typeof header === "string" && header.trim().length > 0) return header.trim();
  return undefined;
}

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
});

export function createHttpLogger() {
  return pinoHttp({
    logger,
    genReqId: (req, res) => {
      const existing = getReqIdFromHeaders(req.headers as Record<string, unknown>);
      const id = existing ?? randomUUID();
      res.setHeader("x-request-id", id);
      return id;
    },
  });
}

