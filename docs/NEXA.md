# Nexa — AI Business Strategist

Nexa is the product's own intelligent advisor. It behaves like a senior
consultant (ex-CFO): direct, quantified, professional. It reasons **only** over
the company's real data and never fabricates records or figures.

## Architecture (modular AI service layer)

All logic lives under `src/lib/ai/` and is fully decoupled from the UI — the same
functions back both the deterministic answers and the LLM prompt.

| Layer | File | Responsibility |
| --- | --- | --- |
| **Persona / Prompt manager** | `nexa/persona.ts` | `NEXA_SYSTEM_PROMPT` (voice, format, strict data rules) + suggested prompts |
| **Context builder** | `context.ts` | Compact `FinancialContext` — totals, monthly series, top categories, invoices, and a rolling `recent` window. Never sends raw records |
| **Health engine** | `nexa/health.ts` | `computeBusinessHealth` — 5 weighted pillars (profitability, liquidity, receivables, growth, resilience), renormalized when data is missing |
| **Digest engine** | `nexa/digest.ts` | `businessDigest` — daily / weekly / monthly / yearly summaries with warnings & highlights |
| **Recommendation engine** | `nexa/advisor.ts` | `buildRecommendations` — prioritized, data-cited actions with expected impact & confidence |
| **Chat controller** | `nexa/answer.ts` | `nexaAnswer` — intent router → structured health/digest/advice, else the grounded analyzer |
| **Insight analyzer** | `insights.ts` | Deterministic fallback for open questions |
| **Providers** | `openai.ts`, `gemini.ts` | LLM adapters behind a common interface |
| **API** | `app/api/ai/chat/route.ts` | Rate-limited route: **OpenAI → Gemini → deterministic Nexa**, always answers |

## Grounding & token strategy

- The LLM only ever receives the **compact context** (a few dozen numbers), never
  the database or raw rows — cheap and privacy-preserving, and ready for RAG later.
- The strict system prompt forbids inventing figures; the deterministic path
  cannot invent by construction. Both share the same section format so the two
  feel like one advisor.
- When no key is set (or a provider 429s), Nexa still returns structured,
  data-grounded answers via `nexaAnswer`.

## Output format

Nexa answers in consultant sections — **Business Summary · Insights · Root Cause
· Recommended Actions · Expected Impact · Priority · Confidence · Warnings · Next
Steps** — never "As an AI…", never generic filler.

## Surfaces

- **Dashboard** — a live Business Health card (`components/dashboard/nexa-health-card.tsx`).
- **Nexa workspace** (`/assistant`) — full chat.
- **Floating widget** — app-wide; routes product how-tos to the help KB and
  business questions to Nexa.

## Honest scope

Nexa advises over the data the app actually holds: **revenue, expenses,
invoices, cash, margins, growth, runway, concentration risk**. Features that
need modules this app doesn't yet have — **inventory, products, customers,
suppliers, employees** — are intentionally *not* answered with invented data;
they're on the roadmap (see `docs/roadmap.md`). This is the no-fabrication
principle applied to AI.

## Tests

`src/lib/ai/nexa/nexa.test.ts` covers the health score bounds/ordering, digest
math, recommendation prioritization, and the intent router (13 tests).
