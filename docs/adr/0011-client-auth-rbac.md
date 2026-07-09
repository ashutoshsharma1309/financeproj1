# 0011 — Client-side auth stand-in with an RBAC matrix

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

The product demonstrates role-based access (Owner / Accountant / Employee) and a
sign-in flow, but has no server or database ([0009](0009-schema-only-prisma.md)).
It must model roles and permissions honestly without pretending to offer real
security.

## Decision

Implement auth as a client-side store (`src/lib/auth.ts`, persisted under
`aicfo-auth`): the first registered user becomes `OWNER`, subsequent users
`EMPLOYEE`. Passwords run through a non-cryptographic `weakHash` — explicitly a
placeholder. Authorization is a single permission matrix in `src/lib/security.ts`
with a `can(role, permission)` check the UI consults.

## Consequences

- Roles and permission-gated UI are demonstrable today, driven by one matrix
  that's trivially unit-tested (`security.test.ts`).
- This is **not** real security: `weakHash` and client-side checks are a stand-in
  and are named as such. Real hashing (argon2/bcrypt), sessions/JWT, and
  server-side enforcement are part of the blocked backend milestone
  ([M5](../roadmap.md)).
- Centralizing permissions now means the server-side check later has one
  authoritative definition to mirror.
