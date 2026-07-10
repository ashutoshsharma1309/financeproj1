import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema, forgotSchema } from "./validators";

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "secret1" });
    expect(r.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const r = loginSchema.safeParse({ email: "nope", password: "secret1" });
    expect(r.success).toBe(false);
  });

  it("rejects a password shorter than 6 characters", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "12345" });
    expect(r.success).toBe(false);
  });
});

describe("signupSchema", () => {
  const valid = {
    name: "Ada",
    email: "ada@example.com",
    password: "longenough",
    confirm: "longenough",
  };

  it("accepts a well-formed signup", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects when passwords do not match, flagged on confirm", () => {
    const r = signupSchema.safeParse({ ...valid, confirm: "different" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.includes("confirm"))).toBe(true);
    }
  });

  it("rejects a password under 8 characters", () => {
    const r = signupSchema.safeParse({ ...valid, password: "short", confirm: "short" });
    expect(r.success).toBe(false);
  });
});

describe("forgotSchema", () => {
  it("requires a valid email", () => {
    expect(forgotSchema.safeParse({ email: "x@y.com" }).success).toBe(true);
    expect(forgotSchema.safeParse({ email: "x" }).success).toBe(false);
  });
});
