/** AI signal endpoints. Response shapes come from CONTRACTS.md. */

import { apiRequest } from "@/services/http";
import type {
  AiInsight,
  AiPrediction,
  AiSuggestion,
  AssistantReply,
  DigestEntry,
  SentimentReading,
} from "@/types";

export const aiService = {
  getInsights: (limit?: number, signal?: AbortSignal): Promise<AiInsight[]> =>
    apiRequest<AiInsight[]>("/ai/insights", { query: { limit }, signal }),

  getPredictions: (signal?: AbortSignal): Promise<AiPrediction[]> =>
    apiRequest<AiPrediction[]>("/ai/predictions", { signal }),

  getSentiment: (symbol: string | null, signal?: AbortSignal): Promise<SentimentReading> =>
    apiRequest<SentimentReading>("/ai/sentiment", { query: { symbol }, signal }),

  getSuggestions: (signal?: AbortSignal): Promise<AiSuggestion[]> =>
    apiRequest<AiSuggestion[]>("/ai/suggestions", { signal }),

  getDigest: (signal?: AbortSignal): Promise<DigestEntry[]> =>
    apiRequest<DigestEntry[]>("/ai/digest", { signal }),

  ask: (prompt: string): Promise<AssistantReply> =>
    apiRequest<AssistantReply>("/ai/assistant", { method: "POST", body: { prompt } }),
};
