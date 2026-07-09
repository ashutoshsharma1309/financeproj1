# 0014 — Vitest for pure-logic unit tests

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

The calculation engine and other pure helpers hold the logic most likely to be
subtly wrong, and they were deliberately written to be side-effect-free
([0005](0005-pure-calculation-engine.md)). They need a fast, low-ceremony way to
be exercised in isolation, ideally the same way in local dev and CI.

## Decision

Use Vitest (node environment) with an `@ → src` path alias. Tests live beside the
code they cover as `*.test.ts`. The suite runs pure functions directly — no
React, no store, no DOM. `npm test` runs once; `npm run test:watch` for dev; CI
runs the same command.

## Consequences

- The riskiest logic — invoice math, streams, monthly series, runway, forecasts,
  P&L, breakdowns, invoice status, security matrix, notification derivation — is
  covered by fast unit tests.
- Functions that read the clock (monthly windows, runway) are tested with dates
  built relative to the current month, keeping tests deterministic.
- Component/interaction tests (Testing Library + jsdom) are a separate, later
  step; this ADR covers the pure-logic layer.
