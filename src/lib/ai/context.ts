// Builds a compact, factual financial context from ONLY user-entered data.
// This object is the single source the AI layer is allowed to reason over.

import {
  cashPosition,
  categoryBreakdown,
  expenseStream,
  incomeStream,
  invoiceStats,
  monthlyBurn,
  monthlySeries,
  netProfit,
  profitMargin,
  runwayMonths,
  totalExpenses,
  totalRevenue,
  type FinanceData,
} from "@/lib/calculations";

export interface FinancialContext {
  currency: string;
  hasData: boolean;
  totals: {
    revenue: number;
    expenses: number;
    netProfit: number;
    profitMargin: number;
    cashPosition: number;
    monthlyBurn: number;
    runwayMonths: number | null;
  };
  monthly: { month: string; income: number; expense: number; net: number }[];
  topExpenseCategories: { name: string; value: number; share: number }[];
  topIncomeCategories: { name: string; value: number; share: number }[];
  invoices: ReturnType<typeof invoiceStats>;
  counts: {
    transactions: number;
    revenues: number;
    expenses: number;
    invoices: number;
    accounts: number;
  };
  /** Compact rolling window for daily/weekly digests — six numbers, not rows. */
  recent: {
    todayRevenue: number;
    todayExpenses: number;
    last7dRevenue: number;
    last7dExpenses: number;
    prev7dRevenue: number;
    prev7dExpenses: number;
  };
}

/** Sum a dated stream between two instants (inclusive start, exclusive end). */
function sumBetween(
  items: { amount: number; date: string }[],
  start: number,
  end: number,
) {
  return items.reduce((acc, x) => {
    const t = new Date(x.date).getTime();
    return t >= start && t < end ? acc + x.amount : acc;
  }, 0);
}

export function buildFinancialContext(
  data: FinanceData,
  currency: string,
): FinancialContext {
  const runway = runwayMonths(data);
  const income = incomeStream(data);
  const expense = expenseStream(data);
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const DAY = 86_400_000;
  const weekStart = dayStart - 6 * DAY;
  const prevWeekStart = weekStart - 7 * DAY;
  return {
    currency,
    hasData:
      data.transactions.length +
        data.revenues.length +
        data.expenses.length +
        data.invoices.length +
        data.accounts.length >
      0,
    totals: {
      revenue: totalRevenue(data),
      expenses: totalExpenses(data),
      netProfit: netProfit(data),
      profitMargin: profitMargin(data),
      cashPosition: cashPosition(data.accounts),
      monthlyBurn: monthlyBurn(data),
      runwayMonths: Number.isFinite(runway) ? runway : null,
    },
    monthly: monthlySeries(data, 12).map((m) => ({
      month: m.label,
      income: Math.round(m.income),
      expense: Math.round(m.expense),
      net: Math.round(m.net),
    })),
    topExpenseCategories: categoryBreakdown(expenseStream(data), data.categories)
      .slice(0, 5)
      .map((c) => ({ name: c.name, value: Math.round(c.value), share: c.share })),
    topIncomeCategories: categoryBreakdown(incomeStream(data), data.categories)
      .slice(0, 5)
      .map((c) => ({ name: c.name, value: Math.round(c.value), share: c.share })),
    invoices: invoiceStats(data.invoices),
    counts: {
      transactions: data.transactions.length,
      revenues: data.revenues.length,
      expenses: data.expenses.length,
      invoices: data.invoices.length,
      accounts: data.accounts.length,
    },
    recent: {
      todayRevenue: sumBetween(income, dayStart, dayStart + DAY),
      todayExpenses: sumBetween(expense, dayStart, dayStart + DAY),
      last7dRevenue: sumBetween(income, weekStart, dayStart + DAY),
      last7dExpenses: sumBetween(expense, weekStart, dayStart + DAY),
      prev7dRevenue: sumBetween(income, prevWeekStart, weekStart),
      prev7dExpenses: sumBetween(expense, prevWeekStart, weekStart),
    },
  };
}
