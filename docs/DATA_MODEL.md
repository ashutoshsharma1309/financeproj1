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

## Derived vs. stored

Not everything the UI shows is stored — much is derived on read. Two notable
cases the client models explicitly:

- **Notification** carries an optional `key` (e.g. `invoices-overdue`,
  `runway-low`): a stable *condition* identifier used to de-duplicate alerts that
  are derived from data rather than authored by hand. See
  [Notifications](./NOTIFICATIONS.md).
- **Invoice** has a stored `status`, but consumers use the date-aware
  *effective* status so a past-due `SENT` invoice reads as overdue everywhere.
  See [ADR 0006](./adr/0006-effective-invoice-status.md).

## Relationships

Everything hangs off `Company`. `User.companyId` links people to a workspace;
financial records reference `companyId` and optionally a `categoryId` or
`accountId`. Deleting a company cascades to its records.

## Client-side shape

The browser store mirrors these models as TypeScript types in `src/lib/types.ts`
so the transition to a persisted database is mechanical.
