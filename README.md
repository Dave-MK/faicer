# FAICER

Mock-first build of `FAICER` (Fundamental AI Compliance & Education Register): an AI-governance platform for SMEs covering tool inventory, use cases, risk, controls, assessments, evidence, incidents, policies, and training — on a multi-tenant auth and role foundation.

## What is in this repo

- Next.js 16 App Router app
- mock-backed sign in, sign up, sign out, password reset, and organisation creation flows
- centralized session and workspace permission helpers
- Supabase SSR utility files and `src/proxy.ts` for the production auth path
- role-aware app shell with a responsive mobile navigation drawer
- SQL migrations and seed data for the full domain schema:
  - identity: `organisations`, `profiles`, `memberships`, `audit_events`
  - tool register: `ai_tools`
  - governance: `use_cases`, `policies`, `policy_acknowledgements`, `risks`,
    `controls`, `assessments`, `evidence_items`, `incidents`,
    `training_courses`, `training_completions`
- unit and E2E test scaffolding

## Scope

The app now spans the identity foundation, the tool register, and the governance modules.

Built:

- scaffold, docs, and env parsing
- mock auth shell with password reset
- organisation creation and settings
- role-aware dashboard shell (responsive, with mobile drawer)
- AI tool inventory (list, add, detail, edit)
- use-case register
- policy builder, acknowledgements, and per-user "my policies"
- risk register and controls
- assessments
- evidence pack
- incident register
- training courses and completions
- governance overview, reports, and integrations surfaces
- permission helpers
- migrations and seed data
- test harness setup

Not started yet:

- production data wiring for the newer governance modules beyond their mock layer
- notifications and search (header actions are placeholders)

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

- `FAICER_AUTH_MODE=mock` for local development
- `FAICER_AUTH_MODE=supabase` for hosted-auth testing

If the variable is omitted, the default is:

- `mock` in development
- `supabase` in production

When you are ready to connect a real project:

1. Set `FAICER_AUTH_MODE=supabase`
2. Set `NEXT_PUBLIC_SUPABASE_URL`
3. Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Apply the SQL under `supabase/migrations/`

## Notes

- `src/proxy.ts` follows the Next.js 16 `proxy` convention, not deprecated `middleware.ts`
- authenticated routes are intentionally dynamic-first
- the scaffold is structured so tenant and role checks stay close to the data layer
- Playwright uses port `3001` so its test server does not collide with a manually running dev server on `3000`
