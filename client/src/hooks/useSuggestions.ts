"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatConfidence } from "@/lib/format";
import { queryKeys, staleTimes } from "@/lib/query-keys";
import { aiService } from "@/services/ai.service";
import type { AiSuggestion } from "@/types";

/** Mirrors `SuggestionEntry` in components/ai/SuggestionList.tsx. */
export interface SuggestionEntryModel {
  suggestion: AiSuggestion;
  display: { confidence: string };
}

export interface UseSuggestionsResult {
  entries: SuggestionEntryModel[];
  isLoading: boolean;
  isError: boolean;
}

/** Suggestions ranked by model conviction, as the panel's description promises. */
export function useSuggestions(): UseSuggestionsResult {
  const query = useQuery({
    queryKey: queryKeys.ai.suggestions(),
    queryFn: ({ signal }) => aiService.getSuggestions(signal),
    staleTime: staleTimes.slow,
  });

  const entries = useMemo<SuggestionEntryModel[]>(
    () =>
      [...(query.data ?? [])]
        .sort((a, b) => b.confidence - a.confidence)
        .map((suggestion) => ({
          suggestion,
          display: { confidence: formatConfidence(suggestion.confidence) },
        })),
    [query.data],
  );

  return { entries, isLoading: query.isPending, isError: query.isError };
}
