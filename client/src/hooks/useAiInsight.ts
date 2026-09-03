"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatConfidence, formatRelativeTime } from "@/lib/format";
import { queryKeys, staleTimes } from "@/lib/query-keys";
import { aiService } from "@/services/ai.service";
import type { AiInsight } from "@/types";

export interface UseAiInsightResult {
  /** Highest-conviction insight — the card shows one at a time. */
  insight: AiInsight | null;
  insights: AiInsight[];
  display: { confidence: string; timestamp: string };
  isLoading: boolean;
  isError: boolean;
}

const EMPTY_DISPLAY = { confidence: "—", timestamp: "—" } as const;

const STRENGTH_RANK = { strong: 3, moderate: 2, weak: 1 } as const;

export function useAiInsight(limit = 5): UseAiInsightResult {
  const query = useQuery({
    queryKey: queryKeys.ai.insights(limit),
    queryFn: ({ signal }) => aiService.getInsights(limit, signal),
    staleTime: staleTimes.slow,
  });

  const insights = useMemo(
    () =>
      [...(query.data ?? [])].sort((a, b) => {
        const byStrength = STRENGTH_RANK[b.strength] - STRENGTH_RANK[a.strength];
        return byStrength !== 0 ? byStrength : b.confidence - a.confidence;
      }),
    [query.data],
  );

  const insight = insights[0] ?? null;

  // `dataUpdatedAt` rather than Date.now(): stable between server and client render.
  const display = useMemo(() => {
    if (!insight) return EMPTY_DISPLAY;
    return {
      confidence: formatConfidence(insight.confidence),
      timestamp: formatRelativeTime(insight.createdAt, { now: query.dataUpdatedAt }),
    };
  }, [insight, query.dataUpdatedAt]);

  return { insight, insights, display, isLoading: query.isPending, isError: query.isError };
}
