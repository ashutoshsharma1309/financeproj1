# 0007 — Condition-keyed derived notifications

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

Alerts (overdue invoices, low runway) were recomputed inline on the Notifications
page but never persisted, so the topbar bell — which counts unread persisted
notifications — was always zero, and an alert never followed the user off that
page. Persisting naively would create a duplicate on every visit or every render.

## Decision

Split the logic into a pure helper (`src/lib/notifications.ts`):
`deriveAlerts(data, settings)` computes the alerts that currently hold, each
tagged with a stable **condition** key (`invoices-overdue`, `runway-low`);
`pickNewAlerts(existing, derived)` drops any key already persisted. The store's
`ingestAlerts` action persists only fresh keys, and a headless
`<NotificationSync />` mounted in the shell runs it app-wide.

## Consequences

- The bell count is accurate on every page and never duplicates on re-visit.
- Keying by *condition* rather than *value* means a changing count doesn't spawn
  a second notification for the same situation; `clearNotifications` resets the
  keys so a genuinely new cycle can re-notify.
- Alerts remain fully derived from real data — nothing fabricated.
- The pure helpers are unit-tested (`notifications.test.ts`).
- Superseded the general-purpose `pushNotification` action, which was removed as
  dead code once `ingestAlerts` covered the real use case.
