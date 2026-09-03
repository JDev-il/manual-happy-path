"use client";

import styled from "styled-components";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NewsItem } from "@/types";

const Scroller = styled(ScrollArea)`
  max-height: 20rem;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  padding: ${({ theme }) => theme.space[3]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.border.subtle};

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const Headline = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  font-size: ${({ theme }) => theme.text.sm};
  font-weight: 500;
  line-height: 1.45;
  color: ${({ theme }) => theme.content.primary};
  text-decoration: none;

  svg {
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
    color: ${({ theme }) => theme.content.muted};
  }

  &:hover {
    color: ${({ theme }) => theme.accent.base};
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.muted};
`;

export interface NewsFeedPanelProps {
  items: readonly NewsItem[];
  /** Pre-formatted relative timestamps keyed by item id. */
  timestamps: Readonly<Record<string, string>>;
}

/**
 * Symbol-tagged news stream with AI sentiment labels.
 * TODO(UI): wire the news query once LOGIC exposes it.
 */
export function NewsFeedPanel({ items, timestamps }: NewsFeedPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Newsflow</CardTitle>
          <CardDescription>Tagged and scored by the AI layer</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState title="No stories yet" />
        ) : (
          <Scroller>
            <List>
              {items.map((item) => (
                <Item key={item.id}>
                  <Headline href={item.url} target="_blank" rel="noreferrer">
                    {item.headline}
                    <ExternalLink aria-hidden />
                  </Headline>
                  <Meta>
                    <span>{item.source}</span>
                    <span>·</span>
                    <span>{timestamps[item.id] ?? ""}</span>
                    {item.sentiment ? (
                      <Badge
                        tone={
                          item.sentiment.label === "bullish"
                            ? "up"
                            : item.sentiment.label === "bearish"
                              ? "down"
                              : "flat"
                        }
                      >
                        {item.sentiment.label}
                      </Badge>
                    ) : null}
                    {item.symbols.map((symbol) => (
                      <Badge key={symbol} tone="neutral" outlined>
                        {symbol}
                      </Badge>
                    ))}
                  </Meta>
                </Item>
              ))}
            </List>
          </Scroller>
        )}
      </CardContent>
    </Card>
  );
}
