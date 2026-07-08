# FAQ

**Where do the numbers come from?**
Only from what you enter. AI CFO never generates sample data or placeholder
analytics. Before you add data, modules show empty states — not invented figures.

**Is my data stored anywhere?**
In this build it's persisted in your browser via `localStorage`, so the app works
instantly with no backend. The Prisma schema and API layer are ready for a real
database.

**How do I enable full AI answers?**
Set `GEMINI_API_KEY` in your environment. Without it, the assistant still answers
using deterministic analysis of your data.

**What can each role do?**
Owners have full access; Accountants manage finances and reports; Employees have
view-only access to dashboards and reports.

**Can I export my data?**
Yes — most tables export to CSV, and reports and invoices export to PDF.

**Which currencies are supported?**
INR, USD, EUR, GBP, AED, SGD, AUD and CAD. Every figure formats to the company
currency you choose.

**Does it work on mobile?**
Yes — the UI is responsive across desktop, tablet and mobile, with a collapsible
sidebar.
