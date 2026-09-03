"use client";

import styled from "styled-components";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { WatchlistRow, type WatchlistRowProps } from "@/components/market/WatchlistRow";

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Scroller = styled(ScrollArea)`
  max-height: 22rem;
`;

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

export interface WatchlistPanelProps {
  rows: readonly WatchlistRowProps[];
  isLoading?: boolean;
  onAdd?: () => void;
  onTogglePin?: (id: string) => void;
}

/**
 * Watchlist container. Receives fully-prepared rows.
 * TODO(UI): wire the watchlist query and pin mutation once LOGIC exposes them.
 */
export function WatchlistPanel({ rows, isLoading = false, onAdd, onTogglePin }: WatchlistPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <Button variant="ghost" size="sm" onClick={onAdd}>
          <Plus aria-hidden />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loading>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} style={{ height: "2.5rem" }} />
            ))}
          </Loading>
        ) : rows.length === 0 ? (
          <EmptyState title="No symbols tracked" hint="Add a ticker to start following it." />
        ) : (
          <Scroller>
            <List>
              {rows.map((row) => (
                <WatchlistRow key={row.item.id} {...row} onTogglePin={onTogglePin} />
              ))}
            </List>
          </Scroller>
        )}
      </CardContent>
    </Card>
  );
}
