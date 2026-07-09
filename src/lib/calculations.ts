// ─────────────────────────────────────────────────────────────
// Calculation engine — pure functions.
// Everything here is derived from user-entered data. Nothing is
// hardcoded or fabricated; empty inputs produce zeroed results.
// ─────────────────────────────────────────────────────────────

import { monthKey, monthLabel, pctChange, sumBy } from "./utils";
import type {
  Account,
  Category,
  Expense,
  Forecast,
  Invoice,
  Revenue,
  Transaction,
} from "./types";

export interface FinanceData {
  transactions: Transaction[];
  revenues: Revenue[];
  expenses: Expense[];
  invoices: Invoice[];
  accounts: Account[];
  categories: Category[];
}

export interface DatedAmount {
  amount: number;
  date: string;
  categoryId?: string;
  label: string;
}

// ── Invoice math ─────────────────────────────────────────────

export function invoiceSubtotal(invoice: Invoice) {
  return sumBy(invoice.items, (i) => i.quantity * i.unitPrice);
}

export function invoiceTax(invoice: Invoice) {
  return invoiceSubtotal(invoice) * (invoice.taxRate / 100);
}

export function invoiceTotal(invoice: Invoice) {
  return invoiceSubtotal(invoice) + invoiceTax(invoice);
}

// ── Unified streams ──────────────────────────────────────────
// Income = revenue entries + income transactions + paid invoices.
// Expenses = expense entries + expense transactions.

export function incomeStream(data: FinanceData): DatedAmount[] {
  const fromRevenue = data.revenues.map((r) => ({
    amount: r.amount,
    date: r.date,
    categoryId: r.categoryId,
    label: r.source,
  }));
  const fromTxns = data.transactions
    .filter((t) => t.type === "INCOME")
    .map((t) => ({
      amount: t.amount,
      date: t.date,
      categoryId: t.categoryId,
      label: t.description,
    }));
  const fromInvoices = data.invoices
    .filter((i) => i.status === "PAID")
    .map((i) => ({
      amount: invoiceTotal(i),
      date: i.issueDate,
      categoryId: undefined,
      label: `Invoice ${i.number}`,
    }));
  return [...fromRevenue, ...fromTxns, ...fromInvoices];
}

export function expenseStream(data: FinanceData): DatedAmount[] {
  const fromExpenses = data.expenses.map((e) => ({
    amount: e.amount,
    date: e.date,
    categoryId: e.categoryId,
    label: e.vendor,
  }));
  const fromTxns = data.transactions
    .filter((t) => t.type === "EXPENSE")
    .map((t) => ({
      amount: t.amount,
      date: t.date,
      categoryId: t.categoryId,
      label: t.description,
    }));
  return [...fromExpenses, ...fromTxns];
}

// ── Totals ───────────────────────────────────────────────────

export function totalRevenue(data: FinanceData) {
  return sumBy(incomeStream(data), (x) => x.amount);
}

export function totalExpenses(data: FinanceData) {
  return sumBy(expenseStream(data), (x) => x.amount);
}

export function netProfit(data: FinanceData) {
  return totalRevenue(data) - totalExpenses(data);
}

export function profitMargin(data: FinanceData) {
  const rev = totalRevenue(data);
  if (rev === 0) return 0;
  return (netProfit(data) / rev) * 100;
}

/** Liquid cash across CASH + BANK accounts, offset by liabilities/credit. */
export function cashPosition(accounts: Account[]) {
  const liquid = sumBy(
    accounts.filter((a) => a.kind === "CASH" || a.kind === "BANK"),
    (a) => a.balance,
  );
  const obligations = sumBy(
    accounts.filter((a) => a.kind === "CREDIT" || a.kind === "LIABILITY"),
    (a) => a.balance,
  );
  return liquid - obligations;
}

export function totalAssets(accounts: Account[]) {
  return sumBy(
    accounts.filter(
      (a) => a.kind === "CASH" || a.kind === "BANK" || a.kind === "ASSET",
    ),
    (a) => a.balance,
  );
}

