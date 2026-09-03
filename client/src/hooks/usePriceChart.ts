"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { formatPrice, formatSignedPercent } from "@/lib/format";
import { queryKeys, refetchIntervals, staleTimes } from "@/lib/query-keys";
import { marketService } from "@/services/market.service";
import type { PriceSeries, Quote, Ticker, TimeRange } from "@/types";

export interface UsePriceChartResult {
  ticker: Ticker | null;
  quote: Quote | null;
  series: PriceSeries | null;
  display: { price: string; change: string };
  range: TimeRange;
  setRange: (range: TimeRange) => void;
  isLoading: boolean;
  isError: boolean;
}

const EMPTY_DISPLAY = { price: "—", change: "—" } as const;

/**
 * Focused instrument chart. Quote and series are separate queries because they
 * refresh on different cadences — the price ticks, the window does not.
 */
export function usePriceChart(symbol: string, initialRange: TimeRange = "1D"): UsePriceChartResult {
  const [range, setRange] = useState<TimeRange>(initialRange);

  const quoteQuery = useQuery({
    queryKey: queryKeys.market.quote(symbol),
    queryFn: ({ signal }) => marketService.getQuote(symbol, signal),
    staleTime: staleTimes.realtime,
    refetchInterval: refetchIntervals.realtime,
    enabled: symbol.length > 0,
  });

  const seriesQuery = useQuery({
    queryKey: queryKeys.market.series(symbol, range),
    queryFn: ({ signal }) => marketService.getSeries(symbol, range, signal),
    staleTime: staleTimes.session,
    enabled: symbol.length > 0,
    placeholderData: (previous) => previous,
  });

  const display = useMemo(() => {
    const quote = quoteQuery.data?.quote;
    if (!quote) return EMPTY_DISPLAY;
    return {
      price: formatPrice(quote.price),
      change: formatSignedPercent(quote.changePercent),
    };
  }, [quoteQuery.data]);

  const changeRange = useCallback((next: TimeRange) => setRange(next), []);

  return {
    ticker: quoteQuery.data?.ticker ?? null,
    quote: quoteQuery.data?.quote ?? null,
    series: seriesQuery.data ?? null,
    display,
    range,
    setRange: changeRange,
    isLoading: quoteQuery.isPending || seriesQuery.isPending,
    isError: quoteQuery.isError || seriesQuery.isError,
  };
}
