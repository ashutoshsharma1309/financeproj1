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

### M1 — Notifications: derive & persist from data — DONE
- Added a pure helper `src/lib/notifications.ts` (`deriveAlerts` + `pickNewAlerts`)
  that computes alerts (overdue invoices, runway < 6mo) from real data with a
  stable per-condition `key`. A store action `ingestAlerts` persists only alerts
  whose key isn't already present; `<NotificationSync />` (mounted in the shell)
  runs it app-wide so the bell count is accurate on every page. The Notifications
  page now renders the persisted feed instead of re-deriving inline.
- **Verified (browser):** derived overdue alert persisted with key
  `invoices-overdue`, bell showed 1, stayed 1 across multiple re-visits (no
  dupes); feed rendered with Mark read / Mark all read. 9 new unit tests cover
  `deriveAlerts` (empty/overdue/plural/runway/settings-off) and `pickNewAlerts`
  (dedup, missing keys). `npm test` (51) + `npm run build` green.

### M2 — Performance: lazy-load charts — DONE
- Recharts (~108 kB) was in the first-load JS of the four chart routes. Added
  `src/components/charts/lazy.tsx` (`next/dynamic`, `ssr:false`, height-matched
  skeletons) and repointed the pages; removed the dead `CHART_ACCENTS`/`ACCENT`.
- **Result (first-load JS):** dashboard 222→113 kB (−49%), cash-flow 269→161 kB
  (−40%), forecasts 268→159 kB (−41%), reports 216→108 kB (−50%).
- Verified: build green; charts render end-to-end with real data (no stuck
  skeleton); no hydration warnings.

### M3 — Test depth — TODO
- Add component/interaction tests (Vitest + Testing Library + jsdom) for a
  critical flow (e.g. add-revenue) and more calc edge cases
  (`cashFlowSeries`, `monthOverMonth`, `monthlySeries`).
- DoD: new tests pass in CI; no flakiness.

### M4 — Dependency & code hygiene — DONE
- Removed the unused `date-fns` dependency (0 imports in `src/`) and the now-dead
  `pushNotification` store action (replaced by `ingestAlerts` in M1; 0 callers).
- Audited every other dependency for real usage: all in use except
  `@prisma/client`, which is intentional schema-only scaffolding for M5 (wired to
  the `postinstall: prisma generate` script) and kept on purpose.
- DoD met: `npm test` (51) + `npm run build` green; bundle unchanged (date-fns
  was never imported, so it never shipped — the win is a leaner dep tree).

### M5 — Real backend + auth — BLOCKED (needs DATABASE_URL/secrets + product decision)
- Wire Prisma, API routes, JWT/session, argon2/bcrypt hashing, server-side RBAC.
- Requires credentials and a product/legal decision → escalate to human.

### M6 — Premium UI polish pass (per module) — TODO
- Raise one module at a time to a handcrafted, premium bar without adding fake
  data. Research modern SaaS patterns first.

## Change log of decisions
- 2026-07-09: M1 keys alerts by *condition* (`invoices-overdue`, `runway-low`),
  not by value, so a persisted alert isn't duplicated when the count changes;
  clearing notifications resets the keys and lets a fresh cycle re-notify.
- 2026-07-09: Chose M0 as first milestone (correctness > polish; low risk, high
  trust value). See `docs/session-notes.md`.
