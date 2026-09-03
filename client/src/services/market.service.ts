/** Market data endpoints. Response shapes come from CONTRACTS.md. */

import { apiRequest } from "@/services/http";
import type {
  HeatmapCell,
  IndexStat,
  MarketMover,
  MoverDirection,
  PriceSeries,
  Quote,
  Ticker,
  TimeRange,
  WatchlistItem,
} from "@/types";

export interface QuotedTicker {
  ticker: Ticker;
  quote: Quote;
}

export const marketService = {
  getTape: (signal?: AbortSignal): Promise<QuotedTicker[]> =>
    apiRequest<QuotedTicker[]>("/market/tape", { signal }),

  getWatchlist: (signal?: AbortSignal): Promise<WatchlistItem[]> =>
    apiRequest<WatchlistItem[]>("/market/watchlist", { signal }),

  setWatchlistPin: (id: string, pinned: boolean): Promise<WatchlistItem> =>
    apiRequest<WatchlistItem>(`/market/watchlist/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: { pinned },
    }),

  getMovers: (direction: MoverDirection, signal?: AbortSignal): Promise<MarketMover[]> =>
    apiRequest<MarketMover[]>("/market/movers", { query: { direction }, signal }),

  getQuote: (symbol: string, signal?: AbortSignal): Promise<QuotedTicker> =>
    apiRequest<QuotedTicker>(`/market/quote/${encodeURIComponent(symbol)}`, { signal }),

  getSeries: (symbol: string, range: TimeRange, signal?: AbortSignal): Promise<PriceSeries> =>
    apiRequest<PriceSeries>(`/market/series/${encodeURIComponent(symbol)}`, {
      query: { range },
      signal,
    }),

  getHeatmap: (signal?: AbortSignal): Promise<HeatmapCell[]> =>
    apiRequest<HeatmapCell[]>("/market/heatmap", { signal }),

  getIndices: (signal?: AbortSignal): Promise<IndexStat[]> =>
    apiRequest<IndexStat[]>("/market/indices", { signal }),
};
