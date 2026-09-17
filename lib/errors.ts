import { NextResponse } from "next/server";

// Standard error shape shared by every API route. Traces to docs/SRS.md §8.

export type ErrorCode = "VALIDATION_ERROR" | "UNAUTHORIZED" | "NOT_FOUND" | "INTERNAL_ERROR";

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const validationError = (message: string) => new ApiError("VALIDATION_ERROR", 400, message);

export const unauthorized = (message = "Missing or invalid authentication token") =>
  new ApiError("UNAUTHORIZED", 401, message);

export const notFound = (message: string) => new ApiError("NOT_FOUND", 404, message);

export const internalError = (message = "Internal server error") =>
  new ApiError("INTERNAL_ERROR", 500, message);

export function toErrorResponseBody(error: unknown) {
  if (error instanceof ApiError) {
    return { body: { error: { code: error.code, message: error.message } }, status: error.status };
  }
  return {
    body: { error: { code: "INTERNAL_ERROR" as const, message: "Internal server error" } },
    status: 500,
  };
}

// Every route handler's catch block funnels through this one helper, so the
// error shape can't drift between endpoints (Architecture §9).
export function toErrorResponse(error: unknown): NextResponse {
  if (!(error instanceof ApiError)) {
    console.error(error);
  }
  const { body, status } = toErrorResponseBody(error);
  return NextResponse.json(body, { status });
}
