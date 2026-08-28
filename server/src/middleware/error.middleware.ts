import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

type ErrorPayload = {
  // Back-compat with the current client codepaths expecting `{ error: string }`.
  error: string;
  code: "VALIDATION_ERROR" | "NOT_FOUND" | "INTERNAL_ERROR";
  message: string;
  details?: unknown;
};

function sendError(res: Response, status: number, payload: ErrorPayload) {
  res.status(status).json(payload);
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return sendError(res, 400, {
      error: "Invalid request parameters",
      code: "VALIDATION_ERROR",
      message: "Invalid request parameters",
      details: err.flatten(),
    });
  }

  if (err instanceof AppError) {
    return sendError(res, err.status, {
      error: err.message,
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }

  return sendError(res, 500, {
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  });
}

