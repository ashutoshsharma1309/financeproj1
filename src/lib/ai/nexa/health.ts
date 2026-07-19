// Nexa — Business Health Score.
// Five weighted pillars computed strictly from the user's FinancialContext.
// Pillars without underlying data are excluded and the weights renormalized,
// so the score never rests on fabricated numbers.

import type { FinancialContext } from "../context";
import { clamp } from "@/lib/utils";

export interface HealthPillar {
  key: "profitability" | "liquidity" | "receivables" | "growth" | "resilience";
  label: string;
  /** 0–100 within the pillar, or null when the data to judge it is absent. */
  score: number | null;
  weight: number;
  detail: string;
}

export interface BusinessHealth {
  /** 0–100 overall, or null when no financial data exists at all. */
  score: number | null;
  grade: "Strong" | "Stable" | "Watch" | "At risk" | "No data";
  pillars: HealthPillar[];
}

function gradeFor(score: number): BusinessHealth["grade"] {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Stable";
  if (score >= 40) return "Watch";
  return "At risk";
}

/** Month-over-month revenue delta (%) from the trailing series, or null. */
function momRevenueDelta(ctx: FinancialContext): number | null {
  const m = ctx.monthly;
  if (m.length < 2) return null;
  const prev = m[m.length - 2].income;
  const cur = m[m.length - 1].income;
  if (prev === 0 && cur === 0) return null;
  if (prev === 0) return 100;
  return ((cur - prev) / prev) * 100;
}

export function computeBusinessHealth(ctx: FinancialContext): BusinessHealth {
  if (!ctx.hasData) {
    return {
      score: null,
      grade: "No data",
      pillars: [],
    };
  }

  const { totals, invoices } = ctx;
  const pillars: HealthPillar[] = [];

  // Profitability — margin mapped so -20% → 0, 0% → 50, +20% → 100.
  const hasPL = totals.revenue > 0 || totals.expenses > 0;
  pillars.push({
    key: "profitability",
    label: "Profitability",
    weight: 0.3,
    score: hasPL ? clamp((totals.profitMargin + 20) * 2.5, 0, 100) : null,
    detail: hasPL
      ? `Net margin ${totals.profitMargin.toFixed(1)}%`
      : "Add revenue and expenses to assess margin",
  });

  // Liquidity — runway: null runway means cash-flow positive (full marks) when
  // accounts exist; otherwise months-of-cash scaled to a 12-month horizon.
  const hasAccounts = ctx.counts.accounts > 0;
  pillars.push({
    key: "liquidity",
    label: "Cash & runway",
    weight: 0.25,
    score: hasAccounts
      ? totals.runwayMonths === null
        ? 100
        : clamp((totals.runwayMonths / 12) * 100, 0, 100)
      : null,
    detail: hasAccounts
      ? totals.runwayMonths === null
        ? "Cash-flow positive — no burn-down limit"
        : `~${totals.runwayMonths.toFixed(1)} months of runway`
      : "Add account balances to measure runway",
  });

  // Receivables — share of outstanding invoice value that is overdue.
  const hasInvoices = invoices.count > 0;
  const overdueShare =
    invoices.outstandingAmount > 0
      ? invoices.overdueAmount / invoices.outstandingAmount
      : 0;
  pillars.push({
    key: "receivables",
    label: "Receivables",
    weight: 0.15,
    score: hasInvoices ? clamp(100 - overdueShare * 100, 0, 100) : null,
    detail: hasInvoices
      ? invoices.overdueCount > 0
        ? `${invoices.overdueCount} overdue invoice(s), ${(overdueShare * 100).toFixed(0)}% of outstanding value`
        : "No overdue invoices"
      : "No invoices issued yet",
  });

  // Growth — MoM revenue delta mapped so -50% → 0, 0 → 50, +50% → 100.
  const delta = momRevenueDelta(ctx);
  pillars.push({
    key: "growth",
    label: "Growth",
    weight: 0.2,
    score: delta === null ? null : clamp(50 + delta, 0, 100),
    detail:
      delta === null
        ? "Needs at least two months of activity"
        : `Revenue ${delta >= 0 ? "up" : "down"} ${Math.abs(delta).toFixed(1)}% month-over-month`,
  });

  // Resilience — expense concentration: full marks up to a 30% top-category
  // share, falling to 0 at 80%.
  const topShare = ctx.topExpenseCategories[0]?.share;
  pillars.push({
    key: "resilience",
    label: "Cost resilience",
    weight: 0.1,
    score:
      topShare === undefined
        ? null
        : clamp(100 - Math.max(0, topShare - 30) * 2, 0, 100),
    detail:
      topShare === undefined
        ? "No categorized expenses yet"
        : `${ctx.topExpenseCategories[0].name} is ${topShare.toFixed(0)}% of spend`,
  });

  const available = pillars.filter((p) => p.score !== null);
  if (available.length === 0) {
    return { score: null, grade: "No data", pillars };
  }
  const totalWeight = available.reduce((a, p) => a + p.weight, 0);
  const score = Math.round(
    available.reduce((a, p) => a + (p.score as number) * (p.weight / totalWeight), 0),
  );
  return { score, grade: gradeFor(score), pillars };
}
