# Invoices

Create invoices, track what's paid, and see exactly what you're owed from the
Invoices module (`/invoices`).

## Creating an invoice

Click **New invoice** and set the number, client, issue and due dates, tax rate
and line items (description, quantity, unit price). The subtotal, tax and total
update live as you type.

## Statuses

`DRAFT`, `SENT`, `PAID`, `OVERDUE`, `CANCELLED`. A `SENT` invoice past its due
date is shown as **OVERDUE** automatically (see `effectiveInvoiceStatus`).

## Totals

- **Subtotal** = sum of quantity × unit price
- **Tax** = subtotal × tax rate
- **Total** = subtotal + tax

## Summary cards

Paid, outstanding, overdue amounts and the number of drafts, from
`invoiceStats`.

## Export

View any invoice and click **Download PDF** for a print-ready document.