export function totalLiabilities(accounts: Account[]) {
  return sumBy(
    accounts.filter((a) => a.kind === "CREDIT" || a.kind === "LIABILITY"),
    (a) => a.balance,
  );
}

// ── Monthly time series ──────────────────────────────────────

export interface MonthPoint {
  key: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export function monthlySeries(data: FinanceData, months = 12): MonthPoint[] {
  const income = incomeStream(data);
  const expense = expenseStream(data);
  const map = new Map<string, { income: number; expense: number }>();

  const now = new Date();
  // Seed the trailing window so the chart always spans a full range.
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    map.set(monthKey(d), { income: 0, expense: 0 });
  }

  for (const item of income) {
    const k = monthKey(item.date);
    const cur = map.get(k);
    if (cur) cur.income += item.amount;
  }
  for (const item of expense) {
    const k = monthKey(item.date);
    const cur = map.get(k);
    if (cur) cur.expense += item.amount;
  }

  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([key, v]) => ({
      key,
      label: monthLabel(key),
      income: v.income,
      expense: v.expense,
      net: v.income - v.expense,
    }));
}

/** Current vs previous month comparison for headline stats. */
export function monthOverMonth(data: FinanceData) {
  const series = monthlySeries(data, 2);
  const prev = series[0] ?? { income: 0, expense: 0, net: 0 };
  const cur = series[1] ?? { income: 0, expense: 0, net: 0 };
  return {
    revenueDelta: pctChange(cur.income, prev.income),
    expenseDelta: pctChange(cur.expense, prev.expense),
    netDelta: pctChange(cur.net, prev.net),
    current: cur,
    previous: prev,
  };
}

// ── Category breakdowns ──────────────────────────────────────

export interface BreakdownSlice {
  categoryId: string;
  name: string;
  color: string;
  value: number;
  share: number;
}

export function categoryBreakdown(
  stream: DatedAmount[],
  categories: Category[],
): BreakdownSlice[] {
  const map = new Map<string, number>();
  for (const item of stream) {
    const key = item.categoryId ?? "__uncat";
    map.set(key, (map.get(key) ?? 0) + item.amount);
  }
  const total = sumBy(stream, (x) => x.amount) || 1;
  return Array.from(map.entries())
    .map(([id, value]) => {
      const cat = categories.find((c) => c.id === id);
      return {
        categoryId: id,
        name: cat?.name ?? "Uncategorized",
        color: cat?.color ?? "#94a3b8",
        value,
        share: (value / total) * 100,
      };
    })
    .sort((a, b) => b.value - a.value);
}

// ── Invoice analytics ────────────────────────────────────────

export function invoiceStats(invoices: Invoice[]) {
  // Bucket by the *effective* status so a past-due SENT invoice is treated as
  // OVERDUE here exactly as it is in the invoices table and status badges.
  const withTotals = invoices.map((i) => ({
    status: effectiveInvoiceStatus(i),
    total: invoiceTotal(i),
  }));
  const paid = withTotals.filter((x) => x.status === "PAID");
  const outstanding = withTotals.filter(
    (x) => x.status === "SENT" || x.status === "OVERDUE",
  );
  const overdue = withTotals.filter((x) => x.status === "OVERDUE");
  const draft = withTotals.filter((x) => x.status === "DRAFT");
  return {
    count: invoices.length,
    paidAmount: sumBy(paid, (x) => x.total),
    outstandingAmount: sumBy(outstanding, (x) => x.total),
    overdueAmount: sumBy(overdue, (x) => x.total),
    draftCount: draft.length,
    paidCount: paid.length,
    outstandingCount: outstanding.length,
    overdueCount: overdue.length,
  };
}

/** Recompute a status label based on due date (SENT past due → OVERDUE). */
export function effectiveInvoiceStatus(invoice: Invoice): Invoice["status"] {
  if (invoice.status === "SENT" && new Date(invoice.dueDate) < new Date()) {
    return "OVERDUE";
  }
  return invoice.status;
}

// ── Cash flow projection (runway) ────────────────────────────

