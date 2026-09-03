"use client";

import { StyledComponentsRegistry } from "@/lib/registry";

/**
 * Client-side provider stack.
 * TODO(UI): the TanStack Query provider is intentionally absent — the LOGIC
 * agent owns the QueryClient and will nest it inside this component.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <StyledComponentsRegistry>{children}</StyledComponentsRegistry>;
}
