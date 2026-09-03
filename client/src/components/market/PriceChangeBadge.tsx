"use client";

import styled from "styled-components";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { TrendDirection } from "@/types";

const ICONS = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
} as const;

const Wrap = styled.span<{ $direction: TrendDirection; $bare: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: ${({ $bare, theme }) => ($bare ? "0" : `2px ${theme.space[2]}`)};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme, $direction, $bare }) =>
    $bare
      ? "transparent"
      : $direction === "up"
        ? theme.market.upSoft
        : $direction === "down"
          ? theme.market.downSoft
          : theme.market.flatSoft};
  color: ${({ theme, $direction }) =>
    $direction === "up" ? theme.market.up : $direction === "down" ? theme.market.down : theme.market.flat};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xs};
  font-variant-numeric: tabular-nums;
  line-height: 1.4;

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

export interface PriceChangeBadgeProps {
  direction: TrendDirection;
  /** Pre-formatted display string. Formatting is a LOGIC concern. */
  value: string;
  bare?: boolean;
}

/** Directional price delta. Never computes or formats the number itself. */
export function PriceChangeBadge({ direction, value, bare = false }: PriceChangeBadgeProps) {
  const Icon = ICONS[direction];
  return (
    <Wrap $direction={direction} $bare={bare}>
      <Icon aria-hidden />
      {value}
    </Wrap>
  );
}
