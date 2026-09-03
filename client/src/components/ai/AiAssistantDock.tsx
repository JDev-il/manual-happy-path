"use client";

import styled from "styled-components";
import { ArrowUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* Example prompts shown before the first turn. Presentational only. */
const STARTERS = [
  "Why is the market down today?",
  "Compare NVDA and AMD momentum",
  "Summarise my watchlist risk",
] as const;

const Dock = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    radial-gradient(120% 120% at 0% 0%, ${({ theme }) => theme.accent.soft}, transparent 60%),
    ${({ theme }) => theme.surface.raised};
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.text.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.content.primary};
`;

const Starters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

const Starter = styled.button`
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.surface.sunken};
  color: ${({ theme }) => theme.content.secondary};
  font-size: ${({ theme }) => theme.text.xs};
  cursor: pointer;
  transition: color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};

  &:hover {
    color: ${({ theme }) => theme.content.primary};
    border-color: ${({ theme }) => theme.border.strong};
  }
`;

const Composer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

/**
 * Conversational entry point into the AI layer.
 * TODO(UI): the composer is presentational — wire submission to the assistant
 * mutation once LOGIC exposes it, and validation once FORMS lands.
 */
export function AiAssistantDock({ onAsk }: { onAsk?: (prompt: string) => void }) {
  return (
    <Dock aria-label="AI assistant">
      <Head>
        <Sparkles aria-hidden style={{ width: "1rem", height: "1rem" }} />
        <Title>Ask the market</Title>
        <Badge tone="accent" outlined style={{ marginLeft: "auto" }}>
          Beta
        </Badge>
      </Head>

      <Starters>
        {STARTERS.map((starter) => (
          <Starter key={starter} type="button" onClick={() => onAsk?.(starter)}>
            {starter}
          </Starter>
        ))}
      </Starters>

      <Composer>
        <Input placeholder="Ask about any symbol, sector, or trend…" aria-label="Ask the AI assistant" />
        <Button variant="primary" size="icon" aria-label="Send question">
          <ArrowUp aria-hidden />
        </Button>
      </Composer>
    </Dock>
  );
}
