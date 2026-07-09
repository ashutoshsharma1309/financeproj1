# 0001 — Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

AI CFO is developed in small, resumable, PR-sized units — often across sessions
where the person (or agent) picking up the work has no memory of earlier
reasoning. The narrative docs under `docs/` explain *how* the system works, but
not *why* a particular trade-off was chosen over the alternatives. That "why"
tends to evaporate, and gets re-litigated.

## Decision

Keep a log of Architecture Decision Records under `docs/adr/`, one file per
decision, using a lightweight MADR-style template. Records are immutable once
accepted; a reversal is a new record that supersedes the old one.

## Consequences

- Future contributors can read the reasoning trail instead of guessing.
- Each significant decision has a stable anchor others can cite.
- Small ongoing cost: a genuine architectural decision should come with an ADR.
- ADRs complement — they don't replace — the how-to guides in `docs/`.
