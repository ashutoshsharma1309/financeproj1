# Data model

The Prisma schema (`prisma/schema.prisma`) defines the models only — the
datasource URL is read from `DATABASE_URL` and left empty for local use.

## Entities

- **User** — belongs to a Company; has a `Role` (OWNER / ACCOUNTANT / EMPLOYEE).
- **Company** — the workspace; owns all financial records and settings.
- **Category** — INCOME or EXPENSE classification with a color.
- **Account** — CASH / BANK / CREDIT / ASSET / LIABILITY with a balance.
- **Transaction** — a single INCOME or EXPENSE entry.
- **Revenue** / **Expense** — dedicated income and spend records by source/vendor.
- **Invoice** + **InvoiceItem** — line-item invoices with tax and status.
- **CashFlow** — periodic inflow/outflow snapshots.
- **Forecast** — a scenario with assumptions and a projected result.
- **Report** — a saved P&L / cash-flow / breakdown for a period.
- **AIChat** — assistant conversations.
- **Notification** / **AuditLog** / **Settings** — workspace support tables.

## Relationships

Everything hangs off `Company`. `User.companyId` links people to a workspace;
financial records reference `companyId` and optionally a `categoryId` or
`accountId`. Deleting a company cascades to its records.

## Client-side shape

The browser store mirrors these models as TypeScript types in `src/lib/types.ts`
so the transition to a persisted database is mechanical.
