# 0009 — Schema-only Prisma scaffolding

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

The product needs to demonstrate a credible path to a real backend — a data
model, roles, an audit trail — without actually provisioning a database, holding
secrets, or making the legal/product commitments that real persistence implies.

## Decision

Include a complete Prisma schema (`prisma/schema.prisma`, `postgresql` provider)
with `DATABASE_URL` left empty, and keep `@prisma/client` as a dependency wired
to a `postinstall: prisma generate || true` step. No API route or store code
imports the client yet; the live app runs entirely on the client-side store
([0003](0003-client-side-zustand-store.md)).

## Consequences

- The intended production shape is legible from the schema, and the client
  generates cleanly, so wiring a real backend is incremental rather than a
  rewrite.
- `@prisma/client` shows zero `src/` imports; this is intentional scaffolding,
  not dead code, and dependency audits must not remove it.
- Actually connecting a database, auth, and server-side RBAC is
  [M5](../roadmap.md) — deliberately **blocked** on credentials and a product/
  legal decision, which is an explicit human-escalation point.
