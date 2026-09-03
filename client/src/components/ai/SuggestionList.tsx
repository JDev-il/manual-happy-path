"use client";

import styled from "styled-components";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfidenceMeter } from "@/components/ai/ConfidenceMeter";
import type { AiSuggestion, SuggestionAction } from "@/types";

const ACTION_TONE: Record<SuggestionAction, NonNullable<BadgeProps["tone"]>> = {
  buy: "up",
  sell: "down",
  hold: "flat",
  watch: "info",
};

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 0;
`;

const Symbol = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.content.primary};
`;

const Reason = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  font-size: ${({ theme }) => theme.text.xs};
  line-height: 1.5;
  color: ${({ theme }) => theme.content.muted};
`;

const Meter = styled.div`
  grid-column: 1 / -1;
`;

export interface SuggestionEntry {
  suggestion: AiSuggestion;
  /** Pre-formatted confidence label. */
  display: { confidence: string };
}

/**
 * Actionable AI suggestions.
 * TODO(UI): `onReview` currently bubbles a bare id — connect it to the
 * suggestion detail flow once ROUTING and LOGIC are in place.
 */
export function SuggestionList({
  entries,
  onReview,
}: {
  entries: readonly SuggestionEntry[];
  onReview?: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Suggestions</CardTitle>
          <CardDescription>Ranked by model conviction</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <EmptyState title="No suggestions" hint="The model surfaces ideas as signals firm up." />
        ) : (
          <List>
            {entries.map(({ suggestion, display }) => (
              <Item key={suggestion.id}>
                <Head>
                  <Symbol>{suggestion.ticker.symbol}</Symbol>
                  <Badge tone={ACTION_TONE[suggestion.action]}>{suggestion.action}</Badge>
                </Head>
                <Button variant="ghost" size="sm" onClick={() => onReview?.(suggestion.id)}>
                  Review
                </Button>
                <Meter>
                  <ConfidenceMeter
                    confidence={suggestion.confidence}
                    strength={suggestion.strength}
                    label={display.confidence}
                  />
                </Meter>
                <Reason>{suggestion.reason}</Reason>
              </Item>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
