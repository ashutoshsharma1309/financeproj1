# Troubleshooting

## The app redirects me to login

App routes require an account. Sign up or log in first. If you cleared your
browser storage, your local account and data are removed — sign up again.

## My data disappeared

Data is stored in your browser's `localStorage` for this build. Clearing site
data, using a different browser/profile, or private browsing will start you
fresh. A future database-backed build will persist across devices.

## The dev server won't start (port in use)

Another process holds the port. Start on a different one:

```bash
PORT=4321 npm run dev
```

## The AI assistant says it can't answer

It only reasons over your data. Add some revenue/expenses first. For full
generative answers, set `GEMINI_API_KEY` (see [Environment](./ENVIRONMENT.md)).

## "Application error: a client-side exception"

Usually a store selector returning a new array/object each render. Select the
raw slice and derive with `useMemo` — see [State management](./STATE_MANAGEMENT.md).

## The notification bell shows nothing (or a stale count)

The bell counts unread alerts derived from your data — overdue invoices and
runway under six months. With no such conditions, it's correctly empty. Alerts
are de-duplicated by condition, so an existing alert won't re-appear; use
**Clear** on the Notifications page to reset, and a new condition will notify
again. See [Notifications](./NOTIFICATIONS.md).

## Build fails on fonts

`next/font` fetches fonts at build time; ensure network access for the first
build. Subsequent builds use the cache.

Still stuck? See [Support](../.github/SUPPORT.md).
