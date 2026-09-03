"use client";

import styled from "styled-components";
import { Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfidenceMeter } from "@/components/ai/ConfidenceMeter";
import { PriceChangeBadge } from "@/components/market/PriceChangeBadge";
import type { AiPrediction } from "@/types";

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surface.sunken};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
`;

const Symbol = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.content.primary};
`;

const Target = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.lg};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.content.primary};
`;

const Rationale = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.text.xs};
  line-height: 1.5;
  color: ${({ theme }) => theme.content.muted};
`;

export interface PredictionEntry {
  prediction: AiPrediction;
  /** Pre-formatted strings — formatting is a LOGIC concern. */
  display: { target: string; expectedChange: string; confidence: string };
}

/**
 * Forward-looking price projections.
 * TODO(UI): wire the predictions query once LOGIC exposes it.
 */
export function PredictionPanel({ entries }: { entries: readonly PredictionEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>AI predictions</CardTitle>
          <CardDescription>Model-projected targets by horizon</CardDescription>
        </div>
        <Badge tone="accent">
          <Bot aria-hidden style={{ width: "0.75rem", height: "0.75rem" }} />
          Live
        </Badge>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <EmptyState title="No predictions yet" hint="The model publishes projections each session." />
        ) : (
          <List>
            {entries.map(({ prediction, display }) => (
              <Item key={prediction.id}>
                <Row>
                  <Symbol>{prediction.symbol}</Symbol>
                  <Badge tone="neutral" outlined>
                    {prediction.horizon}
                  </Badge>
                </Row>
                <Row>
                  <Target>{display.target}</Target>
                  <PriceChangeBadge direction={prediction.direction} value={display.expectedChange} />
                </Row>
                <ConfidenceMeter
                  confidence={prediction.confidence}
                  strength={prediction.strength}
                  label={display.confidence}
                />
                <Rationale>{prediction.rationale}</Rationale>
              </Item>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
