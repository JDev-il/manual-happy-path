"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { buildTimestampMap } from "@/lib/format";
import { queryKeys, staleTimes } from "@/lib/query-keys";
import { newsService } from "@/services/news.service";
import type { NewsItem } from "@/types";

export interface UseNewsFeedResult {
  items: NewsItem[];
  timestamps: Record<string, string>;
  isLoading: boolean;
  isError: boolean;
}

const NO_SYMBOLS: readonly string[] = [];

/** Symbol-tagged news, newest first. Pass symbols to narrow the feed. */
export function useNewsFeed(symbols: readonly string[] = NO_SYMBOLS): UseNewsFeedResult {
  const query = useQuery({
    queryKey: queryKeys.news.feed(symbols),
    queryFn: ({ signal }) => newsService.getFeed(symbols, signal),
    staleTime: staleTimes.session,
  });

  const items = useMemo(
    () =>
      [...(query.data ?? [])].sort(
        (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
      ),
    [query.data],
  );

  const timestamps = useMemo(
    () => buildTimestampMap(items, (item) => item.publishedAt, { now: query.dataUpdatedAt }),
    [items, query.dataUpdatedAt],
  );

  return { items, timestamps, isLoading: query.isPending, isError: query.isError };
}
