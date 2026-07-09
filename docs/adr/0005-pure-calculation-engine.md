# 0005 — Pure functional calculation engine

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

Financial metrics (totals, margins, monthly series, runway, forecasts, P&L) are
the heart of the product and the thing most likely to be *wrong* in a subtle,
trust-destroying way. They're consumed by many surfaces: dashboard KPIs, charts,
the AI context, notifications, and reports.

## Decision

Concentrate all derivation in `src/lib/calculations.ts` as pure, side-effect-free
functions that take a `FinanceData` snapshot and return derived values. No
function reads the store, mutates state, or performs I/O. UI and AI layers call
these functions; they never re-derive metrics inline.

## Consequences

- The riskiest logic is unit-testable in isolation without React or a store —
  see [0014](0014-vitest-unit-testing.md).
- A single definition of each metric means the dashboard, AI, and reports can't
  disagree. (The one place they *did* disagree — invoice overdue — was fixed by
  centralizing the rule; see [0006](0006-effective-invoice-status.md).)
- Functions that depend on "now" (monthly windows, runway) read the real clock,
  so their tests build dates relative to the current month.
