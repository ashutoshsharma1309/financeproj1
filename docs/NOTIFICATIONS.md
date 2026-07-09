# Notifications

Alerts in AI CFO are **derived from real data and persisted**, so the topbar bell
is accurate on every page — not just the Notifications page. Nothing here is
fabricated: an alert exists only because the user's own numbers triggered it.

## What raises an alert

Alerts are computed by the pure helper `deriveAlerts(data, settings)` in
[`src/lib/notifications.ts`](../src/lib/notifications.ts):

| Alert              | Condition                                              | Type      |
| ------------------ | ----------------------------------------------------- | --------- |
| `invoices-overdue` | One or more invoices are effectively overdue          | `DANGER`  |
| `runway-low`       | Runway is finite and below `RUNWAY_THRESHOLD_MONTHS` (6), and `settings.lowCashAlert` is on | `WARNING` |

"Effectively overdue" uses the date-aware `effectiveInvoiceStatus` — see
[ADR 0006](adr/0006-effective-invoice-status.md). Runway comes from
`runwayMonths` (cash ÷ average monthly burn); a profitable business has infinite
runway and raises no alert.

## How persistence works (no duplicates)

Each alert carries a stable **condition key** (`invoices-overdue`, `runway-low`)
describing the situation, not its current value. The flow:

1. `<NotificationSync />` (mounted once in `DashboardShell`) recomputes
   `deriveAlerts` whenever the underlying data or settings change.
2. It calls the store action `ingestAlerts`, which uses
   `pickNewAlerts(existing, derived)` to keep only alerts whose key isn't already
   persisted.
3. New alerts are written to the persisted `notifications` list; the topbar bell
   counts unread entries.

Because dedup is by condition, a changing overdue count doesn't spawn a second
notification for the same situation, and re-visiting a page never duplicates an
alert. Clearing notifications resets the keys, so a genuinely new cycle can
re-notify.

## Managing notifications

On the Notifications page users can **Mark read**, **Mark all read**, or
**Clear**. The persisted list is capped at 100 entries (newest first).

## Related

- Pure helpers and dedup: [`src/lib/notifications.ts`](../src/lib/notifications.ts)
- Tests: [`src/lib/notifications.test.ts`](../src/lib/notifications.test.ts)
- Design decision: [ADR 0007](adr/0007-condition-keyed-notifications.md)
