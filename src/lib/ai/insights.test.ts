import { describe, it, expect } from "vitest";
import { localAnalysis } from "./insights";
import { buildFinancialContext } from "./context";
import type { FinanceData } from "@/lib/calculations";

const empty: FinanceData = {
  transactions: [],
  revenues: [],
  expenses: [],
  invoices: [],
  accounts: [],
  categories: [],
};

function thisMonthISO(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 15).toISOString();
}

const profitable: FinanceData = {
  ...empty,
  accounts: [{ id: "a1", name: "Cash", kind: "CASH", balance: 5000 }],
  revenues: [{ id: "r1", source: "Sales", amount: 2000, date: thisMonthISO(), createdAt: thisMonthISO() }],
  expenses: [{ id: "e1", vendor: "Rent", amount: 800, date: thisMonthISO(), createdAt: thisMonthISO() }],
};

const burning: FinanceData = {
  ...empty,
  accounts: [{ id: "a1", name: "Cash", kind: "CASH", balance: 1000 }],
  expenses: [{ id: "e1", vendor: "Rent", amount: 500, date: thisMonthISO(), createdAt: thisMonthISO() }],
};

describe("localAnalysis", () => {
  it("asks for data when the context is empty and never invents figures", () => {
    const ctx = buildFinancialContext(empty, "USD");
    const out = localAnalysis("How's my business doing?", ctx);
    expect(out).toContain("don't have enough data");
  });

  it("answers a runway question with the finite runway when burning cash", () => {
    const ctx = buildFinancialContext(burning, "USD");
    const out = localAnalysis("What's my runway?", ctx);
    expect(out).toContain("Cash & runway");
    expect(out).toContain("months");
  });

  it("runs a what-if revenue-drop scenario using the stated percentage", () => {
    const ctx = buildFinancialContext(profitable, "USD");
    const out = localAnalysis("What if revenue drops 30%?", ctx);
    expect(out).toContain("What-if: revenue down 30%");
  });

  it("summarizes invoices when asked", () => {
    const ctx = buildFinancialContext(profitable, "USD");
    const out = localAnalysis("How much am I owed in invoices?", ctx);
    expect(out).toContain("Invoices");
    expect(out).toContain("Outstanding");
  });

  it("falls back to a health summary for an open-ended question", () => {
    const ctx = buildFinancialContext(profitable, "USD");
    const out = localAnalysis("Give me an overview", ctx);
    expect(out).toContain("Financial health summary");
    expect(out).toContain("Net profit");
  });
});
