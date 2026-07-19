// Nexa — periodic business digests (daily / weekly / monthly / yearly).
// Everything derives from the compact FinancialContext: the rolling `recent`
// window for day/week, the trailing monthly series for month/year. No raw
// records are ever needed server-side.

import type { FinancialContext } from "../context";

export type DigestPeriod = "day" | "week" | "month" | "year";

export interface BusinessDigest {
  period: DigestPeriod;
  label: string;
  revenue: number;
  expenses: number;
  net: number;
  /** % change vs the previous comparable period, when computable. */
  deltaRevenue: number | null;
  warnings: string[];
  highlights: string[];
}

function pct(cur: number, prev: number): number | null {
  if (prev === 0) return cur === 0 ? null : 100;
  return ((cur - prev) / prev) * 100;
}

const EMPTY_RECENT = {
  todayRevenue: 0,
  todayExpenses: 0,
  last7dRevenue: 0,
  last7dExpenses: 0,
  prev7dRevenue: 0,
  prev7dExpenses: 0,
};

export function businessDigest(
  ctx: FinancialContext,
  period: DigestPeriod,
): BusinessDigest {
  // `recent` may be absent if an older client posted the context — default it.
  const recent = ctx.recent ?? EMPTY_RECENT;
  const { monthly, invoices, totals } = ctx;
  let revenue = 0;
  let expenses = 0;
  let deltaRevenue: number | null = null;
  let label = "";

  if (period === "day") {
    label = "Today";
    revenue = recent.todayRevenue;
    expenses = recent.todayExpenses;
  } else if (period === "week") {
    label = "Last 7 days";
    revenue = recent.last7dRevenue;
    expenses = recent.last7dExpenses;
    deltaRevenue = pct(recent.last7dRevenue, recent.prev7dRevenue);
  } else if (period === "month") {
    const cur = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2];
    label = cur ? cur.month : "This month";
    revenue = cur?.income ?? 0;
    expenses = cur?.expense ?? 0;
    deltaRevenue = prev ? pct(revenue, prev.income) : null;
  } else {
    label = "Trailing 12 months";
    revenue = monthly.reduce((a, m) => a + m.income, 0);
    expenses = monthly.reduce((a, m) => a + m.expense, 0);
  }

  const net = revenue - expenses;
  const warnings: string[] = [];
  const highlights: string[] = [];

  if (net < 0) warnings.push(`Spending exceeded income by ${Math.abs(net).toFixed(0)} this ${period === "day" ? "day" : "period"}.`);
  if (invoices.overdueCount > 0)
    warnings.push(`${invoices.overdueCount} invoice(s) overdue — ${invoices.overdueAmount.toFixed(0)} in collectible cash.`);
  if (totals.runwayMonths !== null && totals.runwayMonths < 6)
    warnings.push(`Runway is ${totals.runwayMonths.toFixed(1)} months at the current burn.`);

  if (deltaRevenue !== null && deltaRevenue > 0)
    highlights.push(`Revenue up ${deltaRevenue.toFixed(1)}% vs the previous period.`);
  if (ctx.topIncomeCategories[0])
    highlights.push(`Top income line: ${ctx.topIncomeCategories[0].name} (${ctx.topIncomeCategories[0].share.toFixed(0)}% of income).`);
  if (ctx.topExpenseCategories[0])
    highlights.push(`Largest cost centre: ${ctx.topExpenseCategories[0].name} (${ctx.topExpenseCategories[0].share.toFixed(0)}% of spend).`);

  return { period, label, revenue, expenses, net, deltaRevenue, warnings, highlights };
}
