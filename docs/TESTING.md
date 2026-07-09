# Testing

Unit tests run on [Vitest](https://vitest.dev).

## Commands

```bash
npm test          # run once
npm run test:watch # watch mode
```

## What's covered

The calculation engine is the core of the app, so it has the most coverage —
11 test files, 69 tests at last count:

- `calculations.test.ts` — invoice math, revenue/expense/profit, cash position,
  invoice stats, empty-data guard
- `streams.test.ts` — income/expense stream composition, `profitMargin`
  divide-by-zero guard, `totalAssets` / `totalLiabilities` roll-ups
- `monthly-series.test.ts` — `monthlySeries` windowing/bucketing and
  `monthOverMonth` deltas
- `runway.test.ts` — `monthlyBurn`, `runwayMonths` (incl. Infinity when
  profitable), and `cashFlowSeries` balances
- `utils.test.ts` — currency and percent formatting, `pctChange`, `sumBy`,
  `clamp`, `monthKey`
- `security.test.ts` — the RBAC permission matrix per role
- `breakdown.test.ts` — category aggregation and shares
- `profit-loss.test.ts` — P&L totals and date-range filtering
- `invoice-status.test.ts` — overdue detection
- `forecast.test.ts` — projection horizon and shape
- `notifications.test.ts` — `deriveAlerts` and `pickNewAlerts` de-duplication

## Conventions

- Tests live next to the code as `*.test.ts` and run in a Node environment.
- The `@/` alias resolves to `src/` (see `vitest.config.ts`).
- CI runs `npm test` on every push and pull request.
- Functions that read the clock (monthly windows, runway) are tested with dates
  built relative to the current month so results stay deterministic.

## Adding tests

Prefer testing pure functions in `src/lib`. Build small fixtures inline and
assert exact numeric outputs.
