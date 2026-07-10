import { describe, it, expect, beforeEach } from "vitest";
import { useFinanceStore } from "./store";
import type { Company } from "./types";

const reset = () => useFinanceStore.getState().resetAll();

const company: Company = {
  name: "Test Co",
  currency: "USD",
  fiscalYearStart: 1,
} as Company;

describe("finance store — company & onboarding", () => {
  beforeEach(reset);

  it("setCompany marks the workspace onboarded and seeds default categories", () => {
    useFinanceStore.getState().setCompany(company);
    const state = useFinanceStore.getState();
    expect(state.onboarded).toBe(true);
    expect(state.company?.name).toBe("Test Co");
    expect(state.categories.length).toBeGreaterThan(0);
    expect(state.categories.some((c) => c.kind === "INCOME")).toBe(true);
    expect(state.categories.some((c) => c.kind === "EXPENSE")).toBe(true);
  });

  it("does not reseed categories when they already exist", () => {
    const s = useFinanceStore.getState();
    s.setCompany(company);
    const count = useFinanceStore.getState().categories.length;
    s.setCompany({ ...company, name: "Renamed" });
    expect(useFinanceStore.getState().categories).toHaveLength(count);
    expect(useFinanceStore.getState().company?.name).toBe("Renamed");
  });

  it("resetAll returns the store to a clean, un-onboarded state", () => {
    const s = useFinanceStore.getState();
    s.setCompany(company);
    s.addRevenue({ source: "Sales", amount: 100, date: "2026-01-01" });
    s.resetAll();
    const state = useFinanceStore.getState();
    expect(state.onboarded).toBe(false);
    expect(state.company).toBeNull();
    expect(state.revenues).toHaveLength(0);
    expect(state.categories).toHaveLength(0);
  });
});
