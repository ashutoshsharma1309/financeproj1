import { describe, it, expect } from "vitest";
import {
  incomeStream,
  expenseStream,
  profitMargin,
  totalAssets,
  totalLiabilities,
} from "./calculations";
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

function makeInvoice(status: "PAID" | "SENT" | "DRAFT", unitPrice: number) {
  return {
    id: `inv-${status}-${unitPrice}`,
    number: "INV-1",
    clientName: "Acme",
    issueDate: "2026-01-01",
    dueDate: "2026-02-01",
    status,
    taxRate: 0,
    items: [{ id: "i1", description: "Work", quantity: 1, unitPrice }],
    createdAt: "2026-01-01",
  };
}

describe("incomeStream", () => {
  it("combines revenue entries, INCOME transactions and PAID invoices", () => {
    const data: FinanceData = {
      ...base,
      revenues: [
        { id: "r1", source: "Retainer", amount: 1000, date: "2026-01-01", createdAt: "2026-01-01" },
      ],
      transactions: [
        { id: "t1", type: "INCOME", amount: 500, description: "Tip", date: "2026-01-02", createdAt: "2026-01-02" },
        { id: "t2", type: "EXPENSE", amount: 999, description: "Ignore", date: "2026-01-02", createdAt: "2026-01-02" },
      ],
      invoices: [makeInvoice("PAID", 2000)],
    };
    const stream = incomeStream(data);
    expect(stream).toHaveLength(3);
    expect(stream.reduce((a, x) => a + x.amount, 0)).toBe(3500);
  });

  it("excludes invoices that are not PAID", () => {
    const data: FinanceData = {
      ...base,
      invoices: [makeInvoice("SENT", 2000), makeInvoice("DRAFT", 3000)],
    };
    expect(incomeStream(data)).toHaveLength(0);
  });
});

describe("expenseStream", () => {
  it("combines expense entries and EXPENSE transactions only", () => {
    const data: FinanceData = {
      ...base,
      expenses: [
        { id: "e1", vendor: "Rent", amount: 800, date: "2026-01-01", createdAt: "2026-01-01" },
      ],
      transactions: [
        { id: "t1", type: "EXPENSE", amount: 200, description: "Coffee", date: "2026-01-02", createdAt: "2026-01-02" },
        { id: "t2", type: "INCOME", amount: 999, description: "Ignore", date: "2026-01-02", createdAt: "2026-01-02" },
      ],
    };
    const stream = expenseStream(data);
    expect(stream).toHaveLength(2);
    expect(stream.reduce((a, x) => a + x.amount, 0)).toBe(1000);
  });
});

describe("profitMargin", () => {
  it("is zero when there is no revenue (no divide-by-zero)", () => {
    expect(profitMargin(base)).toBe(0);
  });

  it("expresses net profit as a percentage of revenue", () => {
    const data: FinanceData = {
      ...base,
      revenues: [{ id: "r1", source: "Sales", amount: 1000, date: "2026-01-01", createdAt: "2026-01-01" }],
      expenses: [{ id: "e1", vendor: "Ops", amount: 750, date: "2026-01-01", createdAt: "2026-01-01" }],
    };
    expect(profitMargin(data)).toBeCloseTo(25);
  });
});

describe("account roll-ups", () => {
  const accounts: Account[] = [
    { id: "a1", name: "Wallet", kind: "CASH", balance: 1000 },
    { id: "a2", name: "Checking", kind: "BANK", balance: 4000 },
    { id: "a3", name: "Equipment", kind: "ASSET", balance: 2000 },
    { id: "a4", name: "Card", kind: "CREDIT", balance: 500 },
    { id: "a5", name: "Loan", kind: "LIABILITY", balance: 1500 },
  ];

  it("totalAssets sums CASH + BANK + ASSET", () => {
    expect(totalAssets(accounts)).toBe(7000);
  });

  it("totalLiabilities sums CREDIT + LIABILITY", () => {
    expect(totalLiabilities(accounts)).toBe(2000);
  });
});
