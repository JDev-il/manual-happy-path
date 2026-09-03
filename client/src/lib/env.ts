/**
 * Client environment configuration.
 *
 * The wiring contract in TASK.md names the base URL variable `API_BASE_URL`.
 * Next.js only inlines variables prefixed `NEXT_PUBLIC_` into the browser
 * bundle, so the public form is the primary source and the bare name is kept as
 * a server-side fallback (route handlers, RSC, tests).
 *
 * Nothing here is ever hardcoded at a call site — services read this module.
 */

/** Literal member access is required: Next.js inlines these at build time. */
const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SERVER_BASE_URL = process.env.API_BASE_URL;

const normalize = (value: string | undefined): string =>
  (value ?? "").trim().replace(/\/+$/, "");

/** Base URL for every backend call. Empty string means "no backend wired yet". */
export const apiBaseUrl = normalize(PUBLIC_BASE_URL) || normalize(SERVER_BASE_URL);

/**
 * True once a real backend is configured. Until `backend/API` lands and
 * API_BASE_URL is set, the transport falls back to the in-repo mock so hooks
 * are exercisable end to end. No call site changes when this flips.
 */
export const isLiveApi = apiBaseUrl.length > 0;

/** Request timeout in milliseconds. */
export const requestTimeoutMs = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15_000);

/** Simulated latency for the mock transport, so loading states are visible. */
export const mockLatencyMs = Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS ?? 320);
