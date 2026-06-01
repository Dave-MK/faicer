# AI Ledger Implementation Research

Date: June 1, 2026

## Executive recommendation

Build `AI Ledger` now and keep `PassportKit` out of this repository until its first product category is chosen.

For `AI Ledger`, the best implementation path is:

1. Use the existing `Next.js 16.2.7` + `React 19.2.4` App Router stack already in this repo.
2. Use `Supabase Auth` with `@supabase/ssr` cookie-based SSR auth and `proxy.ts` token refresh.
3. Use `Postgres` tables plus `Row Level Security` as the real tenancy boundary.
4. Keep authorization checks in three places:
   - page/data-access layer
   - server actions and route handlers
   - database RLS policies
5. Build only Milestones 0 and 1 first:
   - scaffold
   - auth
   - organisation creation
   - membership roles
   - tenant-isolation tests

This matches the handover, fits the current framework version, and lines up with current Next.js and Supabase guidance.

## What the handover actually implies

The handover pack contains two different workstreams:

- `AI Ledger` is ready for implementation now, starting with Milestones 0 and 1.
- `PassportKit` is explicitly not ready for implementation yet.

That distinction is important. The `PassportKit` checklist says product-specific Digital Product Passport requirements vary by category, access rights, identifier model, and delegated acts. The right move is to treat it as a separate research and validation project, not as an early feature branch of this Next app.

## Current repo assessment

The connected repo is still the default scaffold:

- `src/app/page.tsx` is the starter homepage
- there is no auth, tenancy, schema, docs, or test setup yet
- `package.json` already uses modern versions:
  - `next: 16.2.7`
  - `react: 19.2.4`
  - `react-dom: 19.2.4`

That means the main job is not migration. It is choosing the right architecture before building.

## Recommended technical direction

### 1. App architecture

Use a single-repo App Router application with route groups instead of separate apps.

Suggested shape:

```text
src/app/
  (public)/
  (auth)/
  (app)/
    dashboard/
    setup/
    team/
```

Why:

- the handover already recommends a single repository
- Next's App Router is the default path for new apps
- the app is multi-tenant by data boundary, not by separate deployment boundary

Do not start with subdomain tenancy. For Milestones 0 and 1, a current-organisation context in app state and URL flow is simpler and less risky.

### 2. Authentication

Use `Supabase Auth` with SSR, not a custom session layer and not a second auth vendor.

Reasons:

- it is the stack named in the handover
- it integrates directly with Postgres and RLS
- current Supabase guidance for Next.js uses `@supabase/ssr`, cookies, and `proxy.ts`

Implementation rules:

1. Use `@supabase/ssr` helpers for browser and server clients.
2. Store auth in cookies, not local storage.
3. Use the PKCE-based SSR flow that Supabase configures by default.
4. Add a `proxy.ts` for token refresh only.
5. In server code, trust `supabase.auth.getClaims()`, not `getSession()`.

Important nuance:

`proxy.ts` is not the real security layer. Next.js says Proxy is useful for optimistic checks, but should not be the full authorization solution. Real protection must also happen in Server Components, Server Actions, Route Handlers, and the database.

### 3. Identity model

Use `auth.users` as the identity source of truth and create app tables around it.

Best early model:

- `organisations`
- `memberships`
- `profiles` or `user_profiles`
- `audit_events`

Practical recommendation:

- keep the actual login identity in Supabase Auth
- do not create a second password system
- if the product needs display names, teams, or app preferences, store them in `profiles`

The handover lists a `users` table. In practice, with Supabase, that should usually become:

- `auth.users` for credentials and login identity
- app-owned profile table for product fields

### 4. Multi-tenancy and authorization

Use database-backed membership checks as the canonical tenant and role model.

Recommended pattern:

- every domain table carries `organisation_id`
- every request resolves the current user from Supabase Auth
- app permissions are derived from `memberships`
- RLS policies restrict rows to organisations the user belongs to

Do not rely only on JWT `app_metadata` for membership. Supabase documents that JWT-based values can become stale until refresh. That makes JWT claims useful for coarse-grained shortcuts, but a poor sole source of truth for changing organisation membership or role changes.

Best early policy pattern:

```sql
exists (
  select 1
  from memberships m
  where m.organisation_id = ai_tools.organisation_id
    and m.user_id = auth.uid()
    and m.status = 'active'
)
```

Then add role constraints where needed:

```sql
exists (
  select 1
  from memberships m
  where m.organisation_id = organisations.id
    and m.user_id = auth.uid()
    and m.status = 'active'
    and m.role in ('owner', 'admin')
)
```

### 5. Server-side data access pattern

Use a small data-access layer rather than querying Supabase ad hoc throughout pages.

Recommended layout:

```text
src/lib/auth/
src/lib/db/
src/lib/permissions/
src/lib/validation/
src/lib/audit/
```

Core functions:

- `getCurrentUser()`
- `requireUser()`
- `getCurrentMembership(organisationId)`
- `requireOrgRole(organisationId, roles)`
- `logAuditEvent(...)`

Why this is the best path:

- Next's auth guidance recommends checks close to the data source
- it reduces the chance of one route forgetting authorization
- it makes tenant-isolation tests much easier

### 6. Database and schema strategy

Use migrations from the start, even with mock/demo data.

Milestone 0/1 schema should stay narrow:

- `organisations`
- `profiles`
- `memberships`
- `audit_events`

Nice-to-have, but not yet necessary:

- invitations table
- review tasks
- AI tool tables
- use-case tables

Keep Milestone 1 focused on identity, organisation creation, and role boundaries. That will make Milestone 2 safer.

### 7. Test strategy

Use both `Vitest` and `Playwright`.

Best split:

