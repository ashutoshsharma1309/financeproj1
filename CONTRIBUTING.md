# Contributing to AI CFO

Thanks for your interest in improving AI CFO! This guide covers the basics.

## Getting set up

```bash
git clone https://github.com/ashutoshsharma1309/financeproj1.git
cd financeproj1
npm install
cp .env.example .env
npm run dev
```

Node 22 is expected (see [`.nvmrc`](./.nvmrc)).

## Before you open a pull request

Run the same checks CI runs:

```bash
npm run lint
npm run typecheck
npm run build
```

All three must pass. The build is designed to succeed with empty secrets.

## Project conventions

- **No fabricated data.** Every figure must derive from user-entered data.
  Modules render empty states when there's no data — never placeholder numbers.
- **Calculations** live in `src/lib/calculations.ts` as pure functions.
- **State** goes through the Zustand stores (`src/lib/store.ts`, `src/lib/auth.ts`).
  Selectors must return stable references — derive arrays/objects with `useMemo`
  or `useShallow`, never inline `.filter()`/`.map()` inside a selector.
- **Validation** for every form uses the Zod schemas in `src/lib/validators.ts`.
- **Tests** for pure logic in `src/lib` use Vitest (`npm test`, or
  `npm run test:watch`); add coverage alongside behavior changes.
- Match the surrounding code style; Prettier config is in `.prettierrc`.

## Architecture decisions

When you make a non-obvious architectural choice (or reverse one), add an
[Architecture Decision Record](./docs/adr/README.md) using the template. It keeps
the reasoning trail honest for whoever picks the work up next.

## Commit messages

Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`) with a
concise, imperative summary.
