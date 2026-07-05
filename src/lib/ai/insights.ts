// Deterministic, data-grounded analysis used when no GEMINI_API_KEY is set.
// It answers ONLY from the FinancialContext — no fabricated figures — so the
// assistant remains genuinely useful offline and never invents numbers.

import type { FinancialContext } from "./context";

function money(v: number, currency: string) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(v);
}

function pct(v: number) {
  return `${v.toFixed(1)}%`;
}

const NEED_DATA =
  "I don't have enough data to answer that yet. Add your revenue, expenses, and account balances so I can analyze your real numbers.";

export function localAnalysis(question: string, ctx: FinancialContext): string {
  const q = question.toLowerCase();
  const { currency, totals } = ctx;

  if (!ctx.hasData) {
    return `${NEED_DATA}\n\nStart by adding a bank account balance under **Cash Flow → Accounts**, then log a few revenue and expense entries.`;
  }

  const runwayText =
    totals.runwayMonths === null
      ? totals.monthlyBurn >= 0
        ? "You are currently cash-flow positive, so you have no burn-down runway limit based on recent activity."
        : "I need your account balances to compute runway."
      : `At your recent average burn of ${money(
          Math.abs(totals.monthlyBurn),
          currency,
        )}/mo against ${money(totals.cashPosition, currency)} cash, your runway is about **${totals.runwayMonths.toFixed(1)} months**.`;

  // ── Runway / cash ──────────────────────────────────────────
  if (q.includes("runway") || (q.includes("cash") && q.includes("last"))) {
    const lines = [
      `**Cash & runway**`,
      `- Cash position: ${money(totals.cashPosition, currency)}`,
      `- Avg monthly net: ${money(totals.monthlyBurn, currency)}`,
      `- ${runwayText}`,
    ];
    if (totals.monthlyBurn < 0) {
      lines.push(
        `\nTo extend runway, focus on your largest expense category (${
          ctx.topExpenseCategories[0]?.name ?? "n/a"
        }, ${money(ctx.topExpenseCategories[0]?.value ?? 0, currency)}) and accelerate the ${money(
          ctx.invoices.outstandingAmount,
          currency,
        )} in outstanding invoices.`,
      );
    }
    return lines.join("\n");
  }

  // ── What-if revenue drop ───────────────────────────────────
  const dropMatch = q.match(/(\d{1,3})\s*%/);
  if (q.includes("what if") || q.includes("decrease") || q.includes("drop") || q.includes("revenue falls")) {
    const drop = dropMatch ? Number(dropMatch[1]) : 20;
    const newRevenue = totals.revenue * (1 - drop / 100);
    const newNet = newRevenue - totals.expenses;
    return [
      `**What-if: revenue down ${drop}%**`,
      `- Current revenue: ${money(totals.revenue, currency)} → ${money(newRevenue, currency)}`,
      `- Expenses (held constant): ${money(totals.expenses, currency)}`,
      `- Net profit would move from ${money(totals.netProfit, currency)} to **${money(newNet, currency)}**`,
      newNet < 0
        ? `\n⚠️ You would be operating at a loss. You'd need to cut roughly ${money(
            Math.abs(newNet),
            currency,
          )} in expenses to stay break-even.`
        : `\n✅ You would remain profitable, with a margin of ${pct(
            newRevenue === 0 ? 0 : (newNet / newRevenue) * 100,
          )}.`,
    ].join("\n");
  }

  // ── Hiring affordability ───────────────────────────────────
  if (q.includes("hire") || q.includes("employee") || q.includes("headcount")) {
    const buffer = totals.netProfit;
    return [
      `**Can you afford to hire?**`,
      `- Monthly net (recent avg): ${money(totals.monthlyBurn, currency)}`,
      `- Cumulative net profit: ${money(buffer, currency)}`,
      `- Cash on hand: ${money(totals.cashPosition, currency)}`,
      totals.monthlyBurn > 0
        ? `\nYou have positive monthly cash generation of ${money(
            totals.monthlyBurn,
            currency,
          )}. A new hire is sustainable if their fully-loaded monthly cost stays below that figure while keeping ${totals.runwayMonths === null ? "healthy" : `${totals.runwayMonths.toFixed(0)}mo of`} runway intact.`
        : `\nYour recent months are cash-negative (${money(
            totals.monthlyBurn,
            currency,
          )}/mo). Adding fixed payroll would shorten runway — I'd hold off until net turns positive or you close the ${money(
            ctx.invoices.outstandingAmount,
            currency,
          )} outstanding.`,
    ].join("\n");
  }

  // ── Expense analysis ───────────────────────────────────────
  if (q.includes("expense") || q.includes("cut") || q.includes("spend") || q.includes("cost")) {
    if (ctx.topExpenseCategories.length === 0) return NEED_DATA;
    const top = ctx.topExpenseCategories
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} — ${money(c.value, currency)} (${pct(c.share)} of spend)`,
      )
      .join("\n");
    return [
      `**Expense breakdown** (total ${money(totals.expenses, currency)})`,
      top,
      `\nYour largest lever is **${ctx.topExpenseCategories[0].name}**. A 10% reduction there saves ${money(
        ctx.topExpenseCategories[0].value * 0.1,
        currency,
      )}.`,
    ].join("\n");
  }

  // ── Revenue analysis ───────────────────────────────────────
  if (q.includes("revenue") || q.includes("income") || q.includes("sales") || q.includes("earn")) {
    if (ctx.topIncomeCategories.length === 0) return NEED_DATA;
    const top = ctx.topIncomeCategories
      .map((c, i) => `${i + 1}. ${c.name} — ${money(c.value, currency)} (${pct(c.share)})`)
      .join("\n");
    return [
      `**Revenue breakdown** (total ${money(totals.revenue, currency)})`,
      top,
      `\nProfit margin is ${pct(totals.profitMargin)}. ${
        ctx.topIncomeCategories[0]?.share > 60
          ? `⚠️ ${ctx.topIncomeCategories[0].name} is ${pct(
              ctx.topIncomeCategories[0].share,
            )} of revenue — concentration risk. Diversifying reduces exposure.`
          : "Revenue is reasonably diversified across sources."
      }`,
    ].join("\n");
  }

  // ── Invoices ───────────────────────────────────────────────
  if (q.includes("invoice") || q.includes("owed") || q.includes("receivable") || q.includes("client")) {
    return [
      `**Invoices**`,
      `- Paid: ${money(ctx.invoices.paidAmount, currency)} (${ctx.invoices.paidCount})`,
      `- Outstanding: ${money(ctx.invoices.outstandingAmount, currency)} (${ctx.invoices.outstandingCount})`,
      `- Overdue: ${money(ctx.invoices.overdueAmount, currency)} (${ctx.invoices.overdueCount})`,
      ctx.invoices.overdueCount > 0
        ? `\n⚠️ Chase the ${ctx.invoices.overdueCount} overdue invoice(s) first — that's ${money(
            ctx.invoices.overdueAmount,
            currency,
          )} of collectible cash.`
        : `\nNo overdue invoices — collections are healthy.`,
    ].join("\n");
  }

  // ── Risks ──────────────────────────────────────────────────
  if (q.includes("risk") || q.includes("danger") || q.includes("worry") || q.includes("problem")) {
    const risks: string[] = [];
    if (totals.netProfit < 0)
      risks.push(`- Operating at a net loss of ${money(Math.abs(totals.netProfit), currency)}.`);
    if (totals.runwayMonths !== null && totals.runwayMonths < 6)
      risks.push(`- Runway under 6 months (${totals.runwayMonths.toFixed(1)}mo).`);
    if (ctx.invoices.overdueAmount > 0)
      risks.push(`- ${money(ctx.invoices.overdueAmount, currency)} in overdue receivables.`);
    if (ctx.topIncomeCategories[0]?.share > 60)
      risks.push(
        `- Revenue concentration: ${ctx.topIncomeCategories[0].name} is ${pct(
          ctx.topIncomeCategories[0].share,
        )} of income.`,
      );
    if (ctx.topExpenseCategories[0]?.share > 50)
      risks.push(
        `- Expense concentration: ${ctx.topExpenseCategories[0].name} is ${pct(
          ctx.topExpenseCategories[0].share,
        )} of spend.`,
      );
    return risks.length
      ? [`**Detected risks**`, ...risks].join("\n")
      : `No major risks detected in your current data. Net profit is ${money(
          totals.netProfit,
          currency,
        )} and cash is ${money(totals.cashPosition, currency)}.`;
  }

  // ── Default: health summary ────────────────────────────────
  return [
    `**Financial health summary**`,
    `- Revenue: ${money(totals.revenue, currency)}`,
    `- Expenses: ${money(totals.expenses, currency)}`,
    `- Net profit: ${money(totals.netProfit, currency)} (margin ${pct(totals.profitMargin)})`,
    `- Cash position: ${money(totals.cashPosition, currency)}`,
    `- ${runwayText}`,
    ctx.invoices.outstandingAmount > 0
      ? `- Outstanding invoices: ${money(ctx.invoices.outstandingAmount, currency)}`
      : "",
    `\nAsk me about expenses, runway, hiring, or run a "what if" scenario.`,
  ]
    .filter(Boolean)
    .join("\n");
}
