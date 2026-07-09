# Environment variables

Copy `.env.example` to `.env` and fill in values as needed. Everything is
optional for a local run; the app degrades gracefully with empty values.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection for Prisma (models are ready) |
| `GEMINI_API_KEY` | Enables full generative AI answers |
| `GEMINI_MODEL` | Gemini model id (default `gemini-1.5-flash`) |
| `JWT_SECRET` | Signing secret for production auth |
| `NEXTAUTH_SECRET` | Session/token secret |
| `NEXTAUTH_URL` | App URL for auth callbacks |
| `SMTP_HOST` / `SMTP_PORT` | Mail server for verification & resets |
| `SMTP_USER` / `SMTP_PASS` | Mail credentials |
| `SMTP_FROM` | From address for outgoing mail |
| `NEXT_PUBLIC_APP_NAME` | Display name |
| `NEXT_PUBLIC_APP_URL` | Public base URL (used for SEO metadata) |

## Notes

- `NEXT_PUBLIC_*` values are exposed to the browser — never put secrets there.
- Without `GEMINI_API_KEY`, the assistant uses a deterministic offline analyzer.
- The production build is designed to succeed even with all values empty.
