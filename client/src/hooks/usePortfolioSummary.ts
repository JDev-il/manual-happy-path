"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  formatClockUtc,
  formatCount,
  formatCurrency,
  formatSignedPercent,
} from "@/lib/format";
import { queryKeys, refetchIntervals, staleTimes } from "@/lib/query-keys";
import { portfolioService } from "@/services/portfolio.service";
import type { PortfolioSummary } from "@/types";

/** Mirrors the `display` shape in components/widgets/PortfolioSummaryCard.tsx. */
export interface PortfolioSummaryDisplay {
  totalValue: string;
  dayChange: string;
  totalReturn: string;
  positionCount: string;
  asOf: string;
}

export interface UsePortfolioSummaryResult {
  summary: PortfolioSummary | null;
  display: PortfolioSummaryDisplay;
  isLoading: boolean;
  isError: boolean;
}

const EMPTY_DISPLAY: PortfolioSummaryDisplay = {
  totalValue: "—",
  dayChange: "—",
  totalReturn: "—",
  positionCount: "—",
  asOf: "—",
};

export function usePortfolioSummary(): UsePortfolioSummaryResult {
  const query = useQuery({
    queryKey: queryKeys.portfolio.summary(),
    queryFn: ({ signal }) => portfolioService.getSummary(signal),
    staleTime: staleTimes.session,
    refetchInterval: refetchIntervals.session,
  });

  const display = useMemo<PortfolioSummaryDisplay>(() => {
    const summary = query.data;
    if (!summary) return EMPTY_DISPLAY;
    return {
      totalValue: formatCurrency(summary.totalValue, summary.currency),
      dayChange: formatSignedPercent(summary.dayChangePercent),
      totalReturn: formatSignedPercent(summary.totalReturnPercent),
      positionCount: formatCount(summary.positionCount),
      asOf: formatClockUtc(summary.asOf),
    };
  }, [query.data]);

  return {
    summary: query.data ?? null,
    display,
    isLoading: query.isPending,
    isError: query.isError,
  };
}
