import { describe, it, expect } from "vitest";
import { signupSchema, invoiceSchema, fieldErrors } from "./validators";

describe("fieldErrors", () => {
  it("flattens a ZodError into a { field: message } map", () => {
    const r = signupSchema.safeParse({
      name: "A",
      email: "bad",
      password: "short",
      confirm: "nope",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrors(r.error);
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
      expect(typeof errors.email).toBe("string");
    }
  });

  it("keeps the first message per field", () => {
    const r = invoiceSchema.safeParse({
      number: "",
      clientName: "",
      issueDate: "",
      dueDate: "",
      status: "DRAFT",
      taxRate: 0,
      items: [],
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrors(r.error);
      // Nested paths join with a dot; top-level fields stay flat.
      expect(errors.number).toBeDefined();
      expect(Object.values(errors).every((m) => typeof m === "string")).toBe(true);
    }
  });

  it("returns an empty map when there are no issues to flatten", () => {
    const r = signupSchema.safeParse({
      name: "Ada",
      email: "ada@x.com",
      password: "longenough",
      confirm: "longenough",
    });
    expect(r.success).toBe(true);
  });
});
