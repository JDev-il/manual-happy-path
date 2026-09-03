"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatSignedPercent } from "@/lib/format";
import { queryKeys, refetchIntervals, staleTimes } from "@/lib/query-keys";
import { marketService } from "@/services/market.service";
import type { HeatmapCell } from "@/types";

export interface UseMarketHeatmapResult {
  cells: HeatmapCell[];
  /** Pre-formatted delta label per symbol, as the component expects. */
  labels: Record<string, string>;
  isLoading: boolean;
  isError: boolean;
}

/** Heatmap tiles, largest weight first so the layout stays stable. */
export function useMarketHeatmap(): UseMarketHeatmapResult {
  const query = useQuery({
    queryKey: queryKeys.market.heatmap(),
    queryFn: ({ signal }) => marketService.getHeatmap(signal),
    staleTime: staleTimes.realtime,
    refetchInterval: refetchIntervals.realtime,
  });

  const cells = useMemo(
    () => [...(query.data ?? [])].sort((a, b) => b.weight - a.weight),
    [query.data],
  );

  const labels = useMemo(
    () =>
      Object.fromEntries(
        cells.map((cell) => [cell.symbol, formatSignedPercent(cell.changePercent, 1)]),
      ),
    [cells],
  );

  return { cells, labels, isLoading: query.isPending, isError: query.isError };
}
