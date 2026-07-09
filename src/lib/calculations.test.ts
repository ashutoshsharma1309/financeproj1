import { describe, it, expect } from "vitest";
import {
  invoiceSubtotal,
  invoiceTax,
  invoiceTotal,
  totalRevenue,
  totalExpenses,
  netProfit,
  cashPosition,
  invoiceStats,
  hasAnyData,
} from "./calculations";
import type { FinanceData, Invoice, Account } from "./types";

const emptyData: FinanceData = {
  transactions: [],
  revenues: [],
  expenses: [],
  invoices: [],
  accounts: [],
  categories: [],
};

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: "inv1",
    number: "INV-0001",
    clientName: "Acme",
    issueDate: "2026-01-01",
    dueDate: "2026-02-01",
    status: "PAID",
    taxRate: 18,
    items: [
      { id: "i1", description: "Design", quantity: 2, unitPrice: 1000 },
      { id: "i2", description: "Dev", quantity: 1, unitPrice: 3000 },
    ],
    createdAt: "2026-01-01",
    ...overrides,
  };
}

describe("invoice math", () => {
  const inv = makeInvoice();

  it("sums line items into a subtotal", () => {
    expect(invoiceSubtotal(inv)).toBe(5000);
  });

  it("applies the tax rate to the subtotal", () => {
    expect(invoiceTax(inv)).toBe(900);
  });

  it("totals subtotal plus tax", () => {
    expect(invoiceTotal(inv)).toBe(5900);
  });

  it("handles a zero-tax invoice", () => {
    expect(invoiceTotal(makeInvoice({ taxRate: 0 }))).toBe(5000);
  });
});

describe("revenue, expense and profit", () => {
  const data: FinanceData = {
    ...emptyData,
    revenues: [
      { id: "r1", source: "Sales", amount: 100000, date: "2026-01-05", createdAt: "2026-01-05" },
    ],
    expenses: [
      { id: "e1", vendor: "AWS", amount: 30000, date: "2026-01-06", createdAt: "2026-01-06" },
    ],
    transactions: [
      { id: "t1", type: "INCOME", amount: 50000, description: "Consulting", date: "2026-01-07", createdAt: "2026-01-07" },
      { id: "t2", type: "EXPENSE", amount: 20000, description: "Rent", date: "2026-01-08", createdAt: "2026-01-08" },
    ],
  };

  it("sums revenue from revenues and income transactions", () => {
    expect(totalRevenue(data)).toBe(150000);
  });

  it("sums expenses from expenses and expense transactions", () => {
    expect(totalExpenses(data)).toBe(50000);
  });

  it("computes net profit as revenue minus expenses", () => {
    expect(netProfit(data)).toBe(100000);
  });
});

describe("cash position", () => {
  it("adds cash/bank/asset and subtracts credit/liability", () => {
    const accounts: Account[] = [
      { id: "a1", name: "Bank", kind: "BANK", balance: 500000 },
      { id: "a2", name: "Card", kind: "CREDIT", balance: 80000 },
      { id: "a3", name: "Loan", kind: "LIABILITY", balance: 120000 },
    ];
    expect(cashPosition(accounts)).toBe(300000);
  });
});

describe("invoice stats", () => {
  it("buckets amounts by status", () => {
    const stats = invoiceStats([
      makeInvoice({ id: "p", status: "PAID" }),
      makeInvoice({ id: "s", status: "SENT", dueDate: "2999-01-01" }),
    ]);
    expect(stats.count).toBe(2);
    expect(stats.paidAmount).toBe(5900);
    expect(stats.outstandingAmount).toBe(5900);
  });

  it("treats a past-due SENT invoice as overdue (and still outstanding)", () => {
    const stats = invoiceStats([
      makeInvoice({ id: "od", status: "SENT", dueDate: "2000-01-01" }),
    ]);
    // Effective status is OVERDUE, so it counts as overdue...
    expect(stats.overdueCount).toBe(1);
    expect(stats.overdueAmount).toBe(5900);
    // ...and the money is still owed, so it remains outstanding.
    expect(stats.outstandingCount).toBe(1);
    expect(stats.outstandingAmount).toBe(5900);
    expect(stats.paidCount).toBe(0);
  });

  it("keeps a not-yet-due SENT invoice out of the overdue bucket", () => {
    const stats = invoiceStats([
      makeInvoice({ id: "s", status: "SENT", dueDate: "2999-01-01" }),
    ]);
    expect(stats.overdueCount).toBe(0);
    expect(stats.outstandingCount).toBe(1);
  });
});

describe("hasAnyData", () => {
  it("is false for an empty workspace", () => {
    expect(hasAnyData(emptyData)).toBe(false);
  });

  it("is true once any record exists", () => {
    expect(hasAnyData({ ...emptyData, revenues: [{ id: "r", source: "x", amount: 1, date: "2026-01-01", createdAt: "2026-01-01" }] })).toBe(true);
  });
});
