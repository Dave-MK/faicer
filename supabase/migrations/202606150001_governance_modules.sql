-- ─── Use Cases ────────────────────────────────────────────────────────────────

create table if not exists public.use_cases (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  tool_id uuid references public.ai_tools (id) on delete set null,
  title text not null,
  description text not null default '',
  business_unit text not null default '',
  owner_user_id uuid not null references auth.users (id) on delete restrict,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  status text not null default 'draft' check (status in ('draft', 'approved', 'restricted', 'prohibited', 'archived')),
  data_involved text not null default '',
  mitigations text not null default '',
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.use_cases enable row level security;
grant select, insert, update on public.use_cases to authenticated;

create policy "use_cases_select_member_orgs" on public.use_cases for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = use_cases.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "use_cases_insert_owner_admin" on public.use_cases for insert to authenticated
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = use_cases.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ));

create policy "use_cases_update_owner_admin" on public.use_cases for update to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = use_cases.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ))
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = use_cases.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ));

-- ─── Policies ─────────────────────────────────────────────────────────────────

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  title text not null,
  body text not null default '',
  version text not null default '1.0',
  status text not null default 'draft' check (status in ('draft', 'under_review', 'active', 'archived')),
  effective_date date,
  linked_tool_ids uuid[] not null default '{}',
  created_by_user_id uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.policies enable row level security;
grant select, insert, update on public.policies to authenticated;

create policy "policies_select_member_orgs" on public.policies for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = policies.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "policies_insert_owner_admin" on public.policies for insert to authenticated
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = policies.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ));

create policy "policies_update_owner_admin" on public.policies for update to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = policies.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ))
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = policies.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ));

-- ─── Policy Acknowledgements ──────────────────────────────────────────────────

create table if not exists public.policy_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policies (id) on delete cascade,
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  acknowledged_at timestamptz not null default timezone('utc', now()),
  unique (policy_id, user_id)
);

alter table public.policy_acknowledgements enable row level security;
grant select, insert on public.policy_acknowledgements to authenticated;

create policy "policy_acks_select_member_orgs" on public.policy_acknowledgements for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = policy_acknowledgements.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "policy_acks_insert_self" on public.policy_acknowledgements for insert to authenticated
  with check (user_id = (select auth.uid()));

-- ─── Risks ────────────────────────────────────────────────────────────────────

create table if not exists public.risks (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  title text not null,
  description text not null default '',
  entity_type text not null default 'organisation',
  entity_id text not null default '',
  severity smallint not null default 3 check (severity between 1 and 5),
  likelihood smallint not null default 3 check (likelihood between 1 and 5),
  risk_score smallint not null generated always as (severity * likelihood) stored,
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  mitigation text not null default '',
  residual_score smallint not null default 6,
  owner_user_id uuid not null references auth.users (id) on delete restrict,
  status text not null default 'open' check (status in ('open', 'mitigated', 'accepted', 'closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.risks enable row level security;
grant select, insert, update on public.risks to authenticated;

create policy "risks_select_member_orgs" on public.risks for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = risks.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "risks_insert_reviewer_up" on public.risks for insert to authenticated
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = risks.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin', 'reviewer')
  ));

create policy "risks_update_reviewer_up" on public.risks for update to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = risks.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin', 'reviewer')
  ))
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = risks.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin', 'reviewer')
  ));

-- ─── Controls ─────────────────────────────────────────────────────────────────

create table if not exists public.controls (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  title text not null,
  description text not null default '',
  type text not null default 'process' check (type in ('technical', 'policy', 'training', 'process')),
  status text not null default 'active' check (status in ('active', 'draft', 'retired')),
  linked_risk_ids uuid[] not null default '{}',
  owner_user_id uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.controls enable row level security;
grant select, insert, update on public.controls to authenticated;

create policy "controls_select_member_orgs" on public.controls for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = controls.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "controls_insert_owner_admin" on public.controls for insert to authenticated
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = controls.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ));

create policy "controls_update_owner_admin" on public.controls for update to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = controls.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ))
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = controls.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ));

-- ─── Assessments ──────────────────────────────────────────────────────────────

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  entity_type text not null default 'ai_tool',
  entity_id text not null,
  assessor_user_id uuid not null references auth.users (id) on delete restrict,
  assessment_date date not null,
  findings text not null default '',
  outcome text not null check (outcome in ('pass', 'fail', 'conditional')),
  next_assessment_at date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.assessments enable row level security;
