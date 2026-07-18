import { describe, it, expect } from "vitest";
import { matchHelp, HELP_SUGGESTIONS } from "./help";

describe("matchHelp", () => {
  it("routes an invoice how-to to the invoices topic", () => {
    const t = matchHelp("how do I create an invoice?");
    expect(t?.href).toBe("/invoices");
    expect(t?.answer.toLowerCase()).toContain("invoice");
  });

  it("routes a revenue question to the revenue topic", () => {
    expect(matchHelp("where do I add revenue")?.href).toBe("/revenue");
  });

  it("routes runway/cash questions to cash flow", () => {
    expect(matchHelp("where can I see my runway?")?.href).toBe("/cash-flow");
  });

  it("answers the no-fake-data question without a link", () => {
    const t = matchHelp("is the data real or fake?");
    expect(t).toBeTruthy();
    expect(t?.answer.toLowerCase()).toContain("only from data");
  });

  it("returns null for an unrelated question", () => {
    expect(matchHelp("qwerty zxcv")).toBeNull();
  });

  it("prefers the more specific (multi-word) match", () => {
    // "add expense" (2-word keyword) should beat a stray single-word hit.
    expect(matchHelp("how do I add expense entries")?.href).toBe("/expenses");
  });

  it("ships a non-empty suggestion list", () => {
    expect(HELP_SUGGESTIONS.length).toBeGreaterThan(0);
  });
});
