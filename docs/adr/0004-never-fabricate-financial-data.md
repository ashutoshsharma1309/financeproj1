# 0004 — Never fabricate financial data

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

AI CFO presents itself as a financial advisor for small businesses. A finance
tool that shows invented numbers — sample charts, placeholder KPIs, mocked
"insights" — is worse than useless: it erodes the exact trust it needs, and a
user could mistake demo data for their own.

## Decision

Every business number rendered anywhere in the product must derive from real,
user-entered data. When no data exists, show a deliberate empty state that
explains what to add — never a fabricated preview. This applies to KPIs, charts,
forecasts, the AI assistant, notifications, and the marketing hero.

## Consequences

- Empty states are a first-class design surface, not an afterthought (see
  `src/components/ui/empty-state.tsx` and the honest hero preview).
- Calculations must handle the zero-data case gracefully (`hasAnyData`, guarded
  divisions like `profitMargin`).
- The AI is grounded strictly on the user's data — see
  [0010](0010-ai-grounding-local-fallback.md).
- This is the project's non-negotiable core principle; any feature that would
  require inventing numbers is rejected or redesigned.
