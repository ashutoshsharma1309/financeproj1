# Component catalog

Reusable UI primitives live in `src/components/ui`. Compose these rather than
introducing bespoke styles.

| Component | Purpose |
| --- | --- |
| `Button` | Primary/secondary/ghost/outline/danger/success variants, sizes, loading |
| `Card` | Surface container with header/title/description/content |
| `Input`, `Textarea`, `Select`, `Label`, `Field` | Form controls with error/hint |
| `Badge` | Status pills with tones |
| `Dialog` | Accessible modal with backdrop, Escape and scroll lock |
| `ConfirmDialog` | Confirm/cancel wrapper around `Dialog` |
| `Dropdown` | Menu with items and a danger variant |
| `EmptyState` | Icon + title + description + action for no-data views |
| `Skeleton` | Shimmer placeholders (`StatSkeleton`, `TableSkeleton`) |
| `StatCard` | KPI card with tone, delta and monospace value |
| `PageHeader` | Title, description and action row |
| `Tabs`, `Switch`, `Progress` | Small stateful primitives (`ui/misc`) |
| `SkipLink` | Keyboard skip-to-content link |

## Feature components

- `components/charts` — theme-aware Recharts wrappers (area, bar, line, donut).
- `components/dashboard` — sidebar, top bar, onboarding and the app shell.
- `components/marketing` — nav, footer, hero visual, marquee, comparison.
- `components/motion` — scroll-reveal helpers.

## Conventions

Keep numeric output in the `.tnum` monospace class and match the surrounding
Tailwind style. See the [design system guide](./DESIGN_SYSTEM.md).
