"use client";

import styled from "styled-components";
import { StatTile, type StatTileProps } from "@/components/widgets/StatTile";

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: ${({ theme }) => theme.space[3]};
`;

/** Responsive KPI strip. */
export function StatTileRow({ tiles }: { tiles: readonly StatTileProps[] }) {
  return (
    <Row>
      {tiles.map((tile) => (
        <StatTile key={tile.label} {...tile} />
      ))}
    </Row>
  );
}
