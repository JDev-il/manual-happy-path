"use client";

import styled from "styled-components";
import type { MarketSessionState } from "@/types";

const LABELS: Record<MarketSessionState, string> = {
  pre: "Pre-market",
  open: "Market open",
  post: "After hours",
  closed: "Market closed",
};

const Pill = styled.span<{ $live: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: 2px ${({ theme }) => theme.space[2]};
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme, $live }) => ($live ? theme.market.up : theme.content.muted)};
  white-space: nowrap;
`;

const Dot = styled.span<{ $live: boolean }>`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme, $live }) => ($live ? theme.market.up : theme.market.flat)};
`;

/** Session indicator for the active exchange. */
export function MarketSessionPill({ session }: { session: MarketSessionState }) {
  const live = session === "open";
  return (
    <Pill $live={live}>
      <Dot $live={live} aria-hidden />
      {LABELS[session]}
    </Pill>
  );
}
