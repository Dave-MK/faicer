# Supabase Production-Path Validation

The app runs in two modes (`FAICER_AUTH_MODE`): `mock` (in-memory, cookie-backed)
and `supabase` (real Postgres + Auth + RLS). Every server action branches on
`isSupabaseAuthEnabled()` and calls either the mock store or the matching
`src/lib/supabase/*` data-access module.

The mock path is covered by `tests/unit/tenant-isolation.test.ts`. The Supabase
path enforces the same tenant boundary at the **database** layer through the
membership-based RLS policies in `supabase/migrations/`. Those policies can only
be exercised against a live Postgres, so this document is the runbook for that.

## Prerequisites (not present in the default dev box)

Live validation needs **one** of:

- **Local stack** — Docker Desktop running, then `supabase start` (spins up
  Postgres + Auth on `127.0.0.1:54321`). The repo already has `supabase/config.toml`.
- **Hosted project** — the project ref in `NEXT_PUBLIC_SUPABASE_URL`, linked via
  `supabase link`, plus the database password (or service-role key) to push
  migrations. Only the **publishable** (anon) key is in `.env.local`; pushing
  migrations to a hosted project is a one-way action and should be done
  deliberately, not as part of an automated run.

## Apply schema

```bash
# local
supabase start
supabase db reset            # applies migrations + supabase/seed*.sql

# hosted (after `supabase link --project-ref <ref>`)
supabase db push
```

## Run the app against it

```bash
# .env.local
FAICER_AUTH_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Then walk the core flows and confirm each persists/reads from Postgres:

1. sign up → creates `auth.users` + `profiles` row
2. create organisation → `organisations` + owner `memberships` row
3. add an AI tool, use case, policy, risk, control, assessment, evidence,
   incident, training course → row in the matching table + an `audit_events` row
4. sign out / sign back in → data still present

## SQL-level tenant-isolation check (the RLS gate)

Run in the SQL editor / `psql`. This proves a member of org A cannot read org B
even with a direct query, because RLS filters by `auth.uid()` membership.

```sql
-- Two orgs, two users, one membership each (run as service role / postgres).
-- Replace the UUIDs with two real auth.users ids.
insert into public.organisations (id, name, sector, country, employee_band)
values ('00000000-0000-0000-0000-00000000000a', 'Org A', 'x', 'UK', '3-10'),
       ('00000000-0000-0000-0000-00000000000b', 'Org B', 'x', 'UK', '3-10');

insert into public.memberships (organisation_id, user_id, role, status)
values ('00000000-0000-0000-0000-00000000000a', '<user-a>', 'owner', 'active'),
       ('00000000-0000-0000-0000-00000000000b', '<user-b>', 'owner', 'active');

-- Simulate user A's JWT and confirm org B is invisible.
set local role authenticated;
set local request.jwt.claims = '{"sub":"<user-a>","role":"authenticated"}';

select id from public.organisations;          -- expect: only org A
select count(*) from public.organisations
  where id = '00000000-0000-0000-0000-00000000000b';  -- expect: 0
```

Repeat the `select` against `ai_tools`, `risks`, `policies`, etc. after seeding a
row into org B — each must return zero rows for user A. If any table leaks,
its policy in `supabase/migrations/202606150001_governance_modules.sql` (or the
tool/identity migrations) is missing or mis-scoped.

## Current RLS coverage (verified by inspection)

All 15 tables have `enable row level security` and membership-scoped policies:

- identity: `organisations`, `profiles`, `memberships`, `audit_events`
- tool register: `ai_tools`
- governance: `use_cases`, `policies`, `policy_acknowledgements`, `risks`,
  `controls`, `assessments`, `evidence_items`, `incidents`, `training_courses`,
  `training_completions`

The `select`/`insert`/`update` policies follow the `exists (select 1 from
memberships ...)` pattern recommended in `docs/implementation-research.md`.
