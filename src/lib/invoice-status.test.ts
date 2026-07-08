import { describe, it, expect } from "vitest";
import { effectiveInvoiceStatus } from "./calculations";
import type { Invoice } from "./types";

function invoice(overrides: Partial<Invoice>): Invoice {
  return {
    id: "i",
    number: "INV-1",
    clientName: "Acme",
    issueDate: "2026-01-01",
    dueDate: "2026-02-01",
    status: "SENT",
    taxRate: 0,
    items: [{ id: "x", description: "Work", quantity: 1, unitPrice: 100 }],
    createdAt: "2026-01-01",
    ...overrides,
  };
}

describe("effectiveInvoiceStatus", () => {
  it("marks a SENT invoice past its due date as OVERDUE", () => {
    expect(effectiveInvoiceStatus(invoice({ status: "SENT", dueDate: "2000-01-01" }))).toBe("OVERDUE");
  });

  it("keeps a SENT invoice not yet due as SENT", () => {
    expect(effectiveInvoiceStatus(invoice({ status: "SENT", dueDate: "2999-01-01" }))).toBe("SENT");
  });

  it("never overrides a PAID invoice", () => {
    expect(effectiveInvoiceStatus(invoice({ status: "PAID", dueDate: "2000-01-01" }))).toBe("PAID");
  });

  it("leaves DRAFT untouched", () => {
    expect(effectiveInvoiceStatus(invoice({ status: "DRAFT", dueDate: "2000-01-01" }))).toBe("DRAFT");
  });
});
