import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatPercent,
  pctChange,
  sumBy,
  clamp,
  monthKey,
} from "./utils";

describe("formatCurrency", () => {
  it("formats USD with no fraction digits", () => {
    expect(formatCurrency(1000, "USD")).toBe("$1,000");
  });
  it("guards against non-finite values", () => {
    expect(formatCurrency(Number.NaN, "USD")).toBe("$0");
  });
});

describe("formatPercent", () => {
  it("prefixes positive values with a plus sign", () => {
    expect(formatPercent(5)).toBe("+5.0%");
  });
  it("keeps the minus sign on negatives", () => {
    expect(formatPercent(-3)).toBe("-3.0%");
  });
});

describe("pctChange", () => {
  it("computes a percentage delta", () => {
    expect(pctChange(150, 100)).toBe(50);
  });
  it("returns 0 when both are zero", () => {
    expect(pctChange(0, 0)).toBe(0);
  });
  it("returns 100 when growing from zero", () => {
    expect(pctChange(10, 0)).toBe(100);
  });
});

describe("sumBy / clamp / monthKey", () => {
  it("sums a numeric field", () => {
    expect(sumBy([{ a: 1 }, { a: 2 }, { a: 3 }], (x) => x.a)).toBe(6);
  });
  it("clamps to a range", () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
  it("derives a YYYY-MM key", () => {
    expect(monthKey("2026-03-15")).toBe("2026-03");
  });
});
