import { describe, it, expect } from "vitest";
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

describe("buildFinancialContext", () => {
  it("reports hasData=false and zeroed totals for empty data", () => {
    const ctx = buildFinancialContext(empty, "USD");
    expect(ctx.hasData).toBe(false);
    expect(ctx.currency).toBe("USD");
    expect(ctx.totals.revenue).toBe(0);
    expect(ctx.totals.expenses).toBe(0);
    expect(ctx.counts.revenues).toBe(0);
  });

  it("derives totals and counts from real entries", () => {
    const data: FinanceData = {
      ...empty,
      revenues: [{ id: "r1", source: "Sales", amount: 1000, date: thisMonthISO(), createdAt: thisMonthISO() }],
      expenses: [{ id: "e1", vendor: "Rent", amount: 400, date: thisMonthISO(), createdAt: thisMonthISO() }],
    };
    const ctx = buildFinancialContext(data, "USD");
    expect(ctx.hasData).toBe(true);
    expect(ctx.totals.revenue).toBe(1000);
    expect(ctx.totals.expenses).toBe(400);
    expect(ctx.totals.netProfit).toBe(600);
    expect(ctx.counts.revenues).toBe(1);
    expect(ctx.counts.expenses).toBe(1);
  });

  it("normalizes infinite runway to null (profitable business)", () => {
    const data: FinanceData = {
      ...empty,
      accounts: [{ id: "a1", name: "Cash", kind: "CASH", balance: 5000 }],
      revenues: [{ id: "r1", source: "Sales", amount: 1000, date: thisMonthISO(), createdAt: thisMonthISO() }],
    };
    const ctx = buildFinancialContext(data, "USD");
    expect(ctx.totals.runwayMonths).toBeNull();
  });

  it("provides a 12-point monthly series", () => {
    const ctx = buildFinancialContext(empty, "USD");
    expect(ctx.monthly).toHaveLength(12);
  });
});
