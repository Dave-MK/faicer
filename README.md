# AI Ledger

Mock-first scaffold for the `AI Ledger` Milestone 0 foundation and Milestone 1-ready auth and tenancy shell.

## What is in this repo

- Next.js 16 App Router app
- mock-backed sign in, sign up, sign out, and organisation creation flows
- centralized session and workspace permission helpers
- Supabase SSR utility files and `src/proxy.ts` for the production auth path
- initial SQL migration and seed placeholders for:
  - `organisations`
  - `profiles`
  - `memberships`
  - `audit_events`
- unit and E2E test scaffolding

## Scope guard

This repo intentionally stops before Milestone 2.

Included now:

- scaffold and docs
- env parsing
- mock auth shell
- organisation creation flow
- role-aware dashboard shell
- permission helpers
- migration and seed placeholders
- test harness setup

Not started yet:

- AI tool register
- use-case register
- policy builder
- training
- incidents
- evidence pack

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Copy the example env file:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open [http://localhost:3000/welcome](http://localhost:3000/welcome)

## Demo users

Use these seeded emails on the sign-in page:

- `owner@brightforge.test`
- `admin@brightforge.test`
- `staff@brightforge.test`

No password is required in mock mode.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:e2e
npm run typecheck
```

## Supabase path

The runnable app uses mock mode when Supabase env vars are absent, and switches to real Supabase Auth plus Postgres tables when they are present.

When you are ready to connect a real project:

1. Set `NEXT_PUBLIC_SUPABASE_URL`
2. Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Replace the mock store flows with real Supabase Auth and database writes
4. Apply the SQL under `supabase/migrations/`

## Notes

- `src/proxy.ts` follows the Next.js 16 `proxy` convention, not deprecated `middleware.ts`
- authenticated routes are intentionally dynamic-first
- the scaffold is structured so tenant and role checks stay close to the data layer
