import { describe, it, expect } from "vitest";
import {
  cn,
  formatCompact,
  formatDate,
  monthLabel,
  uid,
  sanitize,
} from "./utils";

describe("cn", () => {
  it("joins truthy class names and drops falsy ones", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
  it("resolves conflicting Tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("formatCompact", () => {
  it("abbreviates large numbers", () => {
    const out = formatCompact(1_500_000, "USD");
    expect(out).toMatch(/1\.5\s*M/i);
  });
});

describe("formatDate", () => {
  it("formats an ISO date into a readable string", () => {
    const out = formatDate("2026-01-15");
    expect(out).toContain("2026");
    expect(typeof out).toBe("string");
  });
});

describe("monthLabel", () => {
  it("turns a YYYY-MM key into a labelled month", () => {
    const out = monthLabel("2026-01");
    expect(out).toMatch(/Jan/);
  });
});

describe("uid", () => {
  it("prefixes the id", () => {
    expect(uid("inv").startsWith("inv_")).toBe(true);
  });
  it("produces varying ids across many calls", () => {
    const ids = new Set(Array.from({ length: 50 }, () => uid("x")));
    expect(ids.size).toBeGreaterThan(1);
  });
});

describe("sanitize", () => {
  it("strips angle brackets and trims", () => {
    expect(sanitize("  <script>  ")).toBe("script");
    expect(sanitize("a<b>c")).toBe("abc");
  });
});
