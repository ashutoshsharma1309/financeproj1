# Auth & roles

## Flows

- **Sign up** — the first account becomes the company **Owner**.
- **Log in** — email and password.
- **Forgot password** — request a reset link (SMTP-ready structure).

In this build, auth state is held in a persisted client store (`src/lib/auth.ts`)
that mirrors a real JWT backend's shape, so it can be swapped for API calls
without UI changes.

## Roles

| Role | Access |
| --- | --- |
| **Owner** | Full access to finances, team and settings |
| **Accountant** | Manage transactions, invoices and reports |
| **Employee** | View dashboards and reports only |

## Enforcement

The permission matrix lives in `src/lib/security.ts`. The `can(role, permission)`
helper gates navigation items and actions in the UI, and is designed to gate API
routes server-side once a backend is wired up.

## Permissions

`view:dashboard`, `manage:transactions`, `manage:invoices`, `manage:company`,
`manage:team`, `view:reports`, `view:audit`, `use:ai`.
