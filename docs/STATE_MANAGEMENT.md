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

Or wrap the selector with `useShallow`.

## Hydration

The app shell waits for the persisted store to rehydrate before rendering
(`src/hooks/use-hydrated.ts`) to avoid hydration mismatches.
