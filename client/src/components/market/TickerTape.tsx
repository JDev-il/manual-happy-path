"use client";

import styled, { keyframes } from "styled-components";
import { PriceChangeBadge } from "@/components/market/PriceChangeBadge";
import type { Quote, Ticker } from "@/types";

const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const Viewport = styled.div`
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surface.sunken};
  height: 2.25rem;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.surface.sunken},
      transparent 6%,
      transparent 94%,
      ${({ theme }) => theme.surface.sunken}
    );
  }
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: max-content;
  animation: ${scroll} 60s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  ${Viewport}:hover & {
    animation-play-state: paused;
  }
`;

const Item = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: 0 ${({ theme }) => theme.space[4]};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.secondary};
  white-space: nowrap;
`;

const Sym = styled.span`
  color: ${({ theme }) => theme.content.primary};
  font-weight: 600;
`;

export interface TickerTapeEntry {
  ticker: Ticker;
  quote: Quote;
  display: { price: string; change: string };
}

/** Continuously scrolling market strip. Pauses on hover and honours reduced motion. */
export function TickerTape({ entries }: { entries: readonly TickerTapeEntry[] }) {
  if (entries.length === 0) return null;
  // Duplicated once so the -50% translation loops seamlessly.
  const loop = [...entries, ...entries];

  return (
    <Viewport aria-label="Market ticker">
      <Track>
        {loop.map((entry, i) => (
          <Item key={`${entry.ticker.symbol}-${i}`}>
            <Sym>{entry.ticker.symbol}</Sym>
            {entry.display.price}
            <PriceChangeBadge direction={entry.quote.direction} value={entry.display.change} bare />
          </Item>
        ))}
      </Track>
    </Viewport>
  );
}
