/**
 * The client logic surface.
 *
 * UI components import from here — never from `@/services` and never from a
 * transport module. One hook per panel, each returning the exact prop shape
 * that panel already declares.
 */

export { useAiAssistant, type UseAiAssistantResult } from "@/hooks/useAiAssistant";
export { useAiInsight, type UseAiInsightResult } from "@/hooks/useAiInsight";
export { useAlerts, type UseAlertsResult } from "@/hooks/useAlerts";
export { useDigest, type UseDigestResult } from "@/hooks/useDigest";
export { useIndexStats, type StatTileModel, type UseIndexStatsResult } from "@/hooks/useIndexStats";
export { useMarketHeatmap, type UseMarketHeatmapResult } from "@/hooks/useMarketHeatmap";
export {
  useMarketMovers,
  type MarketMoverEntryModel,
  type UseMarketMoversResult,
} from "@/hooks/useMarketMovers";
export { useNewsFeed, type UseNewsFeedResult } from "@/hooks/useNewsFeed";
export {
  usePortfolioSummary,
  type PortfolioSummaryDisplay,
  type UsePortfolioSummaryResult,
} from "@/hooks/usePortfolioSummary";
export {
  usePredictions,
  type PredictionEntryModel,
  type UsePredictionsResult,
} from "@/hooks/usePredictions";
export { usePriceChart, type UsePriceChartResult } from "@/hooks/usePriceChart";
export { useSentiment, type UseSentimentResult } from "@/hooks/useSentiment";
export {
  useSuggestions,
  type SuggestionEntryModel,
  type UseSuggestionsResult,
} from "@/hooks/useSuggestions";
export {
  useTickerTape,
  type TickerTapeEntryModel,
  type UseTickerTapeResult,
} from "@/hooks/useTickerTape";
export { useWatchlist, type UseWatchlistResult, type WatchlistRowModel } from "@/hooks/useWatchlist";
