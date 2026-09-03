"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatPrice, formatSignedPercent } from "@/lib/format";
import { queryKeys, refetchIntervals, staleTimes } from "@/lib/query-keys";
import { marketService } from "@/services/market.service";
import type { Quote, Ticker } from "@/types";

/** Mirrors `TickerTapeEntry` in components/market/TickerTape.tsx. */
export interface TickerTapeEntryModel {
  ticker: Ticker;
  quote: Quote;
  display: { price: string; change: string };
}

export interface UseTickerTapeResult {
  entries: TickerTapeEntryModel[];
  isLoading: boolean;
  isError: boolean;
}

/** Scrolling market strip. Refetches on the realtime cadence. */
export function useTickerTape(): UseTickerTapeResult {
  const query = useQuery({
    queryKey: queryKeys.market.tape(),
    queryFn: ({ signal }) => marketService.getTape(signal),
    staleTime: staleTimes.realtime,
    refetchInterval: refetchIntervals.realtime,
  });

  const entries = useMemo<TickerTapeEntryModel[]>(
    () =>
      (query.data ?? []).map(({ ticker, quote }) => ({
        ticker,
        quote,
        display: {
          price: formatPrice(quote.price),
          change: formatSignedPercent(quote.changePercent),
        },
      })),
    [query.data],
  );

  return { entries, isLoading: query.isPending, isError: query.isError };
}
