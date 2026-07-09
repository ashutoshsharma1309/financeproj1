# 0013 — Zustand v5 selector discipline

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

Zustand v5 bails out of a re-render only when a selector's result is
referentially equal to the previous one. A selector that builds a *new*
array or object each call — e.g. `useFinanceStore(s => s.categories.filter(...))`
— returns a fresh reference every render, so the component re-renders forever.
This shipped once and surfaced as a client-side "Application error" crash on the
revenue and expenses pages.

## Decision

Never return a freshly-constructed array/object from a selector. Either select
the raw slice and derive with `React.useMemo` in the component, or wrap the
selector in `useShallow` (as `useFinanceData` does). Treat this as a review
checklist item.

## Consequences

- The infinite-render crash is understood and must not be reintroduced; it's
  recorded in project memory as a standing gotcha.
- `useFinanceData` uses `useShallow`; pages that need a filtered view select the
  raw slice and `useMemo` it.
- Slightly more verbose selectors, in exchange for correctness.
