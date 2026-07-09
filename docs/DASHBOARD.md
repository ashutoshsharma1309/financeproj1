# Dashboard

The dashboard (`/dashboard`) is your financial position at a glance. Every value
is derived from your entries — before you add data it shows a clear empty state.

## What it shows

- **KPI cards** — total revenue, total expenses, net profit and outstanding
  invoices, each with a month-over-month delta.
- **Income vs. expenses** — a trailing 12-month area chart.
- **Expense breakdown** — top categories as a donut.
- **Recent activity** — your latest income and expense entries.
- **Invoice health** — paid, outstanding and overdue at a glance.
- **AI CFO card** — a shortcut to ask a question about these numbers.

## How the numbers are computed

Totals come from `totalRevenue`, `totalExpenses` and `netProfit`; deltas from
`monthOverMonth`; the chart from `monthlySeries`; the donut from
`categoryBreakdown`. All live in `src/lib/calculations.ts` as pure functions.

## Empty state

With no data, the dashboard invites you to add revenue or an expense rather than
showing placeholder figures.
