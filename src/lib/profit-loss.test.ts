import { describe, it, expect } from "vitest";
import { buildProfitLoss } from "./calculations";
import type { FinanceData } from "./types";

const data: FinanceData = {
  transactions: [],
  revenues: [
    { id: "r1", source: "Sales", amount: 200000, date: "2026-01-10", createdAt: "2026-01-10" },
    { id: "r2", source: "Sales", amount: 100000, date: "2026-06-10", createdAt: "2026-06-10" },
  ],
  expenses: [
    { id: "e1", vendor: "Ops", amount: 120000, date: "2026-01-11", createdAt: "2026-01-11" },
  ],
  invoices: [],
  accounts: [],
  categories: [],
};

describe("buildProfitLoss", () => {
  it("totals income, expense and net across all time", () => {
    const pl = buildProfitLoss(data);
    expect(pl.totalIncome).toBe(300000);
    expect(pl.totalExpense).toBe(120000);
    expect(pl.net).toBe(180000);
  });

  it("computes margin as net over income", () => {
    const pl = buildProfitLoss(data);
    expect(pl.margin).toBeCloseTo(60);
  });

  it("respects the date range filter", () => {
    const pl = buildProfitLoss(data, new Date("2026-01-01"), new Date("2026-03-01"));
    expect(pl.totalIncome).toBe(200000);
  });

  it("returns zero margin with no income", () => {
    const pl = buildProfitLoss({ ...data, revenues: [] });
    expect(pl.margin).toBe(0);
  });
});
