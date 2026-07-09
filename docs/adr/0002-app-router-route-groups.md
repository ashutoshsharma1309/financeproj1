# 0002 — Next.js App Router with route groups

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

The app has three audiences with different chrome: public marketing pages, the
auth flow (login / signup / reset), and the authenticated product. Each needs a
different layout, and the product area needs an auth + onboarding gate that the
other two must not inherit.

## Decision

Use the Next.js App Router with three route groups — `(marketing)`, `(auth)`,
and `(app)` — under `src/app/`. Route groups let each cluster own its own
`layout.tsx` without leaking a URL segment. The `(app)` group's layout wraps
everything in `DashboardShell`, which enforces the auth/onboarding gate once.

## Consequences

- Layout, gating, and navigation concerns are colocated with the routes they
  serve; no per-page boilerplate.
- The authenticated shell (sidebar, topbar, notification sync) mounts exactly
  once for every product page.
- App Router pushes us toward Server Components by default, but most product
  pages are `"use client"` because they read the client-side Zustand store —
  a deliberate trade documented in [0003](0003-client-side-zustand-store.md).
