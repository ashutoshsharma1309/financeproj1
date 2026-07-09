# 0003 — Client-side Zustand store with persistence

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

The product ships without a live database connection (`DATABASE_URL` is empty by
design — see [0009](0009-schema-only-prisma.md)). It still needs to feel like a
real, stateful application: entries persist across reloads, the dashboard
recomputes, and the AI reasons over the user's own numbers.

## Decision

Hold all business state in a single Zustand store (`src/lib/store.ts`) with the
`persist` middleware writing to `localStorage` under the key `aicfo-data`. Auth
and theme live in their own persisted stores (`aicfo-auth`, `aicfo-theme`). All
mutations flow through store actions, which also append to a capped audit log.

## Consequences

- The app is fully functional with zero backend — ideal for a demo, and an
  honest foundation because every number is the user's real input.
- State is per-browser and unencrypted; this is a stand-in, not production
  persistence. Migrating to a real backend is [M5](../roadmap.md), deliberately
  blocked on credentials and a product decision.
- Reading the store forces components to be client components.
- Zustand v5 selectors need discipline to avoid render loops — see
  [0013](0013-zustand-selector-discipline.md).
