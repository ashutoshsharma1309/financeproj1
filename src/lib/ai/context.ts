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
}

export function buildFinancialContext(
  data: FinanceData,
  currency: string,
): FinancialContext {
  const runway = runwayMonths(data);
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
  };
}
