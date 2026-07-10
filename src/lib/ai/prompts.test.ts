import { describe, it, expect } from "vitest";
import { SYSTEM_PROMPT, SUGGESTED_PROMPTS, buildUserPrompt } from "./prompts";

describe("SYSTEM_PROMPT", () => {
  it("forbids fabricating figures", () => {
    expect(SYSTEM_PROMPT).toMatch(/never invent|fabricate/i);
    expect(SYSTEM_PROMPT).toMatch(/only use the numbers provided/i);
  });
});

describe("SUGGESTED_PROMPTS", () => {
  it("offers a non-empty list of starter questions", () => {
    expect(Array.isArray(SUGGESTED_PROMPTS)).toBe(true);
    expect(SUGGESTED_PROMPTS.length).toBeGreaterThan(0);
    expect(SUGGESTED_PROMPTS.every((p) => typeof p === "string" && p.length > 0)).toBe(true);
  });
});

describe("buildUserPrompt", () => {
  it("embeds the serialized context and the question", () => {
    const out = buildUserPrompt("What is my runway?", { cashPosition: 1000 });
    expect(out).toContain("FINANCIAL CONTEXT");
    expect(out).toContain("cashPosition");
    expect(out).toContain("What is my runway?");
  });
});
