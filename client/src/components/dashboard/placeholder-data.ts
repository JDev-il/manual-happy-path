/**
 * Render fixtures — NOT application data.
 *
 * These exist only so every component shell can be seen rendering during the
 * scaffold phase. They contain no logic, no fetching, and no derivation.
 *
 * TODO(UI): delete this file once LOGIC supplies real queries, and swap the
 * `placeholder` import in DashboardView for the hooks it exposes.
 */

import type {
  AiInsight,
  AiPrediction,
  AiSuggestion,
  DigestEntry,
  HeatmapCell,
  MarketMover,
  NewsItem,
  PortfolioSummary,
  PriceAlert,
  PriceSeries,
  Quote,
  SentimentReading,
  SparklinePoint,
  Ticker,
  WatchlistItem,
} from "@/types";

const ticker = (symbol: string, name: string): Ticker => ({
  symbol,
  name,
  exchange: "NASDAQ",
  assetClass: "equity",
  currency: "USD",
});

const series = (seed: number, length = 32): SparklinePoint[] =>
  Array.from({ length }, (_, i) => ({
    t: new Date(Date.UTC(2026, 8, 3, 13, 30 + i * 10)).toISOString(),
    v: 100 + Math.sin((i + seed) / 3) * 6 + i * (seed % 3 === 0 ? 0.4 : -0.25),
  }));

const quote = (symbol: string, price: number, changePercent: number): Quote => ({
  symbol,
  price,
  change: Number(((price * changePercent) / 100).toFixed(2)),
  changePercent,
  direction: changePercent > 0 ? "up" : changePercent < 0 ? "down" : "flat",
  dayHigh: price * 1.014,
  dayLow: price * 0.985,
  volume: 41_200_000,
  marketCap: 2_940_000_000_000,
  session: "open",
  asOf: "2026-09-03T13:44:00.000Z",
});

const TICKERS = [
  ticker("NVDA", "NVIDIA Corporation"),
  ticker("AAPL", "Apple Inc."),
  ticker("MSFT", "Microsoft Corporation"),
  ticker("AMD", "Advanced Micro Devices"),
  ticker("TSLA", "Tesla, Inc."),
  ticker("META", "Meta Platforms, Inc."),
] as const;

const CHANGES = [2.41, -0.62, 0.88, 3.17, -1.94, 0.12] as const;
const PRICES = [184.22, 231.08, 447.9, 168.35, 274.61, 612.44] as const;

