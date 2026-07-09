import { describe, it, expect } from "vitest";
import { monthlySeries, monthOverMonth } from "./calculations";
import type { FinanceData } from "./calculations";

const base: FinanceData = {
  transactions: [],
  revenues: [],
  expenses: [],
  invoices: [],
  accounts: [],
  categories: [],
};

/** ISO date on the 15th of the month `offset` months before now. */
function monthsAgoISO(offset: number): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - offset, 15).toISOString();
}

describe("monthlySeries", () => {
  it("always spans the requested trailing window, zero-filled", () => {
    const series = monthlySeries(base, 6);
    expect(series).toHaveLength(6);
    expect(series.every((p) => p.income === 0 && p.expense === 0)).toBe(true);
  });

  it("returns points in chronological order (oldest first)", () => {
    const series = monthlySeries(base, 4);
    const keys = series.map((p) => p.key);
    expect([...keys].sort()).toEqual(keys);
  });

  it("buckets income and expense into the correct month and nets them", () => {
    const data: FinanceData = {
      ...base,
      revenues: [{ id: "r1", source: "Sales", amount: 1000, date: monthsAgoISO(0), createdAt: monthsAgoISO(0) }],
      expenses: [{ id: "e1", vendor: "Rent", amount: 400, date: monthsAgoISO(0), createdAt: monthsAgoISO(0) }],
    };
    const series = monthlySeries(data, 3);
    const current = series[series.length - 1];
    expect(current.income).toBe(1000);
    expect(current.expense).toBe(400);
    expect(current.net).toBe(600);
  });

  it("drops entries that fall outside the trailing window", () => {
    const data: FinanceData = {
      ...base,
      revenues: [{ id: "r1", source: "Old", amount: 5000, date: monthsAgoISO(24), createdAt: monthsAgoISO(24) }],
    };
    const series = monthlySeries(data, 3);
    expect(series.reduce((a, p) => a + p.income, 0)).toBe(0);
  });
});

describe("monthOverMonth", () => {
  it("compares the current month against the previous one", () => {
    const data: FinanceData = {
      ...base,
      revenues: [
        { id: "r0", source: "Prev", amount: 1000, date: monthsAgoISO(1), createdAt: monthsAgoISO(1) },
        { id: "r1", source: "Cur", amount: 1500, date: monthsAgoISO(0), createdAt: monthsAgoISO(0) },
      ],
    };
    const mom = monthOverMonth(data);
    expect(mom.current.income).toBe(1500);
    expect(mom.previous.income).toBe(1000);
    expect(mom.revenueDelta).toBeCloseTo(50);
  });
});
