# State management

State is managed with [Zustand](https://github.com/pmndrs/zustand) and persisted
to `localStorage`.

## Stores

- **Finance store** (`src/lib/store.ts`, key `aicfo-data`) — company, categories,
  accounts, transactions, revenue, expenses, invoices, forecasts, notifications,
  audit logs, team and settings, plus all CRUD actions and audit logging.
- **Auth store** (`src/lib/auth.ts`, key `aicfo-auth`) — the current user and the
  local user registry.

## Reading state safely

> **Important:** a selector must return a stable reference. Returning a new array
> or object each call (e.g. `useFinanceStore(s => s.categories.filter(...))`)
> causes an infinite render loop under Zustand v5.

Do this instead:

```ts
const categories = useFinanceStore((s) => s.categories);
const income = React.useMemo(
  () => categories.filter((c) => c.kind === "INCOME"),
  [categories],
);
```

Or wrap the selector with `useShallow` (as `useFinanceData` does). This rule is
important enough to have its own record — see
[ADR 0013](./adr/0013-zustand-selector-discipline.md).

## Deriving persisted alerts

Notifications are derived from real data, not authored by hand. The store's
`ingestAlerts` action persists alerts computed by `deriveAlerts` (in
`src/lib/notifications.ts`), keeping only those whose condition `key` isn't
already stored. A headless `<NotificationSync />` mounted in `DashboardShell`
runs this app-wide, so the topbar bell stays accurate on every page. See
[Notifications](./NOTIFICATIONS.md) and
[ADR 0007](./adr/0007-condition-keyed-notifications.md).

## Hydration

The app shell waits for the persisted store to rehydrate before rendering
(`src/hooks/use-hydrated.ts`) to avoid hydration mismatches.
