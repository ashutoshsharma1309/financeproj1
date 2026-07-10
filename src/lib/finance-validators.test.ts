import { describe, it, expect } from "vitest";
import {
  transactionSchema,
  revenueSchema,
  expenseSchema,
  accountSchema,
  categorySchema,
} from "./validators";

describe("amount rules (shared)", () => {
  it("rejects zero and negative amounts", () => {
    const base = { source: "Sales", date: "2026-01-01" };
    expect(revenueSchema.safeParse({ ...base, amount: 0 }).success).toBe(false);
    expect(revenueSchema.safeParse({ ...base, amount: -5 }).success).toBe(false);
  });

  it("rejects a non-numeric amount", () => {
    const r = revenueSchema.safeParse({
      source: "Sales",
      date: "2026-01-01",
      amount: "lots" as unknown as number,
    });
    expect(r.success).toBe(false);
  });
});

describe("transactionSchema", () => {
  it("accepts a valid income transaction", () => {
    const r = transactionSchema.safeParse({
      type: "INCOME",
      amount: 100,
      description: "Sale",
      date: "2026-01-01",
    });
    expect(r.success).toBe(true);
  });

  it("requires a description", () => {
    const r = transactionSchema.safeParse({
      type: "EXPENSE",
      amount: 100,
      description: "",
      date: "2026-01-01",
    });
    expect(r.success).toBe(false);
  });

  it("rejects an unknown type", () => {
    const r = transactionSchema.safeParse({
      type: "TRANSFER",
      amount: 100,
      description: "x",
      date: "2026-01-01",
    });
    expect(r.success).toBe(false);
  });
});

describe("revenue and expense schemas", () => {
  it("revenue requires a source", () => {
    expect(revenueSchema.safeParse({ source: "", amount: 1, date: "2026-01-01" }).success).toBe(false);
  });
  it("expense requires a vendor", () => {
    expect(expenseSchema.safeParse({ vendor: "", amount: 1, date: "2026-01-01" }).success).toBe(false);
  });
});

describe("accountSchema", () => {
  it("allows a negative balance (e.g. a liability)", () => {
    const r = accountSchema.safeParse({ name: "Loan", kind: "LIABILITY", balance: -500 });
    expect(r.success).toBe(true);
  });
  it("rejects an unknown account kind", () => {
    expect(accountSchema.safeParse({ name: "X", kind: "CRYPTO", balance: 1 }).success).toBe(false);
  });
});

describe("categorySchema", () => {
  it("requires a name and a valid kind", () => {
    expect(categorySchema.safeParse({ name: "Sales", kind: "INCOME", color: "#fff" }).success).toBe(true);
    expect(categorySchema.safeParse({ name: "", kind: "INCOME", color: "#fff" }).success).toBe(false);
  });
});
