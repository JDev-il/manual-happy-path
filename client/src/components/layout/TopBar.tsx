"use client";

import styled from "styled-components";
import { Command, Moon, RefreshCw, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketSessionPill } from "@/components/market/MarketSessionPill";

const Bar = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  height: 100%;
  padding: 0 ${({ theme }) => theme.space[4]};
`;

const SearchShell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex: 1 1 auto;
  max-width: 28rem;
  height: 2rem;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surface.sunken};
  color: ${({ theme }) => theme.content.muted};
  font-size: ${({ theme }) => theme.text.sm};
  cursor: text;

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const Kbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  padding: 0 ${({ theme }) => theme.space[1]};
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xs};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.muted};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-left: auto;
`;

/**
 * Global header: symbol search entry point, session state, and account slot.
 * TODO(UI): wire the command palette and theme toggle once LOGIC exposes them.
 */
export function TopBar() {
  return (
    <Bar>
      <SearchShell role="search">
        <Search aria-hidden />
        Search symbols, sectors, or ask the AI…
        <Kbd>
          <Command aria-hidden style={{ width: "0.625rem", height: "0.625rem" }} />K
        </Kbd>
      </SearchShell>

      <Right>
        <MarketSessionPill session="open" />
        <Badge tone="neutral" outlined>
          Delayed 15m
        </Badge>
        <Button variant="ghost" size="icon" aria-label="Refresh market data">
          <RefreshCw aria-hidden />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Toggle colour theme">
          <Moon aria-hidden />
        </Button>
        <Avatar initials="JD" />
      </Right>
    </Bar>
  );
}
