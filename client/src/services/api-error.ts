import type { ApiErrorBody } from "@/types";

/**
 * The single error type the client raises for a failed backend call.
 * Hooks and components branch on `status` / `code`, never on message text.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }

  /** 4xx responses are the caller's fault — retrying them is wasted work. */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  static isApiError(value: unknown): value is ApiError {
    return value instanceof ApiError;
  }
}

/** Raised when the request never reached the backend (network, DNS, abort). */
export class NetworkError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "NetworkError";
    this.cause = cause;
  }
}
