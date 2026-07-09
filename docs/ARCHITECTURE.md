# Architecture

AI CFO is a Next.js 14 (App Router) application. The UI is fully functional
against browser-persisted state today, and the data/API layer is shaped so a
real backend can be added without touching the UI.

## Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Routing / pages | `src/app` | Marketing, auth and authenticated app routes |
| UI primitives | `src/components/ui` | Buttons, inputs, dialogs, cards, tables |
| Feature components | `src/components/*` | Dashboard shell, charts, marketing, assistant |
| State | `src/lib/store.ts`, `src/lib/auth.ts` | Zustand stores persisted to `localStorage` |
| Domain logic | `src/lib/calculations.ts` | Pure functions for every derived metric |
| Validation | `src/lib/validators.ts` | Zod schemas for every form |
| Security | `src/lib/security.ts` | RBAC permission matrix |
| AI | `src/lib/ai/*`, `src/app/api/ai/chat` | Context builder + Gemini route with fallback |
| Data model | `prisma/schema.prisma` | Models only; connection intentionally empty |

## Route groups

- `(marketing)` — public landing, features, pricing, about, contact.
- `(auth)` — login, signup, forgot password.
- `(app)` — authenticated shell gating on hydration, auth and onboarding.

## Data flow

User input → validated by Zod → written to the Zustand store → persisted to
`localStorage` → read by pages → transformed by pure functions in
`calculations.ts` → rendered as stats, charts and reports. No value is
hardcoded; empty input yields zeroed results and empty states.

## Swapping in a backend

Replace the store actions with API calls and mount the Prisma client behind
`DATABASE_URL`. The permission matrix in `security.ts` is designed to gate API
routes server-side too. The AI route already runs on the server.

## Why these choices

The reasoning behind the non-obvious decisions above — client-side state, the
pure calculation engine, schema-only Prisma, AI grounding, and more — is recorded
in the [Architecture Decision Records](./adr/README.md).
