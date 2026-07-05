# AI CFO

**Your AI-powered Chief Financial Officer for Small & Medium Businesses.**

A production-grade SaaS application for managing revenue, expenses, invoices,
cash flow and forecasts — with an AI assistant that analyzes **only your own
data**. No fake analytics, no hardcoded metrics, no placeholder business data.
Every figure is computed from what you enter; empty modules show elegant empty
states.

---

## ✨ Highlights

- **Real data only** — all totals, charts, forecasts and AI answers are derived
  from user-entered data. If there's no data, you get a beautiful empty state.
- **Soft UI / Claymorphism** design with full **Light / Dark / System** theming
  and persistence.
- **Complete finance suite** — Transactions, Revenue, Expenses, Invoices (with
  line items, tax & PDF export), Cash Flow & runway, Forecasting, Reports
  (P&L / breakdowns, PDF + CSV export).
- **AI CFO assistant** — grounded strictly in your numbers. Works offline with a
  deterministic analyzer; plug in a Gemini key for full generative answers.
- **Auth & RBAC** — signup/login/forgot-password flows with Owner / Accountant /
  Employee roles gating navigation and actions.
- **Audit logs, notifications, team management** and a full marketing site.
- Fully **responsive**, **accessible**, animated, and **type-safe**.

## 🧱 Tech Stack

| Concern     | Choice                                       |
| ----------- | -------------------------------------------- |
| Framework   | Next.js 14 (App Router) + TypeScript         |
| Styling     | Tailwind CSS + custom design tokens          |
| State       | Zustand (+ persist → localStorage)           |
| Charts      | Recharts (theme-aware)                       |
| Animation   | Framer Motion + CSS                          |
| Validation  | Zod                                          |
| Icons       | lucide-react                                 |
| AI          | Google Gemini (REST) with offline fallback   |
| DB schema   | Prisma (models only — connection left empty) |

## 🚀 Getting Started

```bash
npm install
cp .env.example .env      # fill values when ready (all optional for local use)
npm run dev               # http://localhost:3000
```

Build & run production:

```bash
npm run build && npm run start
```

> The app is fully functional out of the box. Data is persisted in the browser
> so every calculation and CRUD action works without a backend. The Prisma
> schema, Gemini client, auth store and security matrix are structured so a real
> database and API can be added without architectural changes.

## 🔐 Environment Variables

All are optional for local/hackathon use and left empty in `.env.example`:

```
DATABASE_URL=            # Postgres connection for Prisma
GEMINI_API_KEY=          # enables full generative AI answers
JWT_SECRET=              # production auth
NEXTAUTH_SECRET=
SMTP_HOST= / SMTP_USER= / SMTP_PASS=   # verification & password-reset emails
```

Without `GEMINI_API_KEY`, the assistant answers using a deterministic analyzer
that reasons over the same financial context — so it never fabricates figures.

## 📁 Structure

```
prisma/schema.prisma          Data models (Users, Companies, Transactions, …)
src/app/(marketing)           Landing, features, pricing, about, contact
src/app/(auth)                Login, signup, forgot password
src/app/(app)                 Authenticated app (dashboard + all modules)
src/app/api/ai/chat           AI endpoint (Gemini + offline fallback, rate-limited)
src/components/ui             Design-system primitives
src/components/charts         Theme-aware chart wrappers
src/components/dashboard      Sidebar, topbar, onboarding, shell
src/lib/store.ts              Global finance store (CRUD + audit logging)
src/lib/calculations.ts       Pure calculation engine (all derived metrics)
src/lib/ai/                   Financial context builder, prompts, Gemini client
src/lib/security.ts           RBAC permission matrix
src/lib/validators.ts         Zod schemas for every form
```

## 🧮 How calculations work

`src/lib/calculations.ts` contains pure functions that transform your entries
into every metric shown in the UI — totals, month-over-month deltas, category
breakdowns, cash position, runway, forecasts and P&L. Nothing is hardcoded;
empty inputs return zeroed results and the UI renders empty states.

## 🛡️ Security architecture

JWT/session boundary (`src/lib/auth.ts`), RBAC permission matrix
(`src/lib/security.ts`), input validation & sanitization
(`src/lib/validators.ts`), rate limiting on the AI route, and an audit trail for
every create/update/delete. The client-side auth store mirrors a real backend's
shape so it can be swapped for API calls with no UI changes.