grant select, insert on public.assessments to authenticated;

create policy "assessments_select_member_orgs" on public.assessments for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = assessments.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "assessments_insert_reviewer_up" on public.assessments for insert to authenticated
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = assessments.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin', 'reviewer')
  ));

-- ─── Evidence Items ───────────────────────────────────────────────────────────

create table if not exists public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  title text not null,
  type text not null default 'document' check (type in ('document', 'screenshot', 'audit_log', 'assessment', 'other')),
  file_url text,
  linked_entity_type text not null default 'organisation',
  linked_entity_id text not null,
  uploaded_by_user_id uuid not null references auth.users (id) on delete restrict,
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.evidence_items enable row level security;
grant select, insert on public.evidence_items to authenticated;

create policy "evidence_items_select_member_orgs" on public.evidence_items for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = evidence_items.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "evidence_items_insert_reviewer_up" on public.evidence_items for insert to authenticated
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = evidence_items.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin', 'reviewer')
  ));

-- ─── Incidents ────────────────────────────────────────────────────────────────

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  title text not null,
  description text not null default '',
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'investigating', 'resolved', 'closed')),
  linked_tool_id uuid references public.ai_tools (id) on delete set null,
  linked_use_case_id uuid references public.use_cases (id) on delete set null,
  reporter_user_id uuid not null references auth.users (id) on delete restrict,
  assigned_to_user_id uuid references auth.users (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.incidents enable row level security;
grant select, insert, update on public.incidents to authenticated;

create policy "incidents_select_member_orgs" on public.incidents for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = incidents.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "incidents_insert_members" on public.incidents for insert to authenticated
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = incidents.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "incidents_update_reviewer_up" on public.incidents for update to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = incidents.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin', 'reviewer')
  ))
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = incidents.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin', 'reviewer')
  ));

-- ─── Training Courses ─────────────────────────────────────────────────────────

create table if not exists public.training_courses (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  title text not null,
  description text not null default '',
  required_for_roles text[] not null default '{owner,admin,reviewer,staff}',
  duration_minutes smallint not null default 30,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.training_courses enable row level security;
grant select, insert on public.training_courses to authenticated;

create policy "training_courses_select_member_orgs" on public.training_courses for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = training_courses.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "training_courses_insert_owner_admin" on public.training_courses for insert to authenticated
  with check (exists (
    select 1 from public.memberships m
    where m.organisation_id = training_courses.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
      and m.role in ('owner', 'admin')
  ));

-- ─── Training Completions ─────────────────────────────────────────────────────

create table if not exists public.training_completions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.training_courses (id) on delete cascade,
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  completed_at timestamptz not null default timezone('utc', now()),
  certificate_url text,
  unique (course_id, user_id)
);

alter table public.training_completions enable row level security;
grant select, insert on public.training_completions to authenticated;

create policy "training_completions_select_member_orgs" on public.training_completions for select to authenticated
  using (exists (
    select 1 from public.memberships m
    where m.organisation_id = training_completions.organisation_id
      and m.user_id = (select auth.uid()) and m.status = 'active'
  ));

create policy "training_completions_insert_self" on public.training_completions for insert to authenticated
  with check (user_id = (select auth.uid()));

-- ─── Indexes for common query patterns ───────────────────────────────────────

create index if not exists use_cases_org_idx on public.use_cases (organisation_id, created_at desc);
create index if not exists policies_org_idx on public.policies (organisation_id, status);
create index if not exists policy_acks_user_idx on public.policy_acknowledgements (user_id, organisation_id);
create index if not exists risks_org_idx on public.risks (organisation_id, risk_level, status);
create index if not exists controls_org_idx on public.controls (organisation_id, status);
create index if not exists assessments_org_idx on public.assessments (organisation_id, assessment_date desc);
create index if not exists evidence_items_org_idx on public.evidence_items (organisation_id, created_at desc);
create index if not exists incidents_org_idx on public.incidents (organisation_id, severity, status);
create index if not exists training_courses_org_idx on public.training_courses (organisation_id);
create index if not exists training_completions_user_idx on public.training_completions (user_id, organisation_id);
