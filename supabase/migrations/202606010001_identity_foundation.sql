create extension if not exists pgcrypto;

create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text not null,
  country text not null,
  employee_band text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'reviewer', 'staff')),
  status text not null default 'active' check (status in ('active', 'invited', 'suspended')),
  invited_at timestamptz not null default timezone('utc', now()),
  joined_at timestamptz,
  unique (organisation_id, user_id)
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  actor_user_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.organisations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.audit_events enable row level security;

grant select, insert, update, delete on public.organisations to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.memberships to authenticated;
grant select, insert, update, delete on public.audit_events to authenticated;

create policy "profiles_select_self"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "memberships_select_own_orgs"
on public.memberships
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "memberships_insert_self_owner"
on public.memberships
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and role = 'owner'
  and status = 'active'
);

create policy "organisations_select_member_orgs"
on public.organisations
for select
to authenticated
using (
  exists (
    select 1
    from public.memberships current_membership
    where current_membership.organisation_id = organisations.id
      and current_membership.user_id = (select auth.uid())
      and current_membership.status = 'active'
  )
);

create policy "organisations_insert_owner"
on public.organisations
for insert
to authenticated
with check (true);

create policy "audit_events_select_member_orgs"
on public.audit_events
for select
to authenticated
using (
  exists (
    select 1
    from public.memberships current_membership
    where current_membership.organisation_id = audit_events.organisation_id
      and current_membership.user_id = (select auth.uid())
      and current_membership.status = 'active'
  )
);

create policy "audit_events_insert_member_orgs"
on public.audit_events
for insert
to authenticated
with check (
  actor_user_id = (select auth.uid())
);

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'rls_auto_enable'
  ) then
    execute 'revoke all on function public.rls_auto_enable() from anon, authenticated';
  end if;
end $$;
