/**
 * The one place in the client that talks to the network.
 *
 * Every service function goes through `apiRequest`. Components, pages, and
 * hooks never call `fetch` directly — that boundary is what keeps caching,
 * error shaping, and the mock fallback in a single testable seam.
 */

import { apiBaseUrl, isLiveApi, requestTimeoutMs } from "@/lib/env";
import { ApiError, NetworkError } from "@/services/api-error";
import { resolveMock } from "@/services/transport/mock-transport";
import type { ApiErrorBody } from "@/types";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  /** Undefined and null entries are dropped rather than serialised. */
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  signal?: AbortSignal;
}

const toSearchParams = (query: RequestOptions["query"]): URLSearchParams => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  return params;
};

const parseErrorBody = async (response: Response): Promise<ApiErrorBody> => {
  try {
    const parsed = (await response.json()) as Partial<ApiErrorBody>;
    if (parsed && typeof parsed.message === "string") {
      return { code: parsed.code ?? "UNKNOWN", message: parsed.message, details: parsed.details };
    }
  } catch {
    /* Body was empty or not JSON — fall through to the status-derived default. */
  }
  return { code: `HTTP_${response.status}`, message: response.statusText || "Request failed" };
};

/**
 * Issues one backend call and returns the parsed payload.
 * Throws `ApiError` for a backend response, `NetworkError` if it never arrived.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", query, body, signal } = options;
  const params = toSearchParams(query);

  if (!isLiveApi) {
    return resolveMock<T>({ method, path, query: params, body });
  }

  const search = params.toString();
  const url = `${apiBaseUrl}${path}${search ? `?${search}` : ""}`;

  const timeout = AbortSignal.timeout(requestTimeoutMs);
  const composed = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal: composed,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    throw new NetworkError(`Request to ${path} did not complete.`, cause);
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorBody(response));
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
