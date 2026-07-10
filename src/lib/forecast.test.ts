import { describe, it, expect } from "vitest";
import { projectForecast } from "./calculations";
import type { FinanceData } from "./calculations";
import type { Forecast } from "./types";

const data: FinanceData = {
  transactions: [],
  revenues: [
    { id: "r1", source: "Sales", amount: 100000, date: "2026-01-10", createdAt: "2026-01-10" },
  ],
  expenses: [
    { id: "e1", vendor: "Ops", amount: 40000, date: "2026-01-11", createdAt: "2026-01-11" },
  ],
  invoices: [],
  accounts: [],
  categories: [],
};

const forecast: Forecast = {
  id: "f1",
  name: "Base case",
  horizon: 12,
  revenueGrowth: 5,
  expenseGrowth: 3,
  startingCash: 500000,
  createdAt: "2026-01-01",
};

describe("projectForecast", () => {
  it("produces one point per month in the horizon", () => {
    expect(projectForecast(forecast, data)).toHaveLength(12);
  });

  it("respects a shorter horizon", () => {
    expect(projectForecast({ ...forecast, horizon: 6 }, data)).toHaveLength(6);
  });

  it("returns numeric revenue, expense and cash for each point", () => {
    const point = projectForecast(forecast, data)[0];
    expect(typeof point.revenue).toBe("number");
    expect(typeof point.expense).toBe("number");
    expect(typeof point.cash).toBe("number");
  });
});
