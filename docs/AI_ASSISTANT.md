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
   - runs a **provider chain**: OpenAI (`src/lib/ai/openai.ts`, used when
     `OPENAI_API_KEY` is set) → Gemini (`src/lib/ai/gemini.ts`, used when
     `GEMINI_API_KEY` is set) → the deterministic analyzer
     (`src/lib/ai/insights.ts`). Each is given a system prompt that forbids
     inventing data,
   - if a configured provider errors (e.g. quota exhausted), it falls through to
     the next, so the assistant always returns a grounded answer.

## Grounding rules

- The system prompt instructs the model to use only the provided context and to
  say it doesn't have enough data rather than guess.
- The offline analyzer is fully deterministic and never speculates.

## Enabling generative answers

Set `OPENAI_API_KEY` (optionally `OPENAI_MODEL`, default `gpt-4o-mini`) **or**
`GEMINI_API_KEY` in your environment (`.env`, git-ignored). OpenAI is preferred
when both are present. With no key, the assistant still returns useful,
data-grounded responses. Note the provider account must have available quota —
a `429 insufficient_quota` from OpenAI falls through to Gemini or the local
analyzer.

## See also

- Decision & trade-offs: [ADR 0010](./adr/0010-ai-grounding-local-fallback.md)
- The no-fabrication principle it upholds:
  [ADR 0004](./adr/0004-never-fabricate-financial-data.md)
