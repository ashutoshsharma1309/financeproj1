# Accessibility

Accessibility is treated as a quality floor, not an afterthought.

## What's built in

- **Skip to content** — a keyboard link at the top of marketing and app layouts.
- **Focus visibility** — a consistent focus ring on all interactive elements.
- **Semantic landmarks** — `main` regions with an `id="main"` target, labelled
  navigation, and `aria-current="page"` on the active sidebar item.
- **Labelled controls** — inputs use associated labels; icon-only buttons have
  `aria-label`s.
- **Dialogs** — `role="dialog"`, `aria-modal`, Escape to close, and scroll lock.
- **Reduced motion** — animations collapse when `prefers-reduced-motion` is set.
- **Color contrast** — text and controls are tuned for contrast in both themes.

## Testing tips

- Navigate the whole app with the keyboard only.
- Toggle `prefers-reduced-motion` and confirm animations settle.
- Run an audit (e.g. Lighthouse or axe) and check landmark and label coverage.

Found an issue? Please open a [bug report](../.github/ISSUE_TEMPLATE/bug_report.md).
