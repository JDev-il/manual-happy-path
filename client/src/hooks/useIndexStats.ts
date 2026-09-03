"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatPrice, formatSignedPercent } from "@/lib/format";
import { queryKeys, refetchIntervals, staleTimes } from "@/lib/query-keys";
import { marketService } from "@/services/market.service";
import type { SparklinePoint, TrendDirection } from "@/types";

/** Mirrors `StatTileProps` in components/widgets/StatTile.tsx. */
export interface StatTileModel {
  label: string;
  value: string;
  delta?: { direction: TrendDirection; value: string };
  sparkline?: readonly SparklinePoint[];
}

export interface UseIndexStatsResult {
  tiles: StatTileModel[];
  isLoading: boolean;
  isError: boolean;
}

/** KPI strip. Yield-style indices render with a trailing `%`, prices do not. */
export function useIndexStats(): UseIndexStatsResult {
  const query = useQuery({
    queryKey: queryKeys.market.indices(),
    queryFn: ({ signal }) => marketService.getIndices(signal),
    staleTime: staleTimes.realtime,
    refetchInterval: refetchIntervals.realtime,
  });

  const tiles = useMemo<StatTileModel[]>(
    () =>
      (query.data ?? []).map((stat) => ({
        label: stat.label,
        value:
          stat.unit === "percent"
            ? `${formatPrice(stat.value, stat.precision)}%`
            : formatPrice(stat.value, stat.precision),
        delta: {
          direction: stat.direction,
          value: formatSignedPercent(stat.changePercent),
        },
        sparkline: stat.sparkline,
      })),
    [query.data],
  );

  return { tiles, isLoading: query.isPending, isError: query.isError };
}
