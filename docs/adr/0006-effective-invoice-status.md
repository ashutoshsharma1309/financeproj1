# 0006 — Date-aware effective invoice status

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

An invoice stores a `status` field (`DRAFT | SENT | PAID | OVERDUE`). But an
invoice marked `SENT` whose `dueDate` has passed is, in reality, overdue —
whether or not anyone edited the field. The invoices table and status badges
already reflected this by computing a display status, while `invoiceStats`
bucketed by the raw stored field. The result: the Overdue KPI understated
reality and disagreed with the badge shown on the same screen.

## Decision

Define one function, `effectiveInvoiceStatus(invoice)`, that promotes a `SENT`
invoice past its `dueDate` to `OVERDUE`, and route every consumer through it —
including `invoiceStats`. Outstanding continues to include overdue, because the
money is still owed.

## Consequences

- KPI cards, the invoices table, the AI context, and the notifications alert now
  agree on what "overdue" means.
- The rule is date-aware and centralized; changing it means editing one place.
- This aligns the truth model with what was already displayed — it does not
  redefine a financial rule, so it needed no human sign-off.
- Covered by unit tests (`invoice-status.test.ts`, plus the overdue cases in the
  notification and calc suites).
