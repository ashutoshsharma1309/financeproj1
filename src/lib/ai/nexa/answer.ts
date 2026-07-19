// Nexa — deterministic chat controller.
// Routes recognized intents (health, digests, recommendations) to structured
// consultant-style answers; everything else falls through to the grounded
// local analyzer. Used when no LLM key is configured or a provider fails, so
// Nexa always answers — and never fabricates.

import type { FinancialContext } from "../context";
import { localAnalysis } from "../insights";
import { computeBusinessHealth } from "./health";
import { businessDigest, type DigestPeriod } from "./digest";
import { buildRecommendations, type Recommendation } from "./advisor";

function money(v: number, currency: string) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(v);
}

const NEED_DATA =
  "**Business Summary**\nThere isn't enough recorded data to advise on yet.\n\n**Next Steps**\n- Add revenue and expenses as they happen\n- Add account balances under **Cash Flow → Accounts**\n- Issue invoices from the **Invoices** page";

function formatHealth(ctx: FinancialContext): string {
  const h = computeBusinessHealth(ctx);
  if (h.score === null) return NEED_DATA;
  const bars = h.pillars
    .map((p) =>
      p.score === null
        ? `- ${p.label}: — (${p.detail})`
        : `- ${p.label}: **${Math.round(p.score)}/100** — ${p.detail}`,
    )
    .join("\n");
  return [
    `**Business Health Score: ${h.score}/100 — ${h.grade}**`,
    "",
    "**Insights**",
    bars,
    "",
    "**Next Steps**",
    "- Ask **\"where am I losing money?\"** for prioritized actions on the weakest pillar.",
  ].join("\n");
}

function formatDigest(ctx: FinancialContext, period: DigestPeriod, currency: string): string {
  if (!ctx.hasData) return NEED_DATA;
  const d = businessDigest(ctx, period);
  const lines = [
    `**Business Summary — ${d.label}**`,
    `- Revenue: ${money(d.revenue, currency)}${d.deltaRevenue !== null ? ` (${d.deltaRevenue >= 0 ? "+" : ""}${d.deltaRevenue.toFixed(1)}% vs prior period)` : ""}`,
    `- Expenses: ${money(d.expenses, currency)}`,
    `- Net: **${money(d.net, currency)}**`,
  ];
  if (d.highlights.length) lines.push("", "**Insights**", ...d.highlights.map((x) => `- ${x}`));
  if (d.warnings.length) lines.push("", "**Warnings**", ...d.warnings.map((x) => `- ${x}`));
  return lines.join("\n");
}

function formatRecommendation(r: Recommendation): string {
  return [
    `**${r.title}**`,
    `- Insight: ${r.insight}`,
    `- Root cause: ${r.rootCause}`,
    ...r.actions.map((a, i) => `- Action ${i + 1}: ${a}`),
    `- Expected impact: ${r.expectedImpact}`,
    `- Priority: **${r.priority.toUpperCase()}** · Confidence: ${Math.round(r.confidence * 100)}%`,
  ].join("\n");
}

function formatAdvice(ctx: FinancialContext): string {
  if (!ctx.hasData) return NEED_DATA;
  const recs = buildRecommendations(ctx);
  return [
    "**Recommended Actions** (prioritized from your data)",
    "",
    ...recs.slice(0, 3).map(formatRecommendation),
  ].join("\n\n");
}

/** Deterministic Nexa answer. Structured intents first, analyzer fallback. */
export function nexaAnswer(question: string, ctx: FinancialContext): string {
  const q = question.toLowerCase();
  const currency = ctx.currency;

  if (/(health|score|how (is|'s) my business|overall)/.test(q)) {
    return formatHealth(ctx);
  }
  if (/(today|daily)/.test(q) && /(summary|report|brief|business)/.test(q)) {
    return formatDigest(ctx, "day", currency);
  }
  if (/week/.test(q) && /(summary|report|brief)/.test(q)) {
    return formatDigest(ctx, "week", currency);
  }
  if (/month/.test(q) && /(summary|report|brief)/.test(q)) {
    return formatDigest(ctx, "month", currency);
  }
  if (/(year|annual)/.test(q) && /(summary|report|brief)/.test(q)) {
    return formatDigest(ctx, "year", currency);
  }
  if (
    /(recommend|suggest|advice|improve|strategy|plan|losing money|grow|increase profit|reduce cost|cut cost|90.day|roadmap)/.test(q)
  ) {
    return formatAdvice(ctx);
  }
  return localAnalysis(question, ctx);
}
