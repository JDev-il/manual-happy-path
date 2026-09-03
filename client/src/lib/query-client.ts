/**
 * QueryClient construction and defaults.
 *
 * A fresh client is created per browser session (and per request on the
 * server) so cached data is never shared between users.
 */

import { QueryClient, isServer } from "@tanstack/react-query";
import { ApiError } from "@/services/api-error";
import { staleTimes } from "@/lib/query-keys";

/** Retrying a 4xx just repeats the same rejection — only retry transient faults. */
const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (ApiError.isApiError(error) && error.isClientError) return false;
  return failureCount < 2;
};

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: staleTimes.session,
        gcTime: 10 * 60_000,
        retry: shouldRetry,
        retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 8_000),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Server: always a new client, so no request leaks state into another.
 * Browser: one client for the tab, preserved across React suspensions.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}
