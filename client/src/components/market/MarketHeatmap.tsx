"use client";

import styled from "styled-components";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { HeatmapCell } from "@/types";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
  gap: ${({ theme }) => theme.space[1]};
`;

const Tile = styled.div<{ $direction: "up" | "down" | "flat"; $intensity: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1.4;
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: color-mix(
    in oklab,
    ${({ theme, $direction }) =>
        $direction === "up" ? theme.market.up : $direction === "down" ? theme.market.down : theme.market.flat}
      ${({ $intensity }) => Math.round($intensity * 100)}%,
    ${({ theme }) => theme.surface.sunken}
  );
  color: ${({ theme }) => theme.content.primary};
`;

const Sym = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xs};
  font-weight: 600;
`;

const Delta = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xs};
  font-variant-numeric: tabular-nums;
  opacity: 0.9;
`;

export interface MarketHeatmapProps {
  cells: readonly HeatmapCell[];
  /** Pre-formatted delta label per symbol — formatting is a LOGIC concern. */
  labels: Readonly<Record<string, string>>;
}

/** Sector/constituent heatmap. Tile tint encodes direction and magnitude. */
export function MarketHeatmap({ cells, labels }: MarketHeatmapProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Market heatmap</CardTitle>
          <CardDescription>Tint encodes direction, saturation encodes magnitude</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {cells.length === 0 ? (
          <EmptyState title="No heatmap data" />
        ) : (
          <Grid>
            {cells.map((cell) => (
              <Tile
                key={cell.symbol}
                $direction={cell.changePercent > 0 ? "up" : cell.changePercent < 0 ? "down" : "flat"}
                $intensity={Math.min(Math.abs(cell.changePercent) / 5, 1) * 0.55 + 0.1}
                title={cell.label}
              >
                <Sym>{cell.symbol}</Sym>
                <Delta>{labels[cell.symbol] ?? ""}</Delta>
              </Tile>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
