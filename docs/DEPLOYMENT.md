# Deployment

AI CFO builds to a standard Next.js output and runs on any Node 20+ host.

## Vercel (recommended)

1. Import the repository into Vercel.
2. The included `vercel.json` sets the framework, build command and security
   headers.
3. Add environment variables (see `.env.example`) in Project Settings.
4. Deploy.

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

## Self-hosting

```bash
npm ci
npm run build
npm run start   # serves on $PORT (default 3000)
```

Put it behind a reverse proxy (nginx/Caddy) for TLS. The app sets baseline
security headers in `next.config.mjs`.

## Environment

All variables are optional for a local run and empty in `.env.example`. For
production, set at minimum `DATABASE_URL`, `JWT_SECRET`, `NEXTAUTH_SECRET`, and
`NEXT_PUBLIC_APP_URL`. Add `GEMINI_API_KEY` to enable generative AI answers and
SMTP settings to send verification and reset emails.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests and
build on every push and pull request, and is designed to pass with empty secrets.
