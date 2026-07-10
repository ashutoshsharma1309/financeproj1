import { describe, it, expect, beforeEach } from "vitest";
import { useFinanceStore } from "./store";

const reset = () => useFinanceStore.getState().resetAll();

describe("finance store — CRUD + audit", () => {
  beforeEach(reset);

  it("addRevenue prepends the entry and records an audit log", () => {
    const s = useFinanceStore.getState();
    s.addRevenue({ source: "Retainer", amount: 1000, date: "2026-01-01" });
    s.addRevenue({ source: "Consulting", amount: 500, date: "2026-01-02" });

    const state = useFinanceStore.getState();
    expect(state.revenues).toHaveLength(2);
    // Newest first.
    expect(state.revenues[0].source).toBe("Consulting");
    expect(state.revenues[0].id).toBeTruthy();
    expect(state.auditLogs.some((l) => l.entity === "Revenue" && l.action === "create")).toBe(true);
  });

  it("updateRevenue patches only the targeted entry", () => {
    const s = useFinanceStore.getState();
    s.addRevenue({ source: "Retainer", amount: 1000, date: "2026-01-01" });
    const id = useFinanceStore.getState().revenues[0].id;
    s.updateRevenue(id, { amount: 1200 });
    expect(useFinanceStore.getState().revenues[0].amount).toBe(1200);
  });

  it("deleteExpense removes the entry", () => {
    const s = useFinanceStore.getState();
    s.addExpense({ vendor: "Rent", amount: 800, date: "2026-01-01" });
    const id = useFinanceStore.getState().expenses[0].id;
    s.deleteExpense(id);
    expect(useFinanceStore.getState().expenses).toHaveLength(0);
  });
});
