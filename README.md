# FAICER

Mock-first scaffold for the `FAICER` (Fundamental AI Compliance & Education Register) Milestones 0 to 2 foundation: auth, tenancy, and the first tool-register workflow.

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

This repo now covers the Milestone 2 tool register, but still stops before the later governance flows.

Included now:

- scaffold and docs
- env parsing
- mock auth shell
- organisation creation flow
- role-aware dashboard shell
- AI tool inventory, add flow, detail page, and edit flow
- permission helpers
- migration and seed placeholders
- test harness setup

Not started yet:

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

The demo org also ships with seeded AI tool records so the register is not empty on first run.

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

The runnable app supports an explicit auth mode switch:

- `AI_LEDGER_AUTH_MODE=mock` for local development
- `AI_LEDGER_AUTH_MODE=supabase` for hosted-auth testing

If the variable is omitted, the default is:

- `mock` in development
- `supabase` in production

When you are ready to connect a real project:

1. Set `AI_LEDGER_AUTH_MODE=supabase`
2. Set `NEXT_PUBLIC_SUPABASE_URL`
3. Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Apply the SQL under `supabase/migrations/`

## Notes

- `src/proxy.ts` follows the Next.js 16 `proxy` convention, not deprecated `middleware.ts`
- authenticated routes are intentionally dynamic-first
- the scaffold is structured so tenant and role checks stay close to the data layer
- Playwright uses port `3001` so its test server does not collide with a manually running dev server on `3000`
