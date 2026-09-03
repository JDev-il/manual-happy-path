/** Portfolio endpoints. Response shapes come from CONTRACTS.md. */

import { apiRequest } from "@/services/http";
import type { PortfolioSummary } from "@/types";

export const portfolioService = {
  getSummary: (signal?: AbortSignal): Promise<PortfolioSummary> =>
    apiRequest<PortfolioSummary>("/portfolio/summary", { signal }),
};
