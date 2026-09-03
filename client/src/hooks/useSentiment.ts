"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatCount, formatScore } from "@/lib/format";
import { queryKeys, refetchIntervals, staleTimes } from "@/lib/query-keys";
import { aiService } from "@/services/ai.service";
import type { SentimentReading } from "@/types";

export interface UseSentimentResult {
  reading: SentimentReading | null;
  display: { score: string; sampleSize: string };
  isLoading: boolean;
  isError: boolean;
}

const EMPTY_DISPLAY = { score: "—", sampleSize: "—" } as const;

/** Aggregate sentiment. Pass a symbol for an instrument reading, null for the market. */
export function useSentiment(symbol: string | null = null): UseSentimentResult {
  const query = useQuery({
    queryKey: queryKeys.ai.sentiment(symbol),
    queryFn: ({ signal }) => aiService.getSentiment(symbol, signal),
    staleTime: staleTimes.session,
    refetchInterval: refetchIntervals.session,
  });

  const display = useMemo(() => {
    const reading = query.data;
    if (!reading) return EMPTY_DISPLAY;
    return {
      score: formatScore(reading.score),
      sampleSize: `${formatCount(reading.sampleSize)} signals`,
    };
  }, [query.data]);

  return {
    reading: query.data ?? null,
    display,
    isLoading: query.isPending,
    isError: query.isError,
  };
}
