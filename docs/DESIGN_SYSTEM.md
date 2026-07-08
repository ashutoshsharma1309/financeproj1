# Design system

AI CFO uses a "financial terminal, humanized" visual language: dark-first,
precise, with monospace numerals for every figure.

## Color

Design tokens live as CSS variables in `src/app/globals.css` and are exposed to
Tailwind in `tailwind.config.ts`.

- **Primary** — mint / ticker green (positive money)
- **Accent** — warm gold (value)
- **Danger** — ticker red (negative)
- Neutral ink surfaces in dark; cool paper surfaces in light

Both light and dark are first-class; the theme is switchable and persisted.

## Type

- **Display** — Space Grotesk (headings, wordmark)
- **Body** — Inter
- **Data** — JetBrains Mono, applied via the `.tnum` class with tabular,
  slashed-zero numerals. Use it for every currency and metric.

## Texture & motion

- `.grid-bg` ledger grid, `.aurora` ambient glow, `.grain` film grain.
- Motion primitives in `src/components/motion/reveal.tsx`; the hero pulse in
  `src/components/marketing/hero-visual.tsx`. All motion respects
  `prefers-reduced-motion`.

## Components

Reusable primitives live in `src/components/ui`. Compose these rather than
introducing bespoke styles, and keep numeric output in `.tnum`.
