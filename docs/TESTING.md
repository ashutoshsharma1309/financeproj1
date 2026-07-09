# Testing

Unit tests run on [Vitest](https://vitest.dev).

## Commands

```bash
npm test          # run once
npm run test:watch # watch mode
```

## What's covered

The calculation engine is the core of the app, so it has the most coverage:

- `calculations.test.ts` — invoice math, revenue/expense/profit, cash position,
  invoice stats, empty-data guard
- `utils.test.ts` — currency and percent formatting, `pctChange`, `sumBy`,
  `clamp`, `monthKey`
- `security.test.ts` — the RBAC permission matrix per role
- `breakdown.test.ts` — category aggregation and shares
- `profit-loss.test.ts` — P&L totals and date-range filtering
- `invoice-status.test.ts` — overdue detection
- `forecast.test.ts` — projection horizon and shape

## Conventions

- Tests live next to the code as `*.test.ts` and run in a Node environment.
- The `@/` alias resolves to `src/` (see `vitest.config.ts`).
- CI runs `npm test` on every push and pull request.

## Adding tests

Prefer testing pure functions in `src/lib`. Build small fixtures inline and
assert exact numeric outputs.
