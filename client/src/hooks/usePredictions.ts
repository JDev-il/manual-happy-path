"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatConfidence, formatCurrency, formatSignedPercent } from "@/lib/format";
import { queryKeys, staleTimes } from "@/lib/query-keys";
import { aiService } from "@/services/ai.service";
import type { AiPrediction } from "@/types";

/** Mirrors `PredictionEntry` in components/ai/PredictionPanel.tsx. */
export interface PredictionEntryModel {
  prediction: AiPrediction;
  display: { target: string; expectedChange: string; confidence: string };
}

export interface UsePredictionsResult {
  entries: PredictionEntryModel[];
  isLoading: boolean;
  isError: boolean;
}

/** Model projections, most confident first. */
export function usePredictions(): UsePredictionsResult {
  const query = useQuery({
    queryKey: queryKeys.ai.predictions(),
    queryFn: ({ signal }) => aiService.getPredictions(signal),
    staleTime: staleTimes.slow,
  });

  const entries = useMemo<PredictionEntryModel[]>(
    () =>
      [...(query.data ?? [])]
        .sort((a, b) => b.confidence - a.confidence)
        .map((prediction) => ({
          prediction,
          display: {
            target: formatCurrency(prediction.targetPrice),
            expectedChange: formatSignedPercent(prediction.expectedChangePercent),
            confidence: formatConfidence(prediction.confidence),
          },
        })),
    [query.data],
  );

  return { entries, isLoading: query.isPending, isError: query.isError };
}
