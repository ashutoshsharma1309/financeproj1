# 0010 — Ground AI strictly on FinancialContext, with a local fallback

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

An AI "CFO" that hallucinates numbers would violate the project's core principle
([0004](0004-never-fabricate-financial-data.md)) in the most damaging way. The
app also has to be useful with `GEMINI_API_KEY` empty, and must not leak the
user's financial data carelessly or accept unbounded request volume.

## Decision

Build a `FinancialContext` from the user's real data (`src/lib/ai/context.ts`)
and instruct the model, via a strict system prompt, to reason only over that
context and never invent figures. The `/api/ai/chat` route (Node runtime) calls
Gemini when a key is present, and otherwise falls back to a deterministic
`localAnalysis` computed from the same context. A per-IP in-memory rate limit
(20 requests / 60 s) guards the endpoint.

## Consequences

- The assistant is useful out of the box with no API key, and never fabricates
  figures because both paths draw from the same real context.
- Only derived context — not raw records beyond what's needed — is sent upstream.
- The rate limit is per-process and in-memory; adequate for a single instance,
  and a real deployment would move it to shared storage.
