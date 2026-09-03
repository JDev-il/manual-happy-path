"use client";

import styled from "styled-components";
import { PriceChangeBadge } from "@/components/market/PriceChangeBadge";
import { Sparkline } from "@/components/market/Sparkline";
import type { SparklinePoint, TrendDirection } from "@/types";

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.surface.raised};
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.text.xs};
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.content.muted};
`;

const Value = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xl};
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  color: ${({ theme }) => theme.content.primary};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
`;

const Trend = styled.div`
  width: 4.5rem;
  height: 1.5rem;
`;

export interface StatTileProps {
  label: string;
  /** Pre-formatted value string — formatting is a LOGIC concern. */
  value: string;
  delta?: { direction: TrendDirection; value: string };
  sparkline?: readonly SparklinePoint[];
}

/** Compact KPI tile used across the dashboard header row. */
export function StatTile({ label, value, delta, sparkline }: StatTileProps) {
  return (
    <Tile>
      <Label>{label}</Label>
      <Value>{value}</Value>
      <Footer>
        {delta ? <PriceChangeBadge direction={delta.direction} value={delta.value} /> : <span />}
        {sparkline && sparkline.length > 1 ? (
          <Trend>
            <Sparkline points={sparkline} direction={delta?.direction ?? "flat"} height={24} width={72} />
          </Trend>
        ) : null}
      </Footer>
    </Tile>
  );
}
