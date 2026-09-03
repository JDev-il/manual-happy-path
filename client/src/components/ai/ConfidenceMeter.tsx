"use client";

import styled from "styled-components";
import type { SignalStrength } from "@/types";

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const Track = styled.div`
  position: relative;
  flex: 1 1 auto;
  height: 0.25rem;
  min-width: 3rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.surface.overlay};
  overflow: hidden;
`;

const Fill = styled.div<{ $pct: number; $strength: SignalStrength }>`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ $pct }) => $pct}%;
  border-radius: inherit;
  background: ${({ theme, $strength }) =>
    $strength === "strong" ? theme.accent.base : $strength === "moderate" ? theme.status.info : theme.market.flat};
`;

const Value = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xs};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.content.muted};
`;

export interface ConfidenceMeterProps {
  /** 0–1, as defined by the AI contract. */
  confidence: number;
  strength: SignalStrength;
  /** Pre-formatted label, e.g. "82%". */
  label: string;
}

/** Confidence band for an AI signal. */
export function ConfidenceMeter({ confidence, strength, label }: ConfidenceMeterProps) {
  const pct = Math.max(0, Math.min(1, confidence)) * 100;
  return (
    <Wrap>
      <Track
        role="meter"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={confidence}
        aria-label="Model confidence"
      >
        <Fill $pct={pct} $strength={strength} />
      </Track>
      <Value>{label}</Value>
    </Wrap>
  );
}
