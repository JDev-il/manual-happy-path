/** Alert endpoints. Response shapes come from CONTRACTS.md. */

import { apiRequest } from "@/services/http";
import type { PriceAlert } from "@/types";

export const alertsService = {
  getAll: (signal?: AbortSignal): Promise<PriceAlert[]> =>
    apiRequest<PriceAlert[]>("/alerts", { signal }),

  acknowledge: (id: string): Promise<PriceAlert> =>
    apiRequest<PriceAlert>(`/alerts/${encodeURIComponent(id)}/acknowledge`, { method: "POST" }),
};
