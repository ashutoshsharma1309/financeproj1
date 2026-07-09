# Exports

AI CFO exports your data as CSV and print-ready PDF. All exports contain only
your own data.

## CSV

Available on the Transactions, Revenue, Expenses, Reports and Audit Logs
modules. Click **Export** to download a `.csv` with the relevant columns. Values
are escaped safely (`src/lib/export.ts`, `exportToCSV`).

## PDF

- **Invoices** — open an invoice and click **Download PDF** for a client-ready
  document with line items, tax and total.
- **Reports** — export a profit & loss statement with KPIs and category tables.

PDFs are rendered in a new window with print-optimized styling and the browser's
print dialog (`exportToPDF`), so you can save as PDF on any platform.

## Notes

- Exports reflect the current filters/period at the time of export.
- No network round-trip is involved — files are generated in the browser.