- `Vitest` for validation, pure permission helpers, mapping functions, and small UI pieces
- `Playwright` for auth, organisation creation, role gating, and tenant isolation

Why both:

- Next's testing guidance recommends E2E testing for async Server Component flows
- tenant isolation is a behavior test, not just a unit test

Minimum Milestone 1 test cases:

1. unauthenticated user is redirected from app routes
2. owner can create an organisation
3. owner can view their own organisation dashboard
4. staff user cannot access owner/admin actions
5. user from org A cannot read org B records
6. direct server action or route handler calls still enforce auth

### 8. Caching and rendering

Do not get clever with caching on authenticated routes yet.

Use these defaults:

- authenticated app routes: dynamic
- public marketing pages: static
- no ISR on routes that can refresh a Supabase session

This matters because current Supabase guidance warns that caching a response carrying a refreshed auth cookie can leak a session to another user if misconfigured.

### 9. UI and product scope

For Milestones 0 and 1, optimize for clear admin workflow, not visual flash.

Build:

- landing page
- sign in / sign up / sign out
- create organisation flow
- role-aware dashboard shell
- basic settings/profile surface

Do not build yet:

- tool register
- policy builder
- evidence pack
- incidents
- training

That restraint is part of the best implementation strategy. The handover explicitly says not to start Milestone 2 until scaffold, schema, and permission tests are reviewed.

## Specific pitfalls to avoid

### Avoid using Proxy as the only gate

Next.js documents that `proxy.ts` is not a full authorization solution. Use it for token refresh and optimistic redirects, but re-check in server code and RLS.

### Avoid trusting `getSession()` in server auth checks

Supabase says to use `getClaims()` for page and data protection, and not to trust `getSession()` in server code such as Proxy because it does not guarantee token revalidation.

### Avoid stale JWT-driven tenant membership

Supabase documents that JWT contents can lag behind database truth until refresh. Do not make org membership changes depend only on claims embedded in the token.

### Avoid exposed-schema tables without RLS

Supabase says exposed-schema tables need both grants and RLS. If we create tables in `public`, RLS must be enabled deliberately in migrations.

### Avoid assuming UPDATE works with only an UPDATE policy

Supabase notes that `UPDATE` also needs a `SELECT` policy. Missing that causes confusing no-op updates.

### Avoid view-based shortcuts without `security_invoker`

Supabase notes that views bypass RLS by default unless configured correctly. For Milestone 1, avoid policy-sensitive views unless there is a strong reason.

## Best milestone plan

### Milestone 0

1. Add docs, env validation, Supabase client utilities, and migration setup.
2. Create base schema for `organisations`, `profiles`, `memberships`, `audit_events`.
3. Add seeded demo data.
4. Add `Vitest` and `Playwright`.

### Milestone 1

1. Add sign up, sign in, sign out.
2. Add organisation creation flow.
3. Add owner/admin/staff role model.
4. Add DAL + permission helpers.
5. Add RLS policies and tenant-isolation tests.
6. Add a minimal dashboard shell.

### Stop point after Milestone 1

Do a review before any tool-register work begins.

Approval checklist:

- auth works
- organisation creation works
- tenant isolation is tested
- owner/admin/staff boundaries are tested
- README explains local setup clearly

## Recommendation on PassportKit

Do not code `PassportKit` in this repo yet.

Why:

1. ESPR creates a framework, but product requirements depend on category-specific delegated acts.
2. The regulation requires differentiated access rights, persistence, restricted updates, and long-term availability.
3. Battery passports already include interoperable, machine-readable, access-controlled, non-lock-in requirements that are materially more complex than a simple QR landing page.
4. The 2025 to 2030 working plan prioritises categories such as textiles/apparel, furniture, and mattresses, but that does not remove the need to choose one narrow commercial wedge first.

Best next step for PassportKit:

- complete the research tracker
- choose one category
- interview at least 15 target businesses
- define whether the record is model, batch, or item level
- only then decide whether it deserves its own codebase

## Concrete build recommendation

If we continue implementation in this repo, the best next coding step is:

1. create the `docs/`, `src/lib/`, and Supabase utility structure
2. install `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `vitest`, `@playwright/test`
3. wire `proxy.ts`
4. add base schema and RLS
5. build auth and organisation creation only

That is the highest-confidence path with the lowest architectural regret.

## Sources

- Next.js App Router docs: https://nextjs.org/docs/app
- Next.js Proxy guide: https://nextjs.org/docs/app/getting-started/proxy
- Next.js upgrade to version 16: https://nextjs.org/docs/app/guides/upgrading/version-16
- Next.js testing overview: https://nextjs.org/docs/app/guides/testing
- Next.js Playwright guide: https://nextjs.org/docs/app/guides/testing/playwright
- Next.js Vitest guide: https://nextjs.org/docs/app/guides/testing/vitest
- Next.js multi-tenant guide: https://nextjs.org/docs/app/guides/multi-tenant
- Supabase Next.js SSR auth: https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
- Supabase SSR advanced guide: https://supabase.com/docs/guides/auth/server-side/advanced-guide
- Supabase securing your API: https://supabase.com/docs/guides/api/securing-your-api
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- EU AI Act: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R1689
- European Commission AI literacy page: https://digital-strategy.ec.europa.eu/en/policies/ai-talent-skills-and-literacy
- ICO DUAA overview: https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-what-does-it-mean-for-organisations/
- ICO AI transparency guidance: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/guidance-on-ai-and-data-protection/how-do-we-ensure-transparency-in-ai/
- ESPR regulation: https://eur-lex.europa.eu/eli/reg/2024/1781/eng
- Batteries regulation: https://eur-lex.europa.eu/eli/reg/2023/1542/oj
- Ecodesign for Sustainable Products and Energy Labelling Working Plan 2025-2030: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A52025DC0187
