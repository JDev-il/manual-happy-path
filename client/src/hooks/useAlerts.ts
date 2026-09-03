"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { buildTimestampMap } from "@/lib/format";
import { queryKeys, refetchIntervals, staleTimes } from "@/lib/query-keys";
import { alertsService } from "@/services/alerts.service";
import type { AlertSeverity, PriceAlert } from "@/types";

export interface UseAlertsResult {
  alerts: PriceAlert[];
  /** Bare elapsed labels ("12m") — the panel supplies its own wording. */
  timestamps: Record<string, string>;
  unacknowledgedCount: number;
  acknowledge: (id: string) => void;
  isAcknowledging: boolean;
  isLoading: boolean;
  isError: boolean;
}

const SEVERITY_RANK: Record<AlertSeverity, number> = { critical: 3, warning: 2, info: 1 };

/** Unacknowledged first, then severity, then most recent. */
const byUrgency = (a: PriceAlert, b: PriceAlert): number => {
  if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
  const bySeverity = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
  if (bySeverity !== 0) return bySeverity;
  return Date.parse(b.triggeredAt) - Date.parse(a.triggeredAt);
};

export function useAlerts(): UseAlertsResult {
  const queryClient = useQueryClient();
  const key = queryKeys.alerts.list();

  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => alertsService.getAll(signal),
    staleTime: staleTimes.session,
    refetchInterval: refetchIntervals.session,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => alertsService.acknowledge(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<PriceAlert[]>(key);
      queryClient.setQueryData<PriceAlert[]>(key, (current) =>
        (current ?? []).map((alert) =>
          alert.id === id ? { ...alert, acknowledged: true } : alert,
        ),
      );
      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const alerts = useMemo(() => [...(query.data ?? [])].sort(byUrgency), [query.data]);

  const timestamps = useMemo(
    () =>
      buildTimestampMap(alerts, (alert) => alert.triggeredAt, {
        now: query.dataUpdatedAt,
        suffix: false,
      }),
    [alerts, query.dataUpdatedAt],
  );

  const unacknowledgedCount = useMemo(
    () => alerts.reduce((count, alert) => (alert.acknowledged ? count : count + 1), 0),
    [alerts],
  );

  const { mutate } = mutation;
  const acknowledge = useCallback((id: string) => mutate(id), [mutate]);

  return {
    alerts,
    timestamps,
    unacknowledgedCount,
    acknowledge,
    isAcknowledging: mutation.isPending,
    isLoading: query.isPending,
    isError: query.isError,
  };
}
