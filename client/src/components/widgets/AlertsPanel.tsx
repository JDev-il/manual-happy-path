"use client";

import styled from "styled-components";
import { AlertTriangle, BellRing, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AlertSeverity, PriceAlert } from "@/types";

const ICONS: Record<AlertSeverity, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  critical: BellRing,
};

const Scroller = styled(ScrollArea)`
  max-height: 18rem;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li<{ $severity: AlertSeverity; $acknowledged: boolean }>`
  display: grid;
  grid-template-columns: 1rem minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-left: 2px solid
    ${({ theme, $severity }) =>
      $severity === "critical"
        ? theme.status.danger
        : $severity === "warning"
          ? theme.status.warning
          : theme.status.info};
  border-radius: ${({ theme }) => theme.radius.xs};
  background: ${({ theme }) => theme.surface.sunken};
  opacity: ${({ $acknowledged }) => ($acknowledged ? 0.55 : 1)};

  svg {
    width: 0.875rem;
    height: 0.875rem;
    color: ${({ theme, $severity }) =>
      $severity === "critical"
        ? theme.status.danger
        : $severity === "warning"
          ? theme.status.warning
          : theme.status.info};
  }
`;

const Message = styled.div`
  min-width: 0;
`;

const Symbol = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xs};
  font-weight: 600;
  color: ${({ theme }) => theme.content.primary};
`;

const Text = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.secondary};
`;

export interface AlertsPanelProps {
  alerts: readonly PriceAlert[];
  /** Pre-formatted relative timestamps keyed by alert id. */
  timestamps: Readonly<Record<string, string>>;
  onAcknowledge?: (id: string) => void;
}

/**
 * Triggered price and signal alerts.
 * TODO(UI): wire the alerts subscription and acknowledge mutation once LOGIC lands.
 */
export function AlertsPanel({ alerts, timestamps, onAcknowledge }: AlertsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <EmptyState title="Nothing triggered" hint="Alerts appear here the moment a threshold is crossed." />
        ) : (
          <Scroller>
            <List>
              {alerts.map((alert) => {
                const Icon = ICONS[alert.severity];
                return (
                  <Item key={alert.id} $severity={alert.severity} $acknowledged={alert.acknowledged}>
                    <Icon aria-hidden />
                    <Message>
                      <Symbol>{alert.ticker.symbol}</Symbol>
                      <Text>{alert.message}</Text>
                    </Message>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={alert.acknowledged}
                      onClick={() => onAcknowledge?.(alert.id)}
                    >
                      {alert.acknowledged ? "Seen" : (timestamps[alert.id] ?? "Ack")}
                    </Button>
                  </Item>
                );
              })}
            </List>
          </Scroller>
        )}
      </CardContent>
    </Card>
  );
}
