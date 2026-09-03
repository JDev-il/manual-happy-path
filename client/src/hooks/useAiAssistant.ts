"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { aiService } from "@/services/ai.service";
import type { AssistantReply } from "@/types";

export interface UseAiAssistantResult {
  /** Ignores empty prompts rather than round-tripping a guaranteed 422. */
  ask: (prompt: string) => void;
  reply: AssistantReply | null;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
}

/** Backs the assistant dock. Not cached — each prompt is a discrete action. */
export function useAiAssistant(): UseAiAssistantResult {
  const mutation = useMutation({
    mutationFn: (prompt: string) => aiService.ask(prompt),
  });

  const { mutate } = mutation;

  const ask = useCallback(
    (prompt: string) => {
      const trimmed = prompt.trim();
      if (trimmed.length === 0) return;
      mutate(trimmed);
    },
    [mutate],
  );

  return {
    ask,
    reply: mutation.data ?? null,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}
