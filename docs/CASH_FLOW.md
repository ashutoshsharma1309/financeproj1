# Cash flow

Track money in and out, your balance over time, and your runway from the Cash
Flow module (`/cash-flow`).

## Accounts

Add accounts by type: **Cash**, **Bank**, **Credit**, **Asset** or
**Liability**. Cash, bank and asset balances add to your position; credit and
liability balances subtract from it (`cashPosition`).

## Metrics

- **Cash position** — net of all account balances
- **Monthly net** — recent average of inflow minus outflow (`monthlyBurn`)
- **Runway** — months of cash left at the current burn (`runwayMonths`); shows
  ∞ when you're cash-flow positive
- **Net worth** — assets minus liabilities

## Charts

- **Cash balance trend** — projected from your net monthly flow
- **Inflow vs. outflow** — monthly, trailing 12 months

All series are computed by `cashFlowSeries` from your revenue and expense data.
