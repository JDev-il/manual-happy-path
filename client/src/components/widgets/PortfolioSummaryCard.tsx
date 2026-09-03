"use client";

import styled from "styled-components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceChangeBadge } from "@/components/market/PriceChangeBadge";
import type { PortfolioSummary } from "@/types";

const Total = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Value = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text["2xl"]};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.content.primary};
`;

const Metrics = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
  gap: ${({ theme }) => theme.space[3]};
  margin: 0;
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

const Key = styled.dt`
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.muted};
`;

const Val = styled.dd`
  margin: 0;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.sm};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.content.primary};
`;

export interface PortfolioSummaryCardProps {
  summary: PortfolioSummary;
  /** Pre-formatted strings — formatting is a LOGIC concern. */
  display: {
    totalValue: string;
    dayChange: string;
    totalReturn: string;
    positionCount: string;
    asOf: string;
  };
}

/** Aggregate view of the user's holdings. */
export function PortfolioSummaryCard({ summary, display }: PortfolioSummaryCardProps) {
  const dayDirection = summary.dayChange > 0 ? "up" : summary.dayChange < 0 ? "down" : "flat";

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Portfolio</CardTitle>
          <CardDescription>As of {display.asOf}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Total>
          <Value>{display.totalValue}</Value>
          <PriceChangeBadge direction={dayDirection} value={display.dayChange} />
        </Total>
        <Metrics>
          <Metric>
            <Key>Total return</Key>
            <Val>{display.totalReturn}</Val>
          </Metric>
          <Metric>
            <Key>Positions</Key>
            <Val>{display.positionCount}</Val>
          </Metric>
          <Metric>
            <Key>Currency</Key>
            <Val>{summary.currency}</Val>
          </Metric>
        </Metrics>
      </CardContent>
    </Card>
  );
}
