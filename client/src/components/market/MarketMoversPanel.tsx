"use client";

import { useState } from "react";
import styled from "styled-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { PriceChangeBadge } from "@/components/market/PriceChangeBadge";
import type { MarketMover } from "@/types";

const TABS: readonly TabItem[] = [
  { value: "gainers", label: "Gainers" },
  { value: "losers", label: "Losers" },
  { value: "active", label: "Most active" },
];

const List = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: mover;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 1.25rem minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radius.sm};

  &:hover {
    background: ${({ theme }) => theme.surface.overlay};
  }
`;

const Rank = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.muted};
`;

const Symbol = styled.span`
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

export interface MarketMoverEntry {
  mover: MarketMover;
  display: { change: string };
}

export interface MarketMoversPanelProps {
  entries: readonly MarketMoverEntry[];
  defaultTab?: string;
  onTabChange?: (value: string) => void;
}

/**
 * Leaders and laggards.
 * TODO(UI): tab value currently drives presentation only — connect it to the
 * movers query parameter once LOGIC provides the hook.
 */
export function MarketMoversPanel({ entries, defaultTab = "gainers", onTabChange }: MarketMoversPanelProps) {
  const [tab, setTab] = useState(defaultTab);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market movers</CardTitle>
        <Tabs
          items={TABS}
          value={tab}
          onValueChange={(v) => {
            setTab(v);
            onTabChange?.(v);
          }}
        />
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <EmptyState title="No movers yet" hint="Data appears once the session opens." />
        ) : (
          <List>
            {entries.map(({ mover, display }) => (
              <Row key={mover.ticker.symbol}>
                <Rank>{mover.rank}</Rank>
                <div style={{ minWidth: 0 }}>
                  <Symbol>{mover.ticker.symbol}</Symbol>
                  <Name>{mover.ticker.name}</Name>
                </div>
                <PriceChangeBadge direction={mover.quote.direction} value={display.change} />
              </Row>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
