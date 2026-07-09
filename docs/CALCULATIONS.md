# Calculation engine

All derived metrics come from pure functions in `src/lib/calculations.ts`. They
take your data and return numbers — nothing is hardcoded, and empty input yields
zeroed results.

## Key functions

| Function | Returns |
| --- | --- |
| `totalRevenue` / `totalExpenses` | Sum of income / expense across records |
| `netProfit` / `profitMargin` | Revenue − expenses; margin as a % |
| `monthlySeries` | Trailing income/expense per month |
| `monthOverMonth` | Deltas vs. the previous month |
| `categoryBreakdown` | Amount and share per category |
| `cashPosition` | Net of account balances |
| `monthlyBurn` / `runwayMonths` | Recent net flow; months of runway |
| `cashFlowSeries` | Inflow, outflow and balance per month |
| `invoiceSubtotal` / `invoiceTax` / `invoiceTotal` | Invoice math |
| `invoiceStats` | Paid / outstanding / overdue buckets |
| `effectiveInvoiceStatus` | Auto-OVERDUE for past-due sent invoices |
| `projectForecast` | Revenue/expense/cash projection over a horizon |
| `buildProfitLoss` | P&L totals and category breakdowns for a range |
| `hasAnyData` | Whether any records exist (drives empty states) |

## Truth-model notes

A few rules worth stating explicitly, because surfaces used to disagree on them:

- `invoiceStats` buckets by the **effective** status, so a past-due `SENT`
  invoice counts as overdue in the KPIs exactly as it shows in the table.
  Outstanding still includes overdue — the money is owed either way.
  ([ADR 0006](./adr/0006-effective-invoice-status.md))
- `runwayMonths` returns `Infinity` when the business isn't burning cash
  (non-negative average net), so a profitable company has no runway limit.
- Guarded divisions never blow up on zero data: `profitMargin` returns `0` when
  revenue is `0`, and `hasAnyData` gates empty states.

## Testing

These functions are covered by unit tests — see [Testing](./TESTING.md). Because
they're pure, they're fast and deterministic to test. Clock-dependent functions
(`monthlySeries`, `runwayMonths`, `projectForecast`) are exercised with dates
built relative to the current month.
