// ─────────────────────────────────────────────────────────────
// Security boundary & RBAC helpers.
//
// The UI enforces role-based access with these helpers. On the server,
// the same matrix should gate API routes once the backend is wired up
// (JWT verification → role → permission check). Rate limiting lives in
// the route handlers; input validation lives in src/lib/validators.ts.
// ─────────────────────────────────────────────────────────────

import type { Role } from "./types";

export type Permission =
  | "view:dashboard"
  | "manage:transactions"
  | "manage:invoices"
  | "manage:company"
  | "manage:team"
  | "view:reports"
  | "view:audit"
  | "use:ai";

const MATRIX: Record<Role, Permission[]> = {
  OWNER: [
    "view:dashboard",
    "manage:transactions",
    "manage:invoices",
    "manage:company",
    "manage:team",
    "view:reports",
    "view:audit",
    "use:ai",
  ],
  ACCOUNTANT: [
    "view:dashboard",
    "manage:transactions",
    "manage:invoices",
    "view:reports",
    "use:ai",
  ],
  EMPLOYEE: ["view:dashboard", "view:reports"],
};

export function can(role: Role | undefined, permission: Permission) {
  if (!role) return false;
  return MATRIX[role].includes(permission);
}

export const ROLE_LABELS: Record<Role, string> = {
  OWNER: "Owner",
  ACCOUNTANT: "Accountant",
  EMPLOYEE: "Employee",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  OWNER: "Full access to finances, team, and settings.",
  ACCOUNTANT: "Manage transactions, invoices and reports.",
  EMPLOYEE: "View dashboards and reports only.",
};
