# 0008 — Code-split charts with next/dynamic

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

Recharts (~108 kB) shipped in the first-load JS of the four chart-heavy routes
(dashboard, cash-flow, forecasts, reports), inflating time-to-interactive even
though the charts render below the fold and only when the user has data.

## Decision

Wrap each chart in `src/components/charts/lazy.tsx` using
`next/dynamic(() => import("./index").then(m => m.X), { ssr: false, loading:
skeleton })`, and have the pages import from there. Height-matched skeletons hold
layout so there's no shift when the chart hydrates.

## Consequences

- First-load JS dropped ~40–50% on the four routes (dashboard 222→113 kB,
  cash-flow 269→161 kB, forecasts 268→159 kB, reports 216→108 kB).
- Charts are client-only (`ssr: false`), which is fine — they depend on the
  client store and have nothing meaningful to server-render.
- **Gotcha:** `next/dynamic` options must be an inline object literal; SWC
  analyzes them statically, so a factored-out `withFallback(h)` helper fails the
  build with `invalid-dynamic-options-type`. The options are spelled out per
  chart on purpose.
