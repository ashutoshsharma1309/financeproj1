# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in AI CFO, please report it
responsibly. **Do not** open a public issue.

Instead, email a description of the issue and steps to reproduce to
`security@aicfo.app`. We aim to acknowledge reports within 72 hours and will
keep you updated on remediation progress.

## Scope

The application is architected around these controls:

- **Authentication** — JWT/session boundary (`src/lib/auth.ts`).
- **Authorization** — role-based access control (`src/lib/security.ts`).
- **Input validation** — Zod schemas for every form (`src/lib/validators.ts`)
  plus sanitization helpers.
- **Rate limiting** — applied to the AI API route.
- **Audit logging** — every create/update/delete is recorded.

Secrets are provided via environment variables and are never committed; see
[`.env.example`](./.env.example).

## Supported versions

The `main` branch receives security fixes.
