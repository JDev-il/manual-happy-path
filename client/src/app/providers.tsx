"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { StyledComponentsRegistry } from "@/lib/registry";

/**
 * Client-side provider stack.
 *
 * The QueryClient is created by `@/lib/query-client` — fresh per request on the
 * server, memoised per tab in the browser — so no cache is shared across users.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <StyledComponentsRegistry>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StyledComponentsRegistry>
  );
}