export interface CashFlowPoint {
  key: string;
  label: string;
  inflow: number;
  outflow: number;
  net: number;
  balance: number;
}

export function cashFlowSeries(
  data: FinanceData,
  months = 12,
): CashFlowPoint[] {
  const series = monthlySeries(data, months);
  let running = cashPosition(data.accounts);
  // Back out prior months so the *latest* balance equals current cash position.
  const totalNet = series.reduce((acc, p) => acc + p.net, 0);
  running = cashPosition(data.accounts) - totalNet;
  return series.map((p) => {
    running += p.net;
    return {
      key: p.key,
      label: p.label,
      inflow: p.income,
      outflow: p.expense,
      net: p.net,
      balance: running,
    };
  });
}

/** Average monthly burn (net negative) over the trailing window. */
export function monthlyBurn(data: FinanceData, months = 3) {
  const series = monthlySeries(data, months).filter(
    (p) => p.income > 0 || p.expense > 0,
  );
  if (series.length === 0) return 0;
  const avgNet = series.reduce((a, p) => a + p.net, 0) / series.length;
  return avgNet;
}

/** Months of runway given current cash and average burn. */
export function runwayMonths(data: FinanceData) {
  const cash = cashPosition(data.accounts);
  const burn = monthlyBurn(data);
  if (burn >= 0) return Infinity; // profitable — no runway limit
  return cash / Math.abs(burn);
}

// ── Forecasting ──────────────────────────────────────────────

export interface ForecastPoint {
  month: number;
  label: string;
  revenue: number;
  expense: number;
  net: number;
  cash: number;
}

export function projectForecast(
  forecast: Forecast,
  data: FinanceData,
): ForecastPoint[] {
  // Baseline = average of trailing months with activity.
  const series = monthlySeries(data, 6).filter(
    (p) => p.income > 0 || p.expense > 0,
  );
  const baseRevenue =
    series.length > 0
      ? series.reduce((a, p) => a + p.income, 0) / series.length
      : 0;
  const baseExpense =
    series.length > 0
      ? series.reduce((a, p) => a + p.expense, 0) / series.length
      : 0;

  const points: ForecastPoint[] = [];
  let cash = forecast.startingCash;
  const now = new Date();

  for (let m = 1; m <= forecast.horizon; m++) {
    const revenue = baseRevenue * Math.pow(1 + forecast.revenueGrowth / 100, m);
    const expense = baseExpense * Math.pow(1 + forecast.expenseGrowth / 100, m);
    const net = revenue - expense;
    cash += net;
    const d = new Date(now.getFullYear(), now.getMonth() + m, 1);
    points.push({
      month: m,
      label: monthLabel(monthKey(d)),
      revenue,
      expense,
      net,
      cash,
    });
  }
  return points;
}

// ── Report builders ──────────────────────────────────────────

export interface ProfitLossReport {
  incomeByCategory: BreakdownSlice[];
  expenseByCategory: BreakdownSlice[];
  totalIncome: number;
  totalExpense: number;
  net: number;
  margin: number;
}

export function buildProfitLoss(
  data: FinanceData,
  from?: Date,
  to?: Date,
): ProfitLossReport {
  const inRange = (d: string) => {
    const t = new Date(d).getTime();
    if (from && t < from.getTime()) return false;
    if (to && t > to.getTime()) return false;
    return true;
  };
  const income = incomeStream(data).filter((x) => inRange(x.date));
  const expense = expenseStream(data).filter((x) => inRange(x.date));
  const totalIncome = sumBy(income, (x) => x.amount);
  const totalExpense = sumBy(expense, (x) => x.amount);
  return {
    incomeByCategory: categoryBreakdown(income, data.categories),
    expenseByCategory: categoryBreakdown(expense, data.categories),
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
    margin: totalIncome === 0 ? 0 : ((totalIncome - totalExpense) / totalIncome) * 100,
  };
}

export function hasAnyData(data: FinanceData) {
  return (
    data.transactions.length > 0 ||
    data.revenues.length > 0 ||
    data.expenses.length > 0 ||
    data.invoices.length > 0 ||
    data.accounts.length > 0
  );
}
