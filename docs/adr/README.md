# Architecture Decision Records

This directory captures the **why** behind AI CFO's architecture — the decisions
that aren't obvious from reading the code, and the trade-offs they carry.

Each record is immutable once accepted: if a decision is reversed, we add a new
ADR that supersedes the old one rather than editing history. This keeps the
reasoning trail honest for future contributors (human or autonomous).

Format is a lightweight [MADR](https://adr.github.io/madr/)-style template — see
[`0000-template.md`](0000-template.md).

## Index

| #    | Decision                                                             | Status   |
| ---- | ------------------------------------------------------------------- | -------- |
| 0001 | [Record architecture decisions](0001-record-architecture-decisions.md) | Accepted |
| 0002 | [Next.js App Router with route groups](0002-app-router-route-groups.md) | Accepted |
| 0003 | [Client-side Zustand store with persistence](0003-client-side-zustand-store.md) | Accepted |
| 0004 | [Never fabricate financial data](0004-never-fabricate-financial-data.md) | Accepted |
| 0005 | [Pure functional calculation engine](0005-pure-calculation-engine.md) | Accepted |
| 0006 | [Date-aware effective invoice status](0006-effective-invoice-status.md) | Accepted |
| 0007 | [Condition-keyed derived notifications](0007-condition-keyed-notifications.md) | Accepted |
| 0008 | [Code-split charts with next/dynamic](0008-code-split-charts.md)     | Accepted |
| 0009 | [Schema-only Prisma scaffolding](0009-schema-only-prisma.md)         | Accepted |
| 0010 | [Ground AI strictly on FinancialContext](0010-ai-grounding-local-fallback.md) | Accepted |
| 0011 | [Client-side auth stand-in with RBAC](0011-client-auth-rbac.md)      | Accepted |
| 0012 | [Design tokens as CSS variables](0012-css-variable-design-tokens.md) | Accepted |
| 0013 | [Zustand v5 selector discipline](0013-zustand-selector-discipline.md) | Accepted |
| 0014 | [Vitest for pure-logic unit tests](0014-vitest-unit-testing.md)      | Accepted |
