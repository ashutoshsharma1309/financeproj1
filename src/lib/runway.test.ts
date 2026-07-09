import { describe, it, expect } from "vitest";
import { monthlyBurn, runwayMonths, cashFlowSeries } from "./calculations";
import type { FinanceData } from "./calculations";
import type { Account } from "./types";

const base: FinanceData = {
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

const cash1000: Account[] = [{ id: "a1", name: "Cash", kind: "CASH", balance: 1000 }];

describe("monthlyBurn", () => {
  it("is zero with no activity", () => {
    expect(monthlyBurn(base)).toBe(0);
  });

  it("is negative when expenses exceed income in the window", () => {
    const data: FinanceData = {
      ...base,
      expenses: [{ id: "e1", vendor: "Rent", amount: 500, date: thisMonthISO(), createdAt: thisMonthISO() }],
    };
    expect(monthlyBurn(data)).toBeLessThan(0);
  });
});

describe("runwayMonths", () => {
  it("is Infinity when the business is not burning cash", () => {
    const data: FinanceData = {
      ...base,
      accounts: cash1000,
      revenues: [{ id: "r1", source: "Sales", amount: 500, date: thisMonthISO(), createdAt: thisMonthISO() }],
    };
    expect(runwayMonths(data)).toBe(Infinity);
  });

  it("divides cash by burn when the business is losing money", () => {
    const data: FinanceData = {
      ...base,
      accounts: cash1000,
      expenses: [{ id: "e1", vendor: "Rent", amount: 500, date: thisMonthISO(), createdAt: thisMonthISO() }],
    };
    // cash 1000 / burn 500 = 2 months
    expect(runwayMonths(data)).toBeCloseTo(2);
  });
});

describe("cashFlowSeries", () => {
  it("ends at the current cash position", () => {
    const data: FinanceData = {
      ...base,
      accounts: cash1000,
      revenues: [{ id: "r1", source: "Sales", amount: 300, date: thisMonthISO(), createdAt: thisMonthISO() }],
      expenses: [{ id: "e1", vendor: "Rent", amount: 100, date: thisMonthISO(), createdAt: thisMonthISO() }],
    };
    const series = cashFlowSeries(data, 6);
    expect(series).toHaveLength(6);
    // The running balance is back-filled so the latest point equals cash on hand.
    expect(series[series.length - 1].balance).toBeCloseTo(1000);
  });

  it("reflects inflow and outflow per point", () => {
    const data: FinanceData = {
      ...base,
      accounts: cash1000,
      revenues: [{ id: "r1", source: "Sales", amount: 300, date: thisMonthISO(), createdAt: thisMonthISO() }],
      expenses: [{ id: "e1", vendor: "Rent", amount: 100, date: thisMonthISO(), createdAt: thisMonthISO() }],
    };
    const current = cashFlowSeries(data, 6).at(-1)!;
    expect(current.inflow).toBe(300);
    expect(current.outflow).toBe(100);
    expect(current.net).toBe(200);
  });
});
