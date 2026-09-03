/**
 * Every cache key in the app, in one hierarchy.
 *
 * Keys are built here rather than inline so invalidation can target a whole
 * branch (`queryKeys.market.all`) without guessing at tuple shapes.
 */

import type { MoverDirection, TimeRange } from "@/types";

export const queryKeys = {
  market: {
    all: ["market"] as const,
    tape: () => [...queryKeys.market.all, "tape"] as const,
    watchlist: () => [...queryKeys.market.all, "watchlist"] as const,
    movers: (direction: MoverDirection) => [...queryKeys.market.all, "movers", direction] as const,
    quote: (symbol: string) => [...queryKeys.market.all, "quote", symbol] as const,
    series: (symbol: string, range: TimeRange) =>
      [...queryKeys.market.all, "series", symbol, range] as const,
    heatmap: () => [...queryKeys.market.all, "heatmap"] as const,
    indices: () => [...queryKeys.market.all, "indices"] as const,
  },
  portfolio: {
    all: ["portfolio"] as const,
    summary: () => [...queryKeys.portfolio.all, "summary"] as const,
  },
  ai: {
    all: ["ai"] as const,
    insights: (limit?: number) => [...queryKeys.ai.all, "insights", limit ?? "all"] as const,
    predictions: () => [...queryKeys.ai.all, "predictions"] as const,
    sentiment: (symbol: string | null) => [...queryKeys.ai.all, "sentiment", symbol ?? "market"] as const,
    suggestions: () => [...queryKeys.ai.all, "suggestions"] as const,
    digest: () => [...queryKeys.ai.all, "digest"] as const,
  },
  news: {
    all: ["news"] as const,
    feed: (symbols: readonly string[]) => [...queryKeys.news.all, "feed", [...symbols].sort().join(",")] as const,
  },
  alerts: {
    all: ["alerts"] as const,
    list: () => [...queryKeys.alerts.all, "list"] as const,
  },
} as const;

/** Cache lifetimes by data volatility, in milliseconds. */
export const staleTimes = {
  /** Live prices — refetch aggressively. */
  realtime: 10_000,
  /** Signals and derived views that move with the session. */
  session: 60_000,
  /** Editorial and model output regenerated on a slower cadence. */
  slow: 5 * 60_000,
} as const;

/** Background refetch intervals, in milliseconds. */
export const refetchIntervals = {
  realtime: 15_000,
  session: 60_000,
} as const;
