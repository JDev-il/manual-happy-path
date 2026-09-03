"use client";

import styled from "styled-components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { DigestEntry } from "@/types";

const Scroller = styled(ScrollArea)`
  max-height: 20rem;
`;

const List = styled.ol`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0 0 0 ${({ theme }) => theme.space[4]};
  list-style: none;
  border-left: 1px solid ${({ theme }) => theme.border.subtle};
`;

const Item = styled.li`
  position: relative;
  padding-bottom: ${({ theme }) => theme.space[4]};

  &::before {
    content: "";
    position: absolute;
    left: calc(-1 * ${({ theme }) => theme.space[4]} - 3px);
    top: 0.35rem;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: ${({ theme }) => theme.radius.pill};
    background: ${({ theme }) => theme.accent.base};
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

const Title = styled.h4`
  margin: 0 0 ${({ theme }) => theme.space[1]};
  font-size: ${({ theme }) => theme.text.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.content.primary};
`;

const Summary = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.text.xs};
  line-height: 1.55;
  color: ${({ theme }) => theme.content.secondary};
`;

const Symbols = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[1]};
`;

export interface DigestFeedProps {
  entries: readonly DigestEntry[];
  /** Pre-formatted relative timestamps keyed by entry id. */
  timestamps: Readonly<Record<string, string>>;
}

/**
 * AI-written market digest, newest first.
 * TODO(UI): wire the digest query once LOGIC exposes it.
 */
export function DigestFeed({ entries, timestamps }: DigestFeedProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>AI digest</CardTitle>
          <CardDescription>What moved, and why</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <EmptyState title="Digest is empty" hint="Entries are written as the session develops." />
        ) : (
          <Scroller>
            <List>
              {entries.map((entry) => (
                <Item key={entry.id}>
                  <Title>{entry.title}</Title>
                  <Summary>{entry.summary}</Summary>
                  <Symbols>
                    {entry.symbols.map((symbol) => (
                      <Badge key={symbol} tone="neutral" outlined>
                        {symbol}
                      </Badge>
                    ))}
                    <Badge tone="neutral">{timestamps[entry.id] ?? ""}</Badge>
                  </Symbols>
                </Item>
              ))}
            </List>
          </Scroller>
        )}
      </CardContent>
    </Card>
  );
}