export const placeholder = {
  tape: TICKERS.map((t, i) => ({
    ticker: t,
    quote: quote(t.symbol, PRICES[i], CHANGES[i]),
    display: {
      price: PRICES[i].toFixed(2),
      change: `${CHANGES[i] > 0 ? "+" : ""}${CHANGES[i].toFixed(2)}%`,
    },
  })),

  watchlist: TICKERS.slice(0, 5).map((t, i): { item: WatchlistItem; display: { price: string; change: string } } => ({
    item: {
      id: `wl-${t.symbol}`,
      ticker: t,
      quote: quote(t.symbol, PRICES[i], CHANGES[i]),
      sparkline: series(i + 1),
      pinned: i < 2,
    },
    display: {
      price: PRICES[i].toFixed(2),
      change: `${CHANGES[i] > 0 ? "+" : ""}${CHANGES[i].toFixed(2)}%`,
    },
  })),

  movers: TICKERS.slice(0, 5).map((t, i): { mover: MarketMover; display: { change: string } } => ({
    mover: { ticker: t, quote: quote(t.symbol, PRICES[i], CHANGES[i]), rank: i + 1 },
    display: { change: `${CHANGES[i] > 0 ? "+" : ""}${CHANGES[i].toFixed(2)}%` },
  })),

  focus: {
    ticker: TICKERS[0],
    quote: quote("NVDA", PRICES[0], CHANGES[0]),
    series: { symbol: "NVDA", range: "1D", points: series(2, 64) } satisfies PriceSeries,
    display: { price: "184.22", change: "+2.41%" },
  },

  heatmap: {
    cells: TICKERS.map((t, i): HeatmapCell => ({
      symbol: t.symbol,
      label: t.name,
      changePercent: CHANGES[i],
      weight: 1,
    })).concat(
      ["GOOGL", "AMZN", "AVGO", "NFLX", "CRM", "ORCL"].map((s, i) => ({
        symbol: s,
        label: s,
        changePercent: [1.2, -2.3, 0.4, -0.9, 1.8, -0.3][i],
        weight: 1,
      })),
    ),
    labels: Object.fromEntries(
      TICKERS.map((t, i) => [t.symbol, `${CHANGES[i] > 0 ? "+" : ""}${CHANGES[i].toFixed(1)}%`]).concat(
        ["GOOGL", "AMZN", "AVGO", "NFLX", "CRM", "ORCL"].map((s, i) => {
          const v = [1.2, -2.3, 0.4, -0.9, 1.8, -0.3][i];
          return [s, `${v > 0 ? "+" : ""}${v.toFixed(1)}%`];
        }),
      ),
    ),
  },

  portfolio: {
    summary: {
      totalValue: 284_913.44,
      dayChange: 3_214.09,
      dayChangePercent: 1.14,
      totalReturn: 61_482.2,
      totalReturnPercent: 27.5,
      currency: "USD",
      positionCount: 18,
      asOf: "2026-09-03T13:44:00.000Z",
    } satisfies PortfolioSummary,
    display: {
      totalValue: "$284,913.44",
      dayChange: "+1.14%",
      totalReturn: "+27.50%",
      positionCount: "18",
      asOf: "13:44 UTC",
    },
  },

  stats: [
    { label: "S&P 500", value: "6,412.88", delta: { direction: "up" as const, value: "+0.74%" }, sparkline: series(1, 20) },
    { label: "Nasdaq 100", value: "23,104.51", delta: { direction: "up" as const, value: "+1.06%" }, sparkline: series(4, 20) },
    { label: "VIX", value: "13.42", delta: { direction: "down" as const, value: "-3.80%" }, sparkline: series(7, 20) },
    { label: "10Y Yield", value: "4.118%", delta: { direction: "flat" as const, value: "0.00%" }, sparkline: series(2, 20) },
  ],

  insight: {
    insight: {
      id: "in-1",
      source: "anomaly",
      symbol: "NVDA",
      headline: "Unusual call volume ahead of the supplier update",
      body:
        "Options flow in NVDA is running at 3.1× the twenty-day average, concentrated in near-dated calls. Similar clusters preceded a positive drift in four of the last five occurrences.",
      strength: "strong",
      confidence: 0.82,
      createdAt: "2026-09-03T13:10:00.000Z",
    } satisfies AiInsight,
    display: { confidence: "82%", timestamp: "34m ago" },
  },

  predictions: [
    {
      prediction: {
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
        generatedAt: "2026-09-03T12:00:00.000Z",
      } satisfies AiPrediction,
      display: { target: "$193.50", expectedChange: "+5.04%", confidence: "78%" },
    },
    {
      prediction: {
        id: "pr-2",
        symbol: "TSLA",
        horizon: "1M",
        targetPrice: 258.0,
        currentPrice: 274.61,
        expectedChangePercent: -6.05,
        direction: "down",
        strength: "moderate",
        confidence: 0.61,
        rationale: "Delivery run-rate is tracking below consensus while inventory days keep expanding.",
        generatedAt: "2026-09-03T12:00:00.000Z",
      } satisfies AiPrediction,
      display: { target: "$258.00", expectedChange: "-6.05%", confidence: "61%" },
    },
  ],

  sentiment: {
    reading: {
      symbol: null,
      score: 0.34,
      label: "bullish",
      sampleSize: 18_402,
      asOf: "2026-09-03T13:40:00.000Z",
    } satisfies SentimentReading,
    display: { score: "+0.34", sampleSize: "18,402 signals" },
  },

  suggestions: [
    {
      suggestion: {
        id: "sg-1",
        ticker: TICKERS[3],
        action: "buy",
        strength: "moderate",
        confidence: 0.67,
        reason: "Relative strength versus the semiconductor index has improved for six consecutive sessions.",
        generatedAt: "2026-09-03T11:20:00.000Z",
      } satisfies AiSuggestion,
      display: { confidence: "67%" },
    },
    {
      suggestion: {
        id: "sg-2",
        ticker: TICKERS[4],
        action: "watch",
        strength: "weak",
        confidence: 0.42,
        reason: "Signal is mixed — wait for the delivery print before sizing a position.",
        generatedAt: "2026-09-03T10:05:00.000Z",
      } satisfies AiSuggestion,
      display: { confidence: "42%" },
    },
  ],

  digest: {
    entries: [
      {
        id: "dg-1",
        title: "Semis lead a broad risk-on open",
        summary:
          "Semiconductors added 1.8% at the open on supplier commentary, dragging the wider index higher. Breadth is healthy — advancers lead decliners roughly two to one.",
        symbols: ["NVDA", "AMD", "AVGO"],
        publishedAt: "2026-09-03T13:35:00.000Z",
      },
      {
        id: "dg-2",
        title: "Rates steady into the afternoon auction",
        summary:
          "The ten-year is unchanged ahead of the auction. Rate-sensitive sectors are trading in line with the index rather than leading it.",
        symbols: ["TLT", "XLF"],
        publishedAt: "2026-09-03T12:50:00.000Z",
      },
    ] satisfies DigestEntry[],
    timestamps: { "dg-1": "9m ago", "dg-2": "54m ago" },
  },

  alerts: {
    alerts: [
      {
        id: "al-1",
        ticker: TICKERS[0],
        severity: "critical",
        message: "Crossed your $182.00 upside threshold",
        triggeredAt: "2026-09-03T13:32:00.000Z",
        acknowledged: false,
      },
      {
        id: "al-2",
        ticker: TICKERS[4],
        severity: "warning",
        message: "Volatility above the 30-day band",
        triggeredAt: "2026-09-03T13:02:00.000Z",
        acknowledged: false,
      },
      {
        id: "al-3",
        ticker: TICKERS[1],
        severity: "info",
        message: "Earnings call scheduled for 3 October",
        triggeredAt: "2026-09-03T09:00:00.000Z",
        acknowledged: true,
      },
    ] satisfies PriceAlert[],
    timestamps: { "al-1": "12m", "al-2": "42m", "al-3": "4h" },
  },

  news: {
    items: [
      {
        id: "nw-1",
        headline: "Chip supplier raises full-year capacity outlook",
        source: "Reuters",
        url: "https://example.com/1",
        symbols: ["NVDA", "AMD"],
        sentiment: {
          symbol: "NVDA",
          score: 0.61,
          label: "bullish",
          sampleSize: 812,
          asOf: "2026-09-03T13:20:00.000Z",
        },
        publishedAt: "2026-09-03T13:20:00.000Z",
      },
      {
        id: "nw-2",
        headline: "EV inventories climb for a third straight month",
        source: "Bloomberg",
        url: "https://example.com/2",
        symbols: ["TSLA"],
        sentiment: {
          symbol: "TSLA",
          score: -0.38,
          label: "bearish",
          sampleSize: 405,
          asOf: "2026-09-03T11:45:00.000Z",
        },
        publishedAt: "2026-09-03T11:45:00.000Z",
      },
      {
        id: "nw-3",
        headline: "Treasury auction demand steady, indirect bidders in line",
        source: "FT",
        url: "https://example.com/3",
        symbols: [],
        sentiment: null,
        publishedAt: "2026-09-03T10:30:00.000Z",
      },
    ] satisfies NewsItem[],
    timestamps: { "nw-1": "24m ago", "nw-2": "2h ago", "nw-3": "3h ago" },
  },
} as const;
