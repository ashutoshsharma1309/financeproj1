# Roadmap

This roadmap is indicative and will evolve. Nothing here changes the core
promise: every figure is derived from your own data.

## Now

- Revenue, expenses, transactions, invoices, cash flow, forecasting and reports
- AI assistant grounded in your data (Gemini + offline fallback)
- Light/dark theming, exports, roles and audit logging

## Next

- [ ] Persist to a database behind `DATABASE_URL` (Prisma models are ready)
- [ ] Real authentication (JWT verification and email verification)
- [ ] Recurring transactions and invoice reminders — overdue invoices already
      surface as in-app [notifications](./docs/NOTIFICATIONS.md); email reminders
      are the remaining piece
- [ ] Multi-company workspaces
- [ ] Bank/CSV import for faster data entry

## Later

- [ ] Budget vs. actuals tracking
- [ ] Scheduled report emails
- [ ] Deeper AI scenarios ("what-if" saved simulations)
- [ ] Mobile app shell (the PWA manifest is already in place)

Have an idea? Open a [feature request](./.github/ISSUE_TEMPLATE/feature_request.md).
