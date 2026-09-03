/** News endpoints. Response shapes come from CONTRACTS.md. */

import { apiRequest } from "@/services/http";
import type { NewsItem } from "@/types";

export const newsService = {
  getFeed: (symbols: readonly string[] = [], signal?: AbortSignal): Promise<NewsItem[]> =>
    apiRequest<NewsItem[]>("/news", {
      query: { symbols: symbols.length > 0 ? symbols.join(",") : undefined },
      signal,
    }),
};
