"use client";

import styled from "styled-components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SentimentReading } from "@/types";

const Gauge = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const Track = styled.div`
  position: relative;
  height: 0.5rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.market.down},
    ${({ theme }) => theme.market.flat} 50%,
    ${({ theme }) => theme.market.up}
  );
  opacity: 0.85;
`;

const Needle = styled.span<{ $pct: number }>`
  position: absolute;
  top: 50%;
  left: ${({ $pct }) => $pct}%;
  width: 0.125rem;
  height: 1.25rem;
  transform: translate(-50%, -50%);
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.content.primary};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const Scale = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.muted};
`;

const Readout = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
`;

const Label = styled.span<{ $label: SentimentReading["label"] }>`
  font-size: ${({ theme }) => theme.text.lg};
  font-weight: 600;
  text-transform: capitalize;
  color: ${({ theme, $label }) =>
    $label === "bullish" ? theme.market.up : $label === "bearish" ? theme.market.down : theme.content.secondary};
`;

const Sample = styled.span`
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.muted};
`;

export interface SentimentGaugeProps {
  reading: SentimentReading;
  /** Pre-formatted strings — formatting is a LOGIC concern. */
  display: { score: string; sampleSize: string };
}

/** Aggregated market sentiment, -1 to 1. */
export function SentimentGauge({ reading, display }: SentimentGaugeProps) {
  const pct = ((Math.max(-1, Math.min(1, reading.score)) + 1) / 2) * 100;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Sentiment</CardTitle>
          <CardDescription>{reading.symbol ?? "Whole market"}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Gauge>
          <Readout>
            <Label $label={reading.label}>{reading.label}</Label>
            <Sample>{display.score}</Sample>
          </Readout>
          <Track
            role="meter"
            aria-valuemin={-1}
            aria-valuemax={1}
            aria-valuenow={reading.score}
            aria-label="Sentiment score"
          >
            <Needle $pct={pct} aria-hidden />
          </Track>
          <Scale>
            <span>Bearish</span>
            <span>{display.sampleSize}</span>
            <span>Bullish</span>
          </Scale>
        </Gauge>
      </CardContent>
    </Card>
  );
}
