import { describe, it, expect } from "vitest";
import { categoryBreakdown } from "./calculations";
import type { DatedAmount } from "./calculations";
import type { Category } from "./types";

const categories: Category[] = [
  { id: "c1", name: "Payroll", kind: "EXPENSE", color: "#f00" },
  { id: "c2", name: "Cloud", kind: "EXPENSE", color: "#0f0" },
];

const stream: DatedAmount[] = [
  { amount: 75000, date: "2026-01-01", categoryId: "c1", label: "Sales" },
  { amount: 25000, date: "2026-01-02", categoryId: "c2", label: "Services" },
];

describe("categoryBreakdown", () => {
  it("aggregates amounts per category", () => {
    const result = categoryBreakdown(stream, categories);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Payroll");
    expect(result[0].value).toBe(75000);
  });

  it("computes each category's share of the total", () => {
    const result = categoryBreakdown(stream, categories);
    expect(result[0].share).toBeCloseTo(75);
    expect(result[1].share).toBeCloseTo(25);
  });

  it("sorts slices by value descending", () => {
    const result = categoryBreakdown(stream, categories);
    expect(result[0].value).toBeGreaterThanOrEqual(result[1].value);
  });

  it("labels uncategorized amounts", () => {
    const result = categoryBreakdown(
      [{ amount: 500, date: "2026-01-01", label: "Misc" }],
      categories,
    );
    expect(result[0].name).toBe("Uncategorized");
  });
});
