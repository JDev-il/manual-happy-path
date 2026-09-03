"use client";

import styled from "styled-components";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceMeter } from "@/components/ai/ConfidenceMeter";
import type { AiInsight } from "@/types";

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 0;
`;

const Icon = styled.span`
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.accent.soft};
  color: ${({ theme }) => theme.accent.base};

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const Body = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.text.sm};
  line-height: 1.55;
  color: ${({ theme }) => theme.content.secondary};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

export interface AiInsightCardProps {
  insight: AiInsight;
  /** Pre-formatted strings — formatting is a LOGIC concern. */
  display: { confidence: string; timestamp: string };
}

/** A single AI-generated observation. */
export function AiInsightCard({ insight, display }: AiInsightCardProps) {
  return (
    <Card>
      <CardHeader>
        <Head>
          <Icon aria-hidden>
            <Sparkles />
          </Icon>
          <CardTitle>{insight.headline}</CardTitle>
        </Head>
        <Badge tone="accent">{insight.source}</Badge>
      </CardHeader>
      <CardContent>
        <Body>{insight.body}</Body>
        <Meta>
          <ConfidenceMeter
            confidence={insight.confidence}
            strength={insight.strength}
            label={display.confidence}
          />
          <Badge tone="neutral">{display.timestamp}</Badge>
        </Meta>
      </CardContent>
    </Card>
  );
}
