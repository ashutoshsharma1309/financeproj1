// Nexa — recommendation engine.
// Deterministic, rule-based advice derived strictly from FinancialContext.
// Every recommendation cites the company's own figures; nothing is invented.

import type { FinancialContext } from "../context";

export interface Recommendation {
  id: string;
  title: string;
  insight: string;
  rootCause: string;
  actions: string[];
  expectedImpact: string;
  priority: "critical" | "high" | "medium" | "low";
  /** 0–1: how directly the data supports this recommendation. */
  confidence: number;
}

const PRIORITY_ORDER: Record<Recommendation["priority"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function buildRecommendations(ctx: FinancialContext): Recommendation[] {
  const recs: Recommendation[] = [];
  const { totals, invoices, monthly } = ctx;
  const fmt = (v: number) => Math.round(v).toLocaleString("en-IN");

  // Operating at a loss.
  if (totals.revenue > 0 && totals.netProfit < 0) {
    recs.push({
      id: "net-loss",
      title: "Return the business to profitability",
      insight: `The company is operating at a net loss of ${fmt(Math.abs(totals.netProfit))} on ${fmt(totals.revenue)} revenue (margin ${totals.profitMargin.toFixed(1)}%).`,
      rootCause: `Expenses of ${fmt(totals.expenses)} exceed income across the recorded period.`,
      actions: [
        `Target the largest cost centre first${ctx.topExpenseCategories[0] ? ` — ${ctx.topExpenseCategories[0].name} at ${ctx.topExpenseCategories[0].share.toFixed(0)}% of spend` : ""}.`,
        "Re-price or discontinue income lines that don't cover their share of costs.",
        `Collect the ${fmt(invoices.outstandingAmount)} in outstanding invoices to relieve cash pressure.`,
      ],
      expectedImpact: `Closing the gap requires roughly ${fmt(Math.abs(totals.netProfit))} in combined savings and added revenue.`,
      priority: "critical",
      confidence: 0.95,
    });
  }

  // Short runway.
  if (totals.runwayMonths !== null && totals.runwayMonths < 6) {
    recs.push({
      id: "runway",
      title: "Extend the cash runway",
      insight: `At the current average burn of ${fmt(Math.abs(totals.monthlyBurn))}/month, cash of ${fmt(totals.cashPosition)} lasts ~${totals.runwayMonths.toFixed(1)} months.`,
      rootCause: "Recent months are cash-negative on average.",
      actions: [
        "Defer non-essential spend until net turns positive.",
        `Accelerate collection of ${fmt(invoices.outstandingAmount)} in receivables.`,
        "Model a reduced-burn scenario in Forecasts before committing new fixed costs.",
      ],
      expectedImpact: "Each month of burn removed adds a month of runway.",
      priority: totals.runwayMonths < 3 ? "critical" : "high",
      confidence: 0.9,
    });
  }

  // Overdue receivables.
  if (invoices.overdueCount > 0) {
    recs.push({
      id: "overdue",
      title: "Chase overdue receivables",
      insight: `${invoices.overdueCount} invoice(s) worth ${fmt(invoices.overdueAmount)} are past due — ${invoices.outstandingAmount > 0 ? ((invoices.overdueAmount / invoices.outstandingAmount) * 100).toFixed(0) : 0}% of all outstanding value.`,
      rootCause: "Sent invoices have passed their due dates without payment.",
      actions: [
        "Send payment reminders for every overdue invoice this week.",
        "Introduce late-payment terms on future invoices.",
      ],
      expectedImpact: `Recovering this converts ${fmt(invoices.overdueAmount)} of paper into cash without new sales.`,
      priority: "high",
      confidence: 1,
    });
  }

  // Expense concentration.
  const topExp = ctx.topExpenseCategories[0];
  if (topExp && topExp.share > 50) {
    recs.push({
      id: "cost-concentration",
      title: `Reduce dependence on ${topExp.name}`,
      insight: `${topExp.name} accounts for ${topExp.share.toFixed(0)}% of all spend (${fmt(topExp.value)}).`,
      rootCause: "A single cost centre dominates the expense base.",
      actions: [
        `Benchmark ${topExp.name} against alternatives; a 10% reduction saves ${fmt(topExp.value * 0.1)}.`,
        "Split the category if it hides several distinct costs, then attack the largest.",
      ],
      expectedImpact: `Every 10% saved here improves net profit by ${fmt(topExp.value * 0.1)}.`,
      priority: "medium",
      confidence: 0.85,
    });
  }

  // Revenue concentration.
  const topInc = ctx.topIncomeCategories[0];
  if (topInc && topInc.share > 60) {
    recs.push({
      id: "revenue-concentration",
      title: "Diversify revenue sources",
      insight: `${topInc.name} generates ${topInc.share.toFixed(0)}% of income — a concentration risk.`,
      rootCause: "Income depends heavily on a single line.",
      actions: [
        "Grow the second-largest income line before the largest falters.",
        "Set a target ceiling (e.g. 50%) for any single source.",
      ],
      expectedImpact: "Reduces the revenue shock if the dominant line slows.",
      priority: "medium",
      confidence: 0.8,
    });
  }

  // Revenue declining month-over-month.
  if (monthly.length >= 2) {
    const prev = monthly[monthly.length - 2].income;
    const cur = monthly[monthly.length - 1].income;
    if (prev > 0 && cur < prev * 0.9) {
      recs.push({
        id: "revenue-drop",
        title: "Investigate the revenue decline",
        insight: `Revenue fell ${(((prev - cur) / prev) * 100).toFixed(1)}% month-over-month (${fmt(prev)} → ${fmt(cur)}).`,
        rootCause: "The latest month underperformed the prior month materially.",
        actions: [
          "Compare income sources between the two months to find what dropped.",
          "Check whether unpaid invoices, seasonality or lost clients explain the gap.",
        ],
        expectedImpact: `Recovering to the prior level restores ${fmt(prev - cur)}/month.`,
        priority: "high",
        confidence: 0.85,
      });
    }
  }

  // Healthy state — reinforce, don't pad.
  if (recs.length === 0 && ctx.hasData) {
    recs.push({
      id: "healthy",
      title: "Consolidate a healthy position",
      insight: `Margin ${totals.profitMargin.toFixed(1)}%, cash ${fmt(totals.cashPosition)}, ${invoices.overdueCount === 0 ? "no overdue invoices" : ""} — the fundamentals are sound.`,
      rootCause: "No red flags in the recorded data.",
      actions: [
        "Set aside a fixed % of monthly profit as a reserve.",
        "Use Forecasts to stress-test a 20% revenue drop before expanding.",
      ],
      expectedImpact: "Turns current strength into resilience.",
      priority: "low",
      confidence: 0.75,
    });
  }

  return recs.sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );
}
