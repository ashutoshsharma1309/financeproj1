import { describe, it, expect } from "vitest";
import { can } from "./security";

describe("RBAC permission matrix", () => {
  it("grants owners full access", () => {
    expect(can("OWNER", "manage:company")).toBe(true);
    expect(can("OWNER", "manage:team")).toBe(true);
    expect(can("OWNER", "view:audit")).toBe(true);
  });

  it("limits accountants to finance and reports", () => {
    expect(can("ACCOUNTANT", "manage:transactions")).toBe(true);
    expect(can("ACCOUNTANT", "view:reports")).toBe(true);
    expect(can("ACCOUNTANT", "manage:team")).toBe(false);
    expect(can("ACCOUNTANT", "manage:company")).toBe(false);
  });

  it("restricts employees to viewing", () => {
    expect(can("EMPLOYEE", "view:dashboard")).toBe(true);
    expect(can("EMPLOYEE", "view:reports")).toBe(true);
    expect(can("EMPLOYEE", "manage:transactions")).toBe(false);
    expect(can("EMPLOYEE", "use:ai")).toBe(false);
  });

  it("denies everything when the role is undefined", () => {
    expect(can(undefined, "view:dashboard")).toBe(false);
  });
});
