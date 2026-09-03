/**
 * Client-side mirror of the shared contract defined in CONTRACTS.md.
 *
 * These declarations are the single import surface for every client agent.
 * They must stay byte-for-byte aligned with CONTRACTS.md — if a shape needs to
 * change, raise a CONTRACTS CHANGE PROPOSAL first; never edit this file alone.
 */

/* ── Enums ──────────────────────────────────────────────────────────── */

export type TrendDirection = "up" | "down" | "flat";
export type SignalStrength = "weak" | "moderate" | "strong";
export type SuggestionAction = "buy" | "sell" | "hold" | "watch";
export type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y" | "MAX";
export type AlertSeverity = "info" | "warning" | "critical";
export type AssetClass = "equity" | "etf" | "index" | "crypto" | "commodity" | "forex";
export type InsightSource = "prediction" | "digest" | "sentiment" | "anomaly" | "news";
export type MarketSessionState = "pre" | "open" | "post" | "closed";

/* ── Types ──────────────────────────────────────────────────────────── */

export interface Ticker {
  symbol: string;
  name: string;
  exchange: string;
  assetClass: AssetClass;
  currency: string;
}

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  direction: TrendDirection;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap: number | null;
  session: MarketSessionState;
  asOf: string;
}

export interface SparklinePoint {
  t: string;
  v: number;
}

export interface PriceSeries {
  symbol: string;
  range: TimeRange;
  points: SparklinePoint[];
}

export interface WatchlistItem {
  id: string;
  ticker: Ticker;
  quote: Quote;
  sparkline: SparklinePoint[];
  pinned: boolean;
}

export interface PortfolioSummary {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  currency: string;
  positionCount: number;
  asOf: string;
}

export interface MarketMover {
  ticker: Ticker;
  quote: Quote;
  rank: number;
}

export interface AiInsight {
  id: string;
  source: InsightSource;
  symbol: string | null;
  headline: string;
  body: string;
  strength: SignalStrength;
  confidence: number;
  createdAt: string;
}

export interface AiPrediction {
  id: string;
  symbol: string;
  horizon: TimeRange;
  targetPrice: number;
  currentPrice: number;
  expectedChangePercent: number;
  direction: TrendDirection;
  strength: SignalStrength;
  confidence: number;
  rationale: string;
  generatedAt: string;
}

export interface SentimentReading {
  symbol: string | null;
  score: number;
  label: "bearish" | "neutral" | "bullish";
  sampleSize: number;
  asOf: string;
}

export interface AiSuggestion {
  id: string;
  ticker: Ticker;
  action: SuggestionAction;
  strength: SignalStrength;
  confidence: number;
  reason: string;
  generatedAt: string;
}

export interface DigestEntry {
  id: string;
  title: string;
  summary: string;
  symbols: string[];
  publishedAt: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  url: string;
  symbols: string[];
  sentiment: SentimentReading | null;
  publishedAt: string;
}

export interface PriceAlert {
  id: string;
  ticker: Ticker;
  severity: AlertSeverity;
  message: string;
  triggeredAt: string;
  acknowledged: boolean;
}

export interface HeatmapCell {
  symbol: string;
  label: string;
  changePercent: number;
  weight: number;
}
