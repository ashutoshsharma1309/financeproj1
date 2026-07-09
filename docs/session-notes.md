# Session Notes

Rolling log of decisions, discoveries and rationale for future autonomous
sessions. Newest first.

## 2026-07-09 — M4: Dependency & code hygiene

**Removed.** `date-fns` (unused: 0 imports in `src/`) and the dead
`pushNotification` store action (superseded by `ingestAlerts` in M1, no callers
left). **Kept on purpose.** `@prisma/client` has 0 `src/` imports but is the
schema-only scaffolding for M5 (blocked) and backs the `postinstall:
prisma generate` script — removing it would break that and the future backend.
Every other dependency was confirmed in use. **Result.** 51 tests + build green;
bundle unchanged (date-fns never shipped since nothing imported it), dep tree
leaner.

## 2026-07-09 — M1: Notifications derived & persisted from data

**Problem.** The Notifications page re-computed "Live" alerts inline on each
render but never persisted them, so `pushNotification` was dead code and the
topbar bell (which counts unread persisted notifications) was always 0 — the
alert never followed the user off the Notifications page.

**Approach.** Split the logic into a pure module `src/lib/notifications.ts`:
`deriveAlerts(data, settings)` returns alerts (overdue invoices, runway < 6mo)
each tagged with a stable **condition** key (`invoices-overdue`, `runway-low`),
and `pickNewAlerts(existing, derived)` filters out keys already persisted. A new
store action `ingestAlerts` persists only fresh keys; a headless
`<NotificationSync />` mounted in `DashboardShell` derives + ingests app-wide via
a `useMemo`/`useEffect`, so the bell is correct on every page. The Notifications
page was simplified to render the persisted feed (dropping the duplicated inline
derivation and the now-redundant "Live" block).

**Design choice.** Key by condition, not by value — so a change in overdue count
doesn't spawn a second notification for the same situation; `clearNotifications`
resets the keys and lets a fresh cycle re-notify. This is exactly what makes
"no duplicates on re-visit" hold.

**Verified (browser, prod build).** Seeded a past-due SENT invoice → one
persisted alert (key `invoices-overdue`), bell = 1, stayed 1 across repeated
navigation between /dashboard and /notifications (no dupes); the feed rendered
with Mark read / Mark all read. 9 unit tests (51 total) + build green. No
fabricated data — every alert derives from real user entries.

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
