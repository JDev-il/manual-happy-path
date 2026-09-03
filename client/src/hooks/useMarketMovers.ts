"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { formatSignedPercent } from "@/lib/format";
import { queryKeys, refetchIntervals, staleTimes } from "@/lib/query-keys";
import { marketService } from "@/services/market.service";
import type { MarketMover, MoverDirection } from "@/types";

/** Mirrors `MarketMoverEntry` in components/market/MarketMoversPanel.tsx. */
export interface MarketMoverEntryModel {
  mover: MarketMover;
  display: { change: string };
}

export interface UseMarketMoversResult {
  entries: MarketMoverEntryModel[];
  isLoading: boolean;
  isError: boolean;
  direction: MoverDirection;
  /** Accepts the raw tab value the component emits and validates it here. */
  setDirection: (value: string) => void;
}

const DIRECTIONS: readonly MoverDirection[] = ["gainers", "losers", "active"];

const isDirection = (value: string): value is MoverDirection =>
  (DIRECTIONS as readonly string[]).includes(value);

export function useMarketMovers(initial: MoverDirection = "gainers"): UseMarketMoversResult {
  const [direction, setDirectionState] = useState<MoverDirection>(initial);

  const query = useQuery({
    queryKey: queryKeys.market.movers(direction),
    queryFn: ({ signal }) => marketService.getMovers(direction, signal),
    staleTime: staleTimes.realtime,
    refetchInterval: refetchIntervals.realtime,
    // Keeps the previous tab's rows on screen while the next tab loads.
    placeholderData: (previous) => previous,
  });

  const entries = useMemo<MarketMoverEntryModel[]>(
    () =>
      (query.data ?? []).map((mover) => ({
        mover,
        display: { change: formatSignedPercent(mover.quote.changePercent) },
      })),
    [query.data],
  );

  const setDirection = useCallback((value: string) => {
    if (isDirection(value)) setDirectionState(value);
  }, []);

  return {
    entries,
    isLoading: query.isPending,
    isError: query.isError,
    direction,
    setDirection,
  };
}
