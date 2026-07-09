# Theming

AI CFO ships light, dark and system themes, with the choice persisted.

## How it works

- `next-themes` provides the theme context (`src/components/theme`).
- The theme is stored under the `aicfo-theme` key and applied as a `.dark` class
  on `<html>`.
- **System** follows the OS `prefers-color-scheme`.

## Switching

Use the light / system / dark toggle in the top navigation (marketing) or the
top bar (app). Charts, tables, forms, dialogs and the sidebar all adapt.

## Tokens

Colors are CSS variables in `src/app/globals.css` and exposed to Tailwind in
`tailwind.config.ts`. Both themes are defined explicitly — dark is the signature
"financial terminal" look; light is a crisp cool-paper variant.

See the [design system guide](./DESIGN_SYSTEM.md) for the full palette and type
scale. Why tokens are CSS variables (and how charts stay in sync across themes):
[ADR 0012](./adr/0012-css-variable-design-tokens.md).
