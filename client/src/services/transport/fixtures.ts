/**
 * Deterministic stand-in data for the mock transport.
 *
 * This is NOT application state and NOT a render fixture — it is the payload a
 * real backend will return, shaped exactly to CONTRACTS.md. It exists only so
 * the query layer is exercisable before `backend/API` is built, and it is
 * reached solely through `mock-transport.ts`. Delete this directory once
 * API_BASE_URL points at a live backend.
 */

import type {
  AiInsight,
  AiPrediction,
  AiSuggestion,
  AssistantReply,
  DigestEntry,
  HeatmapCell,
  IndexStat,
  MarketMover,
  MoverDirection,
  NewsItem,
  PortfolioSummary,
  PriceAlert,
  PriceSeries,
  Quote,
  SentimentReading,
  SparklinePoint,
  Ticker,
  TimeRange,
  WatchlistItem,
} from "@/types";

/** Fixed clock so every payload is reproducible across renders and SSR. */
const EPOCH = Date.UTC(2026, 8, 3, 13, 44, 0);
const iso = (offsetMinutes = 0): string => new Date(EPOCH - offsetMinutes * 60_000).toISOString();

const ticker = (
  symbol: string,
  name: string,
  overrides: Partial<Ticker> = {},
): Ticker => ({
  symbol,
  name,
  exchange: "NASDAQ",
  assetClass: "equity",
  currency: "USD",
  ...overrides,
});

const TICKERS: Record<string, Ticker> = {
  NVDA: ticker("NVDA", "NVIDIA Corporation"),
  AAPL: ticker("AAPL", "Apple Inc."),
  MSFT: ticker("MSFT", "Microsoft Corporation"),
  AMD: ticker("AMD", "Advanced Micro Devices"),
  TSLA: ticker("TSLA", "Tesla, Inc."),
  META: ticker("META", "Meta Platforms, Inc."),
  GOOGL: ticker("GOOGL", "Alphabet Inc."),
  AMZN: ticker("AMZN", "Amazon.com, Inc."),
  AVGO: ticker("AVGO", "Broadcom Inc."),
  NFLX: ticker("NFLX", "Netflix, Inc."),
  CRM: ticker("CRM", "Salesforce, Inc.", { exchange: "NYSE" }),
  ORCL: ticker("ORCL", "Oracle Corporation", { exchange: "NYSE" }),
};

const MARKET: Record<string, { price: number; changePercent: number; volume: number; marketCap: number | null }> = {
  NVDA: { price: 184.22, changePercent: 2.41, volume: 41_200_000, marketCap: 4_520_000_000_000 },
  AAPL: { price: 231.08, changePercent: -0.62, volume: 52_800_000, marketCap: 3_480_000_000_000 },
  MSFT: { price: 447.9, changePercent: 0.88, volume: 21_400_000, marketCap: 3_330_000_000_000 },
  AMD: { price: 168.35, changePercent: 3.17, volume: 63_900_000, marketCap: 272_000_000_000 },
  TSLA: { price: 274.61, changePercent: -1.94, volume: 88_100_000, marketCap: 874_000_000_000 },
  META: { price: 612.44, changePercent: 0.12, volume: 14_600_000, marketCap: 1_550_000_000_000 },
  GOOGL: { price: 198.77, changePercent: 1.2, volume: 27_300_000, marketCap: 2_410_000_000_000 },
  AMZN: { price: 221.19, changePercent: -2.3, volume: 44_700_000, marketCap: 2_320_000_000_000 },
  AVGO: { price: 1_742.5, changePercent: 0.4, volume: 3_100_000, marketCap: 812_000_000_000 },
  NFLX: { price: 889.13, changePercent: -0.9, volume: 4_400_000, marketCap: 380_000_000_000 },
  CRM: { price: 318.62, changePercent: 1.8, volume: 6_200_000, marketCap: 305_000_000_000 },
  ORCL: { price: 187.44, changePercent: -0.3, volume: 9_800_000, marketCap: 521_000_000_000 },
};

