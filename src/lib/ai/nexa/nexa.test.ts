import { describe, it, expect } from "vitest";
import { buildFinancialContext } from "../context";
import { computeBusinessHealth } from "./health";
import { businessDigest } from "./digest";
import { buildRecommendations } from "./advisor";
import { nexaAnswer } from "./answer";
import type { FinanceData } from "@/lib/calculations";

const empty: FinanceData = {
  transactions: [],
  revenues: [],
  expenses: [],
  invoices: [],
  accounts: [],
  categories: [],
};

function thisMonthISO(day = 15): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), day).toISOString();
}

const profitable: FinanceData = {
  ...empty,
  accounts: [{ id: "a1", name: "Bank", kind: "BANK", balance: 500000 }],
  revenues: [
    { id: "r1", source: "Sales", amount: 300000, date: thisMonthISO(2), createdAt: thisMonthISO(2) },
  ],
  expenses: [
    { id: "e1", vendor: "Rent", amount: 120000, date: thisMonthISO(3), categoryId: "c1", createdAt: thisMonthISO(3) },
  ],
  categories: [{ id: "c1", name: "Rent", kind: "EXPENSE", color: "#000" }],
};

const losing: FinanceData = {
  ...empty,
  accounts: [{ id: "a1", name: "Cash", kind: "CASH", balance: 100000 }],
  expenses: [
    { id: "e1", vendor: "Payroll", amount: 300000, date: thisMonthISO(1), categoryId: "c1", createdAt: thisMonthISO(1) },
  ],
  invoices: [
    {
      id: "inv1", number: "INV-1", clientName: "Acme", issueDate: "2000-01-01",
      dueDate: "2000-02-01", status: "SENT", taxRate: 0,
      items: [{ id: "it1", description: "Work", quantity: 1, unitPrice: 50000 }],
      createdAt: "2000-01-01",
    },
  ],
  categories: [{ id: "c1", name: "Payroll", kind: "EXPENSE", color: "#000" }],
};

describe("computeBusinessHealth", () => {
  it("returns No data for an empty business", () => {
    const h = computeBusinessHealth(buildFinancialContext(empty, "INR"));
    expect(h.score).toBeNull();
    expect(h.grade).toBe("No data");
  });

  it("produces a bounded score with pillars for a real business", () => {
    const h = computeBusinessHealth(buildFinancialContext(profitable, "INR"));
    expect(h.score).not.toBeNull();
    expect(h.score! >= 0 && h.score! <= 100).toBe(true);
    expect(h.pillars.length).toBeGreaterThan(0);
    expect(h.pillars.some((p) => p.key === "profitability")).toBe(true);
  });

  it("scores a loss-making, overdue business below a profitable one", () => {
    const good = computeBusinessHealth(buildFinancialContext(profitable, "INR")).score!;
    const bad = computeBusinessHealth(buildFinancialContext(losing, "INR")).score!;
    expect(bad).toBeLessThan(good);
  });
});

describe("businessDigest", () => {
  it("computes net = revenue - expenses for the month", () => {
    const d = businessDigest(buildFinancialContext(profitable, "INR"), "month");
    expect(d.revenue).toBe(300000);
    expect(d.expenses).toBe(120000);
    expect(d.net).toBe(180000);
  });

  it("flags overdue invoices as a warning", () => {
    const d = businessDigest(buildFinancialContext(losing, "INR"), "week");
    expect(d.warnings.some((w) => /overdue/i.test(w))).toBe(true);
  });

  it("handles a context missing the recent block without throwing", () => {
    const ctx = buildFinancialContext(profitable, "INR");
    // Simulate a stale client payload.
    const stale = { ...ctx, recent: undefined } as unknown as typeof ctx;
    expect(() => businessDigest(stale, "day")).not.toThrow();
  });
});

describe("buildRecommendations", () => {
  it("raises a critical net-loss recommendation when losing money", () => {
    const recs = buildRecommendations(buildFinancialContext(losing, "INR"));
    expect(recs.some((r) => r.priority === "critical")).toBe(true);
    expect(recs.some((r) => r.id === "overdue")).toBe(true);
  });

  it("cites the company's own figures, not generic advice", () => {
    const recs = buildRecommendations(buildFinancialContext(losing, "INR"));
    expect(recs[0].insight).toMatch(/[0-9]/);
  });

  it("returns a healthy note when there are no red flags", () => {
    const recs = buildRecommendations(buildFinancialContext(profitable, "INR"));
    expect(recs.length).toBeGreaterThan(0);
  });
});

describe("nexaAnswer routing", () => {
  const ctx = buildFinancialContext(losing, "INR");

  it("answers a health-score question with the score block", () => {
    expect(nexaAnswer("what's my business health score?", ctx)).toContain(
      "Business Health Score",
    );
  });

  it("answers today's summary with a dated digest", () => {
    expect(nexaAnswer("give me today's business summary", ctx)).toContain(
      "Business Summary — Today",
    );
  });

  it("answers a losing-money question with recommendations", () => {
    expect(nexaAnswer("where am I losing money?", ctx)).toContain(
      "Recommended Actions",
    );
  });

  it("asks for data when the business is empty", () => {
    const out = nexaAnswer("health score", buildFinancialContext(empty, "INR"));
    expect(out.toLowerCase()).toContain("enough recorded data");
  });
});
