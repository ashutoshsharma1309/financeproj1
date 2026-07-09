# AI CFO — Roadmap & Task Board

> Living milestone map for autonomous, resumable development. Keep this file
> honest: only mark a milestone **Done** when its definition of done is met and
> verified. Prefer small, reversible, PR-sized units.

**Guiding constraint:** every business number must be derived from real
user-entered data. No fabricated data, ever. Empty states are correct when data
is absent.

## Status legend

`TODO` · `IN PROGRESS` · `DONE` · `BLOCKED (reason)`

## Milestones (prioritized by value ÷ risk)

### M0 — Invoice overdue consistency (finance correctness) — DONE
- **Problem:** `invoiceStats` buckets by stored status; the table uses
  `effectiveInvoiceStatus` (date-aware). Overdue KPI disagrees with the table.
- **Fix:** compute effective status inside `invoiceStats` so overdue is
  date-aware everywhere; outstanding still includes overdue (money owed).
- **Definition of done:** KPI overdue/outstanding match table badges; unit tests
  cover a past-due `SENT` invoice; `npm test` + `npm run build` green.

### M1 — Notifications: derive & persist from data — TODO
- Use the store's existing `pushNotification` to persist alerts (overdue
  invoices, runway < threshold) with de-duplication, instead of only computing
  them on the Notifications page. Keep everything derived from real data.
- DoD: bell count reflects persisted alerts; no duplicates on re-visit; tests for
  the dedupe/generation helper (pure function).

### M2 — Performance: lazy-load charts — TODO
- Recharts inflates first-load JS on dashboard/cash-flow/forecasts/reports
  (~210–270 kB). Dynamically import chart wrappers (`next/dynamic`, `ssr:false`)
  with skeleton fallbacks.
- DoD: measurable first-load JS drop on those routes; charts still render; no
  hydration warnings.

### M3 — Test depth — TODO
- Add component/interaction tests (Vitest + Testing Library + jsdom) for a
  critical flow (e.g. add-revenue) and more calc edge cases
  (`cashFlowSeries`, `monthOverMonth`, `monthlySeries`).
- DoD: new tests pass in CI; no flakiness.

### M4 — Dependency & code hygiene — TODO
- Remove unused `date-fns`; audit for other dead code.
- DoD: `npm run build` green; bundle unaffected or smaller.

### M5 — Real backend + auth — BLOCKED (needs DATABASE_URL/secrets + product decision)
- Wire Prisma, API routes, JWT/session, argon2/bcrypt hashing, server-side RBAC.
- Requires credentials and a product/legal decision → escalate to human.

### M6 — Premium UI polish pass (per module) — TODO
- Raise one module at a time to a handcrafted, premium bar without adding fake
  data. Research modern SaaS patterns first.

## Change log of decisions
- 2026-07-09: Chose M0 as first milestone (correctness > polish; low risk, high
  trust value). See `docs/session-notes.md`.