const direction = (changePercent: number): Quote["direction"] =>
  changePercent > 0 ? "up" : changePercent < 0 ? "down" : "flat";

const round = (value: number, precision = 2): number =>
  Number(value.toFixed(precision));

const quoteFor = (symbol: string): Quote => {
  const m = MARKET[symbol];
  const change = round((m.price * m.changePercent) / 100);
  return {
    symbol,
    price: m.price,
    change,
    changePercent: m.changePercent,
    direction: direction(m.changePercent),
    dayHigh: round(m.price * 1.014),
    dayLow: round(m.price * 0.985),
    volume: m.volume,
    marketCap: m.marketCap,
    session: "open",
    asOf: iso(),
  };
};

/** Points per range — keeps every series visually proportional to its window. */
const RANGE_POINTS: Record<TimeRange, number> = {
  "1D": 64,
  "1W": 56,
  "1M": 60,
  "3M": 66,
  "1Y": 72,
  "5Y": 80,
  MAX: 96,
};

/** Minutes between samples per range. */
const RANGE_STEP_MINUTES: Record<TimeRange, number> = {
  "1D": 6,
  "1W": 180,
  "1M": 720,
  "3M": 2_160,
  "1Y": 7_200,
  "5Y": 36_000,
  MAX: 72_000,
};

/** Deterministic pseudo-random walk — same seed always yields the same series. */
const walk = (seed: number, length: number, amplitude: number): number[] => {
  const out: number[] = [];
  let value = 0;
  for (let i = 0; i < length; i += 1) {
    const noise = Math.sin((i + seed) * 1.7) * 0.6 + Math.cos((i + seed) * 0.43) * 0.4;
    value += noise * amplitude;
    out.push(value);
  }
  return out;
};

const seedOf = (symbol: string): number =>
  [...symbol].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 97;

const seriesFor = (symbol: string, range: TimeRange, length = RANGE_POINTS[range]): SparklinePoint[] => {
  const m = MARKET[symbol] ?? { price: 100, changePercent: 0 };
  const drift = walk(seedOf(symbol), length, m.price * 0.0018);
  const step = RANGE_STEP_MINUTES[range];
  const open = m.price - (m.price * m.changePercent) / 100;
  return drift.map((d, i) => ({
    t: iso((length - 1 - i) * step),
    v: round(open + d + ((m.price - open) * i) / Math.max(1, length - 1), 4),
  }));
};

const SYMBOLS = Object.keys(TICKERS);

/* ── Payload builders ───────────────────────────────────────────────── */

