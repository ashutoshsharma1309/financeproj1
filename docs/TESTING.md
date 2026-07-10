# Testing

Unit tests run on [Vitest](https://vitest.dev).

## Commands

```bash
npm test          # run once
npm run test:watch # watch mode
```

## What's covered

The calculation engine is the core of the app, so it has the most coverage —
34 test files, 166 tests at last count.

**Pure logic (`src/lib`, node env)**

- `calculations.test.ts` — invoice math, revenue/expense/profit, cash position,
  invoice stats, empty-data guard
- `streams.test.ts` — income/expense stream composition, `profitMargin`
  divide-by-zero guard, `totalAssets` / `totalLiabilities` roll-ups
- `monthly-series.test.ts` — `monthlySeries` windowing/bucketing and
  `monthOverMonth` deltas
- `runway.test.ts` — `monthlyBurn`, `runwayMonths` (incl. Infinity when
  profitable), and `cashFlowSeries` balances
- `utils.test.ts` / `utils-extra.test.ts` — formatting, `pctChange`, `sumBy`,
  `clamp`, `monthKey`, `cn`, `formatCompact`, `formatDate`, `uid`, `sanitize`
- `security.test.ts` — the RBAC permission matrix per role
- `breakdown.test.ts` — category aggregation and shares
- `profit-loss.test.ts` — P&L totals and date-range filtering
- `invoice-status.test.ts` — overdue detection
- `forecast.test.ts` — projection horizon and shape
- `notifications.test.ts` — `deriveAlerts` and `pickNewAlerts` de-duplication
- `*-validators.test.ts` + `field-errors.test.ts` — every Zod form schema and
  the `fieldErrors` flattener
- `ai/context.test.ts`, `ai/insights.test.ts`, `ai/prompts.test.ts` — the
  factual context builder, the offline analyzer's branches, and the strict
  system prompt
- `store-*.test.ts` — finance-store CRUD/audit, notification dedup, onboarding
- `auth-*.test.ts` — signup roles, login/logout, profile updates

**Components (`src/components`, jsdom env, `*.test.tsx`)**

- UI primitives — `EmptyState`, `Button`, `Badge`, `Card`, `PageHeader`,
  `StatCard`, `Input`/`Field`/`Select`, `SkipLink`, `Skeleton`, `Dropdown` —
  rendering, prop forwarding, and interaction (click, type, open/close).

## Conventions

- Tests live next to the code as `*.test.ts` / `*.test.tsx`.
- Pure logic runs in a node environment; `*.test.tsx` opts into jsdom via a glob
  in `vitest.config.ts`, with Testing Library + a shared `src/test/setup.ts`.
- The `@/` alias resolves to `src/`.
- CI runs `npm test` on every push and pull request.
- Functions that read the clock (monthly windows, runway) are tested with dates
  built relative to the current month so results stay deterministic.

## Adding tests

Prefer testing pure functions in `src/lib` — build small fixtures inline and
assert exact outputs. For components, render with Testing Library and assert on
accessible roles/text and user interactions rather than implementation details.
