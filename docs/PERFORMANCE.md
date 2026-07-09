# Performance

AI CFO aims to feel instant. A few practices keep it fast.

## Rendering

- The app is built on the Next.js App Router; marketing and auth pages are
  statically prerendered.
- Client work is scoped — only interactive modules ship as client components.

## Bundles

- `optimizePackageImports` is enabled for `lucide-react`, `recharts` and
  `framer-motion` so only used icons/components are bundled.
- Chart wrappers are **code-split** via `next/dynamic` (`ssr: false`,
  `src/components/charts/lazy.tsx`), so Recharts (~108 kB) loads on demand
  behind a height-matched skeleton — first-load JS on chart routes dropped
  ~40–50%. Import charts from `@/components/charts/lazy` (not `.../charts`).
- Fonts are loaded with `next/font` (self-hosted, `display: swap`) to avoid
  layout shift and external requests.

## Data & state

- All metrics are pure functions over in-memory state — no network round-trips
  for calculations.
- Selectors return stable references to avoid needless re-renders (see
  [State management](./STATE_MANAGEMENT.md)).

## Perceived speed

- Loading skeletons (`loading.tsx`) show while routes resolve.
- Charts and tables scroll within their own containers so the page never blocks.

## Measuring

Build locally and review the route sizes printed by `npm run build`, or run
Lighthouse against a production build (`npm run start`).