export const fixtures = {
  tape: (): Array<{ ticker: Ticker; quote: Quote }> =>
    SYMBOLS.slice(0, 8).map((s) => ({ ticker: TICKERS[s], quote: quoteFor(s) })),

  watchlist: (): WatchlistItem[] =>
    ["NVDA", "AAPL", "MSFT", "AMD", "TSLA"].map((s, i) => ({
      id: `wl-${s}`,
      ticker: TICKERS[s],
      quote: quoteFor(s),
      sparkline: seriesFor(s, "1D", 32),
      pinned: i < 2,
    })),

  movers: (direction_: MoverDirection): MarketMover[] => {
    const sorted = [...SYMBOLS].sort((a, b) => {
      if (direction_ === "active") return MARKET[b].volume - MARKET[a].volume;
      const delta = MARKET[b].changePercent - MARKET[a].changePercent;
      return direction_ === "gainers" ? delta : -delta;
    });
    return sorted.slice(0, 5).map((s, i) => ({
      ticker: TICKERS[s],
      quote: quoteFor(s),
      rank: i + 1,
    }));
  },

  quote: (symbol: string): { ticker: Ticker; quote: Quote } | null => {
    const key = symbol.toUpperCase();
    return TICKERS[key] ? { ticker: TICKERS[key], quote: quoteFor(key) } : null;
  },

  series: (symbol: string, range: TimeRange): PriceSeries | null => {
    const key = symbol.toUpperCase();
    return MARKET[key] ? { symbol: key, range, points: seriesFor(key, range) } : null;
  },

  heatmap: (): HeatmapCell[] =>
    SYMBOLS.map((s) => ({
      symbol: s,
      label: TICKERS[s].name,
      changePercent: MARKET[s].changePercent,
      weight: Math.max(0.4, (MARKET[s].marketCap ?? 0) / 4_520_000_000_000),
    })),

  indices: (): IndexStat[] => [
    {
      id: "spx",
      label: "S&P 500",
      value: 6_412.88,
      changePercent: 0.74,
      direction: "up",
      precision: 2,
      unit: "point",
      sparkline: seriesFor("NVDA", "1D", 20),
      asOf: iso(),
    },
    {
      id: "ndx",
      label: "Nasdaq 100",
      value: 23_104.51,
      changePercent: 1.06,
      direction: "up",
      precision: 2,
      unit: "point",
      sparkline: seriesFor("MSFT", "1D", 20),
      asOf: iso(),
    },
    {
      id: "vix",
      label: "VIX",
      value: 13.42,
      changePercent: -3.8,
      direction: "down",
      precision: 2,
      unit: "point",
      sparkline: seriesFor("TSLA", "1D", 20),
      asOf: iso(),
    },
    {
      id: "us10y",
      label: "10Y Yield",
      value: 4.118,
      changePercent: 0,
      direction: "flat",
      precision: 3,
      unit: "percent",
      sparkline: seriesFor("AAPL", "1D", 20),
      asOf: iso(),
    },
  ],

  portfolio: (): PortfolioSummary => ({
    totalValue: 284_913.44,
    dayChange: 3_214.09,
    dayChangePercent: 1.14,
    totalReturn: 61_482.2,
    totalReturnPercent: 27.5,
    currency: "USD",
    positionCount: 18,
    asOf: iso(),
  }),

  insights: (): AiInsight[] => [
    {
      id: "in-1",
      source: "anomaly",
      symbol: "NVDA",
      headline: "Unusual call volume ahead of the supplier update",
      body:
        "Options flow in NVDA is running at 3.1x the twenty-day average, concentrated in near-dated calls. Similar clusters preceded a positive drift in four of the last five occurrences.",
      strength: "strong",
      confidence: 0.82,
      createdAt: iso(34),
    },
    {
      id: "in-2",
      source: "sentiment",
      symbol: null,
      headline: "Breadth is confirming the index move",
      body:
        "Advancers lead decliners roughly two to one and the equal-weight index is tracking the cap-weight index within 12 basis points. The move is not being carried by a single name.",
      strength: "moderate",
      confidence: 0.64,
      createdAt: iso(76),
    },
  ],

  predictions: (): AiPrediction[] => [
    {
      id: "pr-1",
      symbol: "NVDA",
      horizon: "1W",
      targetPrice: 193.5,
      currentPrice: 184.22,
      expectedChangePercent: 5.04,
      direction: "up",
      strength: "strong",
      confidence: 0.78,
      rationale: "Momentum, supplier guidance, and positive options skew all align on the weekly horizon.",
      generatedAt: iso(104),
    },
    {
      id: "pr-2",
      symbol: "TSLA",
      horizon: "1M",
      targetPrice: 258,
      currentPrice: 274.61,
      expectedChangePercent: -6.05,
      direction: "down",
      strength: "moderate",
      confidence: 0.61,
      rationale: "Delivery run-rate is tracking below consensus while inventory days keep expanding.",
      generatedAt: iso(104),
    },
    {
      id: "pr-3",
      symbol: "AMD",
      horizon: "1W",
      targetPrice: 174.8,
      currentPrice: 168.35,
      expectedChangePercent: 3.83,
      direction: "up",
      strength: "moderate",
      confidence: 0.58,
      rationale: "Relative strength versus the semiconductor index has improved for six consecutive sessions.",
      generatedAt: iso(104),
    },
  ],

  sentiment: (symbol: string | null): SentimentReading => {
    if (!symbol) {
      return { symbol: null, score: 0.34, label: "bullish", sampleSize: 18_402, asOf: iso(4) };
    }
    const key = symbol.toUpperCase();
    const score = round(Math.max(-1, Math.min(1, (MARKET[key]?.changePercent ?? 0) / 4)), 2);
    return {
      symbol: key,
      score,
      label: score > 0.15 ? "bullish" : score < -0.15 ? "bearish" : "neutral",
      sampleSize: 400 + seedOf(key) * 17,
      asOf: iso(4),
    };
  },

  suggestions: (): AiSuggestion[] => [
    {
      id: "sg-1",
      ticker: TICKERS.AMD,
      action: "buy",
      strength: "moderate",
      confidence: 0.67,
      reason: "Relative strength versus the semiconductor index has improved for six consecutive sessions.",
      generatedAt: iso(144),
    },
    {
      id: "sg-2",
      ticker: TICKERS.TSLA,
      action: "watch",
      strength: "weak",
      confidence: 0.42,
      reason: "Signal is mixed - wait for the delivery print before sizing a position.",
      generatedAt: iso(219),
    },
    {
      id: "sg-3",
      ticker: TICKERS.MSFT,
      action: "hold",
      strength: "moderate",
      confidence: 0.55,
      reason: "Valuation and momentum offset each other; no edge in adding at this level.",
      generatedAt: iso(260),
    },
  ],

  digest: (): DigestEntry[] => [
    {
      id: "dg-1",
      title: "Semis lead a broad risk-on open",
      summary:
        "Semiconductors added 1.8% at the open on supplier commentary, dragging the wider index higher. Breadth is healthy - advancers lead decliners roughly two to one.",
      symbols: ["NVDA", "AMD", "AVGO"],
      publishedAt: iso(9),
    },
    {
      id: "dg-2",
      title: "Rates steady into the afternoon auction",
      summary:
        "The ten-year is unchanged ahead of the auction. Rate-sensitive sectors are trading in line with the index rather than leading it.",
      symbols: ["TLT", "XLF"],
      publishedAt: iso(54),
    },
  ],

  assistant: (prompt: string): AssistantReply => ({
    id: `as-${prompt.length}-${EPOCH}`,
    prompt,
    answer:
      "The assistant endpoint is not wired yet. Once API_BASE_URL points at the backend, this reply is replaced by the model response for the submitted prompt.",
    citations: [],
    answeredAt: iso(),
  }),

  news: (): NewsItem[] => [
    {
      id: "nw-1",
      headline: "Chip supplier raises full-year capacity outlook",
      source: "Reuters",
      url: "https://example.com/1",
      symbols: ["NVDA", "AMD"],
      sentiment: { symbol: "NVDA", score: 0.61, label: "bullish", sampleSize: 812, asOf: iso(24) },
      publishedAt: iso(24),
    },
    {
      id: "nw-2",
      headline: "EV inventories climb for a third straight month",
      source: "Bloomberg",
      url: "https://example.com/2",
      symbols: ["TSLA"],
      sentiment: { symbol: "TSLA", score: -0.38, label: "bearish", sampleSize: 405, asOf: iso(119) },
      publishedAt: iso(119),
    },
    {
      id: "nw-3",
      headline: "Treasury auction demand steady, indirect bidders in line",
      source: "FT",
      url: "https://example.com/3",
      symbols: [],
      sentiment: null,
      publishedAt: iso(194),
    },
  ],

  alerts: (): PriceAlert[] => [
    {
      id: "al-1",
      ticker: TICKERS.NVDA,
      severity: "critical",
      message: "Crossed your $182.00 upside threshold",
      triggeredAt: iso(12),
      acknowledged: false,
    },
    {
      id: "al-2",
      ticker: TICKERS.TSLA,
      severity: "warning",
      message: "Volatility above the 30-day band",
      triggeredAt: iso(42),
      acknowledged: false,
    },
    {
      id: "al-3",
      ticker: TICKERS.AAPL,
      severity: "info",
      message: "Earnings call scheduled for 3 October",
      triggeredAt: iso(284),
      acknowledged: true,
    },
  ],
};
