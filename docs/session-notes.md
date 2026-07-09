# Session Notes

Rolling log of decisions, discoveries and rationale for future autonomous
sessions. Newest first.

## 2026-07-09 — M2: Lazy-load charts (performance)

**Problem.** Recharts (~108 kB) shipped in the first-load JS of all four chart
routes. **Approach.** `next/dynamic(() => import('./index').then(m => m.X), {
ssr:false, loading: skeleton })` in `src/components/charts/lazy.tsx`; pages import
from there. **Gotcha (captured for reuse):** `next/dynamic` options must be an
**inline object literal** — SWC analyzes it statically, so a factored-out
`withFallback(h)` helper fails the build (`invalid-dynamic-options-type`). Spell
the `{ ssr, loading }` out per chart. **Result:** −40–50% first-load JS on
dashboard/cash-flow/forecasts/reports. Also removed dead `CHART_ACCENTS`/`ACCENT`.
**Verified** with a real add-data flow (charts render, no skeleton lock).

## 2026-07-09 — M0: Invoice overdue consistency

**Discovery.** `invoiceStats` (`src/lib/calculations.ts`) buckets invoices by the
**stored** `status` field, while the invoices table and dashboard badges use
`effectiveInvoiceStatus`, which promotes a `SENT` invoice past its `dueDate` to
`OVERDUE`. Result: an invoice shown as **OVERDUE** in the table was counted as
**outstanding-but-not-overdue** by the KPI cards. The Overdue KPI understated
reality and disagreed with the on-screen badge.

**Decision.** Make `invoiceStats` compute the **effective** status per invoice so
overdue detection is date-aware everywhere. Outstanding continues to include
overdue (the money is still owed). This aligns the truth model with what's
already displayed; it does not redefine any financial rule, so it does not
require human sign-off.

**Why now.** Highest value ÷ risk: it's a finance correctness/trust fix, pure and
fully unit-testable, touching one function. Correctness before polish.

**Verification.** Added a unit test for a past-due `SENT` invoice (counts as
overdue *and* outstanding). Existing invoice tests remain valid (they used a
future `dueDate`, so no behavior change there). Ran `npm test` and
`npm run build`.

**Follow-ups.** See `docs/roadmap.md` M1–M6. Next best: M1 (persist notifications
from real data) or M2 (lazy-load charts for first-load JS).
