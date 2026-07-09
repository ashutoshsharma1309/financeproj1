# 0012 — Design tokens as CSS variables

- **Status:** Accepted
- **Date:** 2026-07-09

## Context

The product supports light, dark, and system themes with persistence, and wants
a distinct "financial terminal" identity rather than a templated look. Charts,
which are drawn by Recharts in JS, must match the same palette as the CSS-styled
UI in both themes.

## Decision

Define the palette and surface tokens as CSS custom properties in
`globals.css`, switched by theme via `next-themes`. Tailwind maps to those
variables, and the chart wrappers read the same CSS variables at runtime so
JS-drawn charts and CSS-drawn UI never diverge. Display/body/mono typography is
loaded through `next/font/google` (Space Grotesk, Inter, JetBrains Mono).

## Consequences

- One source of truth for color; theme switching is instant and consistent,
  including inside charts.
- Numerals use a tabular-figure mono (`.tnum`) so financial figures align in
  columns.
- Components must read tokens, not hard-coded hex, to stay theme-correct — the
  dead `CHART_ACCENTS`/`ACCENT` constants were removed for violating this.
