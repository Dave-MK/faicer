# Deployment

FAICER is a standard Next.js 16 App Router app and deploys to any platform that
runs `next build` / `next start` (Vercel, Netlify, a container, etc.). Vercel
auto-detects the framework with no extra config.

## Build & start

```bash
npm ci
npm run build
npm run start
```

## Required environment variables

These are validated at startup by `src/lib/config/env.ts`.

| Variable | Required | Notes |
| --- | --- | --- |
| `FAICER_AUTH_MODE` | recommended | `mock` or `supabase`. If unset, defaults to `mock` in development and `supabase` in production. |
| `APP_SESSION_SECRET` | **yes in production** | Random string, min 16 chars. `next start` (production) throws without it. |
| `NEXT_PUBLIC_SUPABASE_URL` | yes for real auth | Supabase project URL. Required for `FAICER_AUTH_MODE=supabase` to actually use Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes for real auth | Supabase publishable (anon) key. |

Note: with `FAICER_AUTH_MODE=supabase` but the Supabase variables unset, the app
falls back to the mock data path (`isSupabaseAuthEnabled()` is false). Set all
three to run against a real project.

## Modes

- **Demo / preview deploy** — set `FAICER_AUTH_MODE=mock` and `APP_SESSION_SECRET`.
  No database needed; the seeded demo org and mock auth are used.
- **Production with real data** — set `FAICER_AUTH_MODE=supabase`, both Supabase
  variables, and apply the SQL migrations. See
  [supabase-validation.md](supabase-validation.md) for the schema-apply and
  RLS-verification runbook.

## CI

`.github/workflows/ci.yml` runs on every push and PR to `main`: typecheck, lint,
unit tests, build, and the Playwright e2e suite (in mock mode). Wire the same
checks as required status checks before enabling auto-deploy.
