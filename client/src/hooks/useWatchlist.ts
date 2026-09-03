"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { formatPrice, formatSignedPercent } from "@/lib/format";
import { queryKeys, refetchIntervals, staleTimes } from "@/lib/query-keys";
import { marketService } from "@/services/market.service";
import type { WatchlistItem } from "@/types";

/** Mirrors `WatchlistRowProps` in components/market/WatchlistRow.tsx. */
export interface WatchlistRowModel {
  item: WatchlistItem;
  display: { price: string; change: string };
}

export interface UseWatchlistResult {
  rows: WatchlistRowModel[];
  isLoading: boolean;
  isError: boolean;
  /** Pinned entries sort ahead of the rest — ordering is a logic decision. */
  togglePin: (id: string) => void;
  isPinning: boolean;
}

const byPinnedThenSymbol = (a: WatchlistItem, b: WatchlistItem): number => {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  return a.ticker.symbol.localeCompare(b.ticker.symbol);
};

export function useWatchlist(): UseWatchlistResult {
  const queryClient = useQueryClient();
  const key = queryKeys.market.watchlist();

  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => marketService.getWatchlist(signal),
    staleTime: staleTimes.realtime,
    refetchInterval: refetchIntervals.realtime,
  });

  const mutation = useMutation({
    mutationFn: ({ id, pinned }: { id: string; pinned: boolean }) =>
      marketService.setWatchlistPin(id, pinned),

    // Pinning must feel instant; the server result reconciles on settle.
    onMutate: async ({ id, pinned }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<WatchlistItem[]>(key);
      queryClient.setQueryData<WatchlistItem[]>(key, (current) =>
        (current ?? []).map((item) => (item.id === id ? { ...item, pinned } : item)),
      );
      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const items = useMemo(() => [...(query.data ?? [])].sort(byPinnedThenSymbol), [query.data]);

  const rows = useMemo<WatchlistRowModel[]>(
    () =>
      items.map((item) => ({
        item,
        display: {
          price: formatPrice(item.quote.price),
          change: formatSignedPercent(item.quote.changePercent),
        },
      })),
    [items],
  );

  const togglePin = useCallback(
    (id: string) => {
      const target = query.data?.find((item) => item.id === id);
      if (!target) return;
      mutation.mutate({ id, pinned: !target.pinned });
    },
    [mutation, query.data],
  );

  return {
    rows,
    isLoading: query.isPending,
    isError: query.isError,
    togglePin,
    isPinning: mutation.isPending,
  };
}
