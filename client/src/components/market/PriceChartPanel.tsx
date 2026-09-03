"use client";

import { useState } from "react";
import styled from "styled-components";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { PriceChangeBadge } from "@/components/market/PriceChangeBadge";
import { Sparkline } from "@/components/market/Sparkline";
import type { PriceSeries, Quote, Ticker, TimeRange } from "@/types";

const RANGES: readonly TabItem[] = (["1D", "1W", "1M", "3M", "1Y", "5Y", "MAX"] as const).map((r) => ({
  value: r,
  label: r,
}));

const Identity = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

const Symbol = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.content.primary};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
`;

const Price = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text["2xl"]};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.content.primary};
`;

const Plot = styled.div`
  height: 16rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surface.sunken};
  padding: ${({ theme }) => theme.space[2]};

  @media (max-width: 48rem) {
    height: 11rem;
  }
`;

export interface PriceChartPanelProps {
  ticker: Ticker;
  quote: Quote;
  series: PriceSeries | null;
  display: { price: string; change: string };
  onRangeChange?: (range: TimeRange) => void;
}

/**
 * Primary instrument chart.
 * TODO(UI): the Sparkline stands in for the full candlestick/volume chart —
 * replace once the charting dependency is chosen and LOGIC supplies the series.
 */
export function PriceChartPanel({ ticker, quote, series, display, onRangeChange }: PriceChartPanelProps) {
  const [range, setRange] = useState<TimeRange>(series?.range ?? "1D");

  return (
    <Card>
      <CardHeader>
        <Identity>
          <Symbol>
            {ticker.symbol} · {ticker.exchange}
          </Symbol>
          <PriceRow>
            <Price>{display.price}</Price>
            <PriceChangeBadge direction={quote.direction} value={display.change} />
          </PriceRow>
        </Identity>
        <Tabs
          items={RANGES}
          value={range}
          onValueChange={(v) => {
            setRange(v as TimeRange);
            onRangeChange?.(v as TimeRange);
          }}
        />
      </CardHeader>
      <CardContent>
        <Plot>
          <Sparkline points={series?.points ?? []} direction={quote.direction} width={600} height={220} />
        </Plot>
      </CardContent>
    </Card>
  );
}
