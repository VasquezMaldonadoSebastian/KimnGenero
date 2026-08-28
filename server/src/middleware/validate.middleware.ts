import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

export function validateParams(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    try {
      // Keep behavior the same (params are still strings), but ensure non-empty,
      // and provide a single failure path via the error middleware.
      req.params = schema.parse(req.params) as any;
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function validateQuery(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (err) {
      next(err);
    }
  };
}
