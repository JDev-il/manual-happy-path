"use client";

import styled from "styled-components";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PriceChangeBadge } from "@/components/market/PriceChangeBadge";
import { Sparkline } from "@/components/market/Sparkline";
import type { Quote, SparklinePoint, Ticker } from "@/types";

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
  max-width: 12rem;
`;

const Price = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xl};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.content.primary};
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
`;

const Chart = styled.div`
  height: 2.5rem;
  margin-top: ${({ theme }) => theme.space[3]};
`;

export interface QuoteCardProps {
  ticker: Ticker;
  quote: Quote;
  sparkline?: readonly SparklinePoint[];
  /** Pre-formatted strings supplied by the caller — formatting is a LOGIC concern. */
  display: { price: string; change: string };
}

/** Single-instrument price tile. */
export function QuoteCard({ ticker, quote, sparkline = [], display }: QuoteCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <Symbol>{ticker.symbol}</Symbol>
          <Name>{ticker.name}</Name>
        </div>
        <PriceChangeBadge direction={quote.direction} value={display.change} />
      </CardHeader>
      <CardContent>
        <Row>
          <Price>{display.price}</Price>
        </Row>
        <Chart>
          <Sparkline points={sparkline} direction={quote.direction} />
        </Chart>
      </CardContent>
    </Card>
  );
}
