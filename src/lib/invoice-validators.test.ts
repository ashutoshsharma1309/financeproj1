import { describe, it, expect } from "vitest";
import { invoiceItemSchema, invoiceSchema, forecastSchema } from "./validators";

const validItem = { description: "Design", quantity: 1, unitPrice: 100 };

describe("invoiceItemSchema", () => {
  it("accepts a valid line item", () => {
    expect(invoiceItemSchema.safeParse(validItem).success).toBe(true);
  });
  it("requires quantity greater than zero", () => {
    expect(invoiceItemSchema.safeParse({ ...validItem, quantity: 0 }).success).toBe(false);
  });
  it("allows a zero unit price but not negative", () => {
    expect(invoiceItemSchema.safeParse({ ...validItem, unitPrice: 0 }).success).toBe(true);
    expect(invoiceItemSchema.safeParse({ ...validItem, unitPrice: -1 }).success).toBe(false);
  });
});

const validInvoice = {
  number: "INV-1",
  clientName: "Acme",
  issueDate: "2026-01-01",
  dueDate: "2026-02-01",
  status: "DRAFT" as const,
  taxRate: 18,
  items: [validItem],
};

describe("invoiceSchema", () => {
  it("accepts a valid invoice", () => {
    expect(invoiceSchema.safeParse(validInvoice).success).toBe(true);
  });

  it("requires at least one line item", () => {
    expect(invoiceSchema.safeParse({ ...validInvoice, items: [] }).success).toBe(false);
  });

  it("allows an empty client email but rejects a malformed one", () => {
    expect(invoiceSchema.safeParse({ ...validInvoice, clientEmail: "" }).success).toBe(true);
    expect(invoiceSchema.safeParse({ ...validInvoice, clientEmail: "bad" }).success).toBe(false);
  });

  it("bounds the tax rate to 0–100", () => {
    expect(invoiceSchema.safeParse({ ...validInvoice, taxRate: 150 }).success).toBe(false);
    expect(invoiceSchema.safeParse({ ...validInvoice, taxRate: -1 }).success).toBe(false);
  });
});

describe("forecastSchema", () => {
  const base = { name: "Base", horizon: 12, revenueGrowth: 5, expenseGrowth: 3, startingCash: 1000 };
  it("accepts a valid forecast", () => {
    expect(forecastSchema.safeParse(base).success).toBe(true);
  });
  it("bounds the horizon to 1–36 months", () => {
    expect(forecastSchema.safeParse({ ...base, horizon: 0 }).success).toBe(false);
    expect(forecastSchema.safeParse({ ...base, horizon: 48 }).success).toBe(false);
  });
});
