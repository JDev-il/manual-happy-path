"use client";

import styled from "styled-components";
import { Star } from "lucide-react";
import { PriceChangeBadge } from "@/components/market/PriceChangeBadge";
import { Sparkline } from "@/components/market/Sparkline";
import type { WatchlistItem } from "@/types";

const Row = styled.li`
  display: grid;
  grid-template-columns: 1.25rem minmax(0, 1fr) 5rem 5.5rem 5rem;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};

  &:hover {
    background: ${({ theme }) => theme.surface.overlay};
  }

  @media (max-width: 30rem) {
    grid-template-columns: 1.25rem minmax(0, 1fr) 5.5rem;

    & > :nth-child(3),
    & > :nth-child(5) {
      display: none;
    }
  }
`;

const Pin = styled.button<{ $pinned: boolean }>`
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  color: ${({ theme, $pinned }) => ($pinned ? theme.status.warning : theme.content.muted)};

  svg {
    width: 0.875rem;
    height: 0.875rem;
    fill: ${({ $pinned }) => ($pinned ? "currentColor" : "none")};
  }
`;

const Identity = styled.div`
  min-width: 0;
`;

const Symbol = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.content.primary};
`;

const Name = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Trend = styled.div`
  height: 1.5rem;
`;

const Price = styled.span`
  justify-self: end;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.sm};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.content.primary};
`;

const Change = styled.div`
  justify-self: end;
`;

export interface WatchlistRowProps {
  item: WatchlistItem;
  display: { price: string; change: string };
  onTogglePin?: (id: string) => void;
}

/** One watchlist entry. Pin toggling is delegated upward — no state held here. */
export function WatchlistRow({ item, display, onTogglePin }: WatchlistRowProps) {
  return (
    <Row>
      <Pin
        $pinned={item.pinned}
        type="button"
        aria-label={item.pinned ? `Unpin ${item.ticker.symbol}` : `Pin ${item.ticker.symbol}`}
        aria-pressed={item.pinned}
        onClick={() => onTogglePin?.(item.id)}
      >
        <Star aria-hidden />
      </Pin>
      <Identity>
        <Symbol>{item.ticker.symbol}</Symbol>
        <Name>{item.ticker.name}</Name>
      </Identity>
      <Trend>
        <Sparkline points={item.sparkline} direction={item.quote.direction} height={24} />
      </Trend>
      <Price>{display.price}</Price>
      <Change>
        <PriceChangeBadge direction={item.quote.direction} value={display.change} />
      </Change>
    </Row>
  );
}
