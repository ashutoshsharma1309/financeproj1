# AI assistant

The AI CFO assistant answers financial questions **only** from the user's own
data. It never fabricates figures.

## How it works

1. The client builds a factual `FinancialContext` from the store
   (`src/lib/ai/context.ts`) — totals, monthly series, category breakdowns,
   invoice stats and runway.
2. That context and the question are posted to `POST /api/ai/chat`.
3. The route (`src/app/api/ai/chat/route.ts`):
   - validates the payload,
   - applies rate limiting,
   - if `GEMINI_API_KEY` is set, calls Gemini with a system prompt that forbids
     inventing data (`src/lib/ai/gemini.ts`),
   - otherwise falls back to a deterministic analyzer (`src/lib/ai/insights.ts`)
     that computes the answer directly from the context.

## Grounding rules

- The system prompt instructs the model to use only the provided context and to
  say it doesn't have enough data rather than guess.
- The offline analyzer is fully deterministic and never speculates.

## Enabling generative answers

Set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) in your environment. With no
key, the assistant still returns useful, data-grounded responses.

## See also

- Decision & trade-offs: [ADR 0010](./adr/0010-ai-grounding-local-fallback.md)
- The no-fabrication principle it upholds:
  [ADR 0004](./adr/0004-never-fabricate-financial-data.md)
