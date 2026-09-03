/**
 * In-memory stand-in for the backend.
 *
 * Active only while `API_BASE_URL` is unset. It speaks the exact endpoint map
 * documented in CONTRACTS.md, so switching to the live backend is a config
 * change with no call-site edits. Mutations persist for the page session, which
 * is what the optimistic-update paths in the hooks need to be verifiable.
 */

import { mockLatencyMs } from "@/lib/env";
import { ApiError } from "@/services/api-error";
import { fixtures } from "@/services/transport/fixtures";
import type { MoverDirection, PriceAlert, TimeRange, WatchlistItem } from "@/types";

/** Session-scoped mutable state — a real backend owns this persistently. */
const state = {
  watchlist: null as WatchlistItem[] | null,
  alerts: null as PriceAlert[] | null,
};

const watchlist = (): WatchlistItem[] => (state.watchlist ??= fixtures.watchlist());
const alerts = (): PriceAlert[] => (state.alerts ??= fixtures.alerts());

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const notFound = (method: string, path: string): never => {
  throw new ApiError(404, {
    code: "MOCK_ROUTE_NOT_FOUND",
    message: `No mock handler for ${method} ${path}. Add one, or set API_BASE_URL.`,
  });
};

/** Splits "/market/series/NVDA" into ["market", "series", "NVDA"]. */
const segments = (path: string): string[] => path.split("/").filter(Boolean);

export interface MockRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  body: unknown;
}

export async function resolveMock<T>({ method, path, query, body }: MockRequest): Promise<T> {
  await delay(mockLatencyMs);

  const seg = segments(path);
  const head = `${method} /${seg.join("/")}`;

  switch (seg[0]) {
    case "market":
      return resolveMarket<T>(method, seg, query, body) ?? notFound(method, head);
    case "portfolio":
      if (method === "GET" && seg[1] === "summary") return fixtures.portfolio() as T;
      break;
    case "ai":
      return resolveAi<T>(method, seg, query, body) ?? notFound(method, head);
    case "news":
      if (method === "GET") {
        const symbols = (query.get("symbols") ?? "").split(",").filter(Boolean);
        const items = fixtures.news();
        return (symbols.length === 0
          ? items
          : items.filter((n) => n.symbols.some((s) => symbols.includes(s)))) as T;
      }
      break;
    case "alerts":
      return resolveAlerts<T>(method, seg) ?? notFound(method, head);
  }

  return notFound(method, head);
}

function resolveMarket<T>(
  method: string,
  seg: string[],
  query: URLSearchParams,
  body: unknown,
): T | null {
  const [, resource, param] = seg;

  if (method === "GET" && resource === "tape") return fixtures.tape() as T;
  if (method === "GET" && resource === "watchlist") return watchlist() as T;

  if (method === "PATCH" && resource === "watchlist" && param) {
    const list = watchlist();
    const index = list.findIndex((item) => item.id === param);
    if (index === -1) {
      throw new ApiError(404, {
        code: "WATCHLIST_ITEM_NOT_FOUND",
        message: `No watchlist item with id ${param}.`,
      });
    }
    const pinned = Boolean((body as { pinned?: boolean } | null)?.pinned);
    list[index] = { ...list[index], pinned };
    return list[index] as T;
  }

  if (method === "GET" && resource === "movers") {
    const requested = (query.get("direction") ?? "gainers") as MoverDirection;
    return fixtures.movers(requested) as T;
  }

  if (method === "GET" && resource === "quote" && param) {
    const found = fixtures.quote(param);
    if (!found) {
      throw new ApiError(404, { code: "SYMBOL_NOT_FOUND", message: `Unknown symbol ${param}.` });
    }
    return found as T;
  }

  if (method === "GET" && resource === "series" && param) {
    const range = (query.get("range") ?? "1D") as TimeRange;
    const found = fixtures.series(param, range);
    if (!found) {
      throw new ApiError(404, { code: "SYMBOL_NOT_FOUND", message: `Unknown symbol ${param}.` });
    }
    return found as T;
  }

  if (method === "GET" && resource === "heatmap") return fixtures.heatmap() as T;
  if (method === "GET" && resource === "indices") return fixtures.indices() as T;

  return null;
}

function resolveAi<T>(
  method: string,
  seg: string[],
  query: URLSearchParams,
  body: unknown,
): T | null {
  const [, resource] = seg;

  if (method === "GET" && resource === "insights") {
    const limit = Number(query.get("limit") ?? 0);
    const all = fixtures.insights();
    return (limit > 0 ? all.slice(0, limit) : all) as T;
  }
  if (method === "GET" && resource === "predictions") return fixtures.predictions() as T;
  if (method === "GET" && resource === "sentiment") return fixtures.sentiment(query.get("symbol")) as T;
  if (method === "GET" && resource === "suggestions") return fixtures.suggestions() as T;
  if (method === "GET" && resource === "digest") return fixtures.digest() as T;

  if (method === "POST" && resource === "assistant") {
    const prompt = (body as { prompt?: string } | null)?.prompt ?? "";
    if (prompt.trim().length === 0) {
      throw new ApiError(422, { code: "EMPTY_PROMPT", message: "A prompt is required." });
    }
    return fixtures.assistant(prompt) as T;
  }

  return null;
}

function resolveAlerts<T>(method: string, seg: string[]): T | null {
  const [, id, action] = seg;

  if (method === "GET" && !id) return alerts() as T;

  if (method === "POST" && id && action === "acknowledge") {
    const list = alerts();
    const index = list.findIndex((alert) => alert.id === id);
    if (index === -1) {
      throw new ApiError(404, { code: "ALERT_NOT_FOUND", message: `No alert with id ${id}.` });
    }
    list[index] = { ...list[index], acknowledged: true };
    return list[index] as T;
  }

  return null;
}
