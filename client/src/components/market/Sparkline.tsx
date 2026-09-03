"use client";

import styled from "styled-components";
import type { SparklinePoint, TrendDirection } from "@/types";

const Svg = styled.svg<{ $direction: TrendDirection }>`
  display: block;
  width: 100%;
  height: 100%;
  color: ${({ theme, $direction }) =>
    $direction === "up" ? theme.market.up : $direction === "down" ? theme.market.down : theme.market.flat};
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.xs};
  background: ${({ theme }) => theme.surface.overlay};
`;

export interface SparklineProps {
  points: readonly SparklinePoint[];
  direction: TrendDirection;
  width?: number;
  height?: number;
}

/**
 * Inline trend line. Renders whatever series it is given — series selection,
 * resampling, and range switching belong to LOGIC.
 */
export function Sparkline({ points, direction, width = 120, height = 32 }: SparklineProps) {
  if (points.length < 2) return <Placeholder aria-hidden />;

  const values = points.map((p) => p.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (points.length - 1);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)},${(height - ((p.v - min) / span) * height).toFixed(2)}`)
    .join(" ");

  return (
    <Svg
      $direction={direction}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-hidden
    >
      <path d={`${path} L${width},${height} L0,${height} Z`} fill="currentColor" opacity={0.12} />
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}
