"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { buildTimestampMap } from "@/lib/format";
import { queryKeys, staleTimes } from "@/lib/query-keys";
import { aiService } from "@/services/ai.service";
import type { DigestEntry } from "@/types";

export interface UseDigestResult {
  entries: DigestEntry[];
  timestamps: Record<string, string>;
  isLoading: boolean;
  isError: boolean;
}

/** AI market digest, newest first. */
export function useDigest(): UseDigestResult {
  const query = useQuery({
    queryKey: queryKeys.ai.digest(),
    queryFn: ({ signal }) => aiService.getDigest(signal),
    staleTime: staleTimes.slow,
  });

  const entries = useMemo(
    () =>
      [...(query.data ?? [])].sort(
        (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
      ),
    [query.data],
  );

  const timestamps = useMemo(
    () => buildTimestampMap(entries, (entry) => entry.publishedAt, { now: query.dataUpdatedAt }),
    [entries, query.dataUpdatedAt],
  );

  return { entries, timestamps, isLoading: query.isPending, isError: query.isError };
}
