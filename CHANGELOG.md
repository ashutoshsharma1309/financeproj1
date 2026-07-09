# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Landing hero is now an honest empty-state product preview: removed the
  floating "AI CFO" and "Insights" cards and the decorative fabricated chart
  line. It shows labeled metric placeholders and an "add your data" chart
  prompt — no invented numbers, matching the product's core rule.

### Fixed

- Invoice overdue amounts now match the status shown in the table: `invoiceStats`
  buckets by the date-aware effective status, so a past-due `SENT` invoice is
  counted as overdue in the KPI cards, the AI context and the notifications
  alert. Outstanding still includes overdue (the money is owed).

### Added

- SEO: `robots.txt`, `sitemap.xml`, JSON-LD structured data, Open Graph and
  Twitter metadata, and `metadataBase`.
- PWA web app manifest and a gradient candlestick favicon.
- Global error boundary and dashboard loading skeletons.
- Accessibility: skip-to-content link and `aria-current` on active navigation.
- Tooling: Vitest with unit tests for the calculation engine, Prettier and
  EditorConfig, VS Code recommendations, Dependabot, and HTTP security headers.

## [1.0.0] - 2026-07

### Added

- Initial release: revenue, expenses, transactions, invoices, cash flow,
  forecasting, reports and an AI CFO assistant grounded only in user data.
- Financial-terminal design system with light/dark/system theming.
- Auth flows with role-based access control, Prisma schema (models only), and a
  Gemini AI route with a deterministic offline fallback.
