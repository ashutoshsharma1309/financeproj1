import { describe, it, expect } from "vitest";
import { deriveAlerts, pickNewAlerts, type DerivedAlert } from "./notifications";
import type { FinanceData } from "./calculations";
import type { Invoice, Expense, Account, Settings } from "./types";

const settings: Settings = {
  emailNotifications: true,
  lowCashAlert: true,
  lowCashThreshold: 0,
};

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
    issueDate: "2000-01-01",
    dueDate: "2000-02-01",
    status: "PAID",
    taxRate: 0,
    items: [{ id: "i1", description: "Work", quantity: 1, unitPrice: 1000 }],
    createdAt: "2000-01-01",
    ...overrides,
  };
}

/** An ISO date inside the current month, so it lands in the trailing burn window. */
function thisMonthISO(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 15).toISOString();
}

describe("deriveAlerts", () => {
  it("returns no alerts for empty data (correct empty state)", () => {
    expect(deriveAlerts(emptyData, settings)).toEqual([]);
  });

  it("raises an overdue-invoices alert when an invoice is past due", () => {
    // A SENT invoice with a due date in the past is effectively OVERDUE.
    const data: FinanceData = {
      ...emptyData,
      invoices: [makeInvoice({ status: "SENT", dueDate: "2000-02-01" })],
    };
    const alerts = deriveAlerts(data, settings);
    const overdue = alerts.find((a) => a.key === "invoices-overdue");
    expect(overdue).toBeDefined();
    expect(overdue?.type).toBe("DANGER");
    expect(overdue?.title).toContain("1 overdue invoice");
  });

  it("pluralizes the overdue title for multiple invoices", () => {
    const data: FinanceData = {
      ...emptyData,
      invoices: [
        makeInvoice({ id: "a", status: "SENT", dueDate: "2000-02-01" }),
        makeInvoice({ id: "b", status: "SENT", dueDate: "2000-03-01" }),
      ],
    };
    const overdue = deriveAlerts(data, settings).find(
      (a) => a.key === "invoices-overdue",
    );
    expect(overdue?.title).toBe("2 overdue invoices");
  });

  it("raises a low-runway warning when cash covers under six months of burn", () => {
    const accounts: Account[] = [
      { id: "acc1", name: "Cash", kind: "CASH", balance: 1000 },
    ];
    const expenses: Expense[] = [
      {
        id: "e1",
        vendor: "Rent",
        amount: 1000,
        date: thisMonthISO(),
        createdAt: thisMonthISO(),
      },
    ];
    const data: FinanceData = { ...emptyData, accounts, expenses };
    const runway = deriveAlerts(data, settings).find(
      (a) => a.key === "runway-low",
    );
    expect(runway).toBeDefined();
    expect(runway?.type).toBe("WARNING");
  });

  it("suppresses the runway warning when lowCashAlert is off", () => {
    const accounts: Account[] = [
      { id: "acc1", name: "Cash", kind: "CASH", balance: 1000 },
    ];
    const expenses: Expense[] = [
      {
        id: "e1",
        vendor: "Rent",
        amount: 1000,
        date: thisMonthISO(),
        createdAt: thisMonthISO(),
      },
    ];
    const data: FinanceData = { ...emptyData, accounts, expenses };
    const alerts = deriveAlerts(data, { ...settings, lowCashAlert: false });
    expect(alerts.find((a) => a.key === "runway-low")).toBeUndefined();
  });
});

describe("pickNewAlerts", () => {
  const overdue: DerivedAlert = {
    key: "invoices-overdue",
    type: "DANGER",
    title: "1 overdue invoice",
    body: "…",
  };
  const runway: DerivedAlert = {
    key: "runway-low",
    type: "WARNING",
    title: "Runway below 6 months",
    body: "…",
  };

  it("returns all alerts when nothing is persisted yet", () => {
    expect(pickNewAlerts([], [overdue, runway])).toEqual([overdue, runway]);
  });

  it("drops alerts whose condition key is already persisted", () => {
    const existing = [{ key: "invoices-overdue" }];
    expect(pickNewAlerts(existing, [overdue, runway])).toEqual([runway]);
  });

  it("returns nothing when every alert is already persisted (no re-visit dupes)", () => {
    const existing = [{ key: "invoices-overdue" }, { key: "runway-low" }];
    expect(pickNewAlerts(existing, [overdue, runway])).toEqual([]);
  });

  it("ignores persisted notifications that carry no key", () => {
    const existing = [{ key: undefined }, { key: "runway-low" }];
    expect(pickNewAlerts(existing, [overdue, runway])).toEqual([overdue]);
  });
});
