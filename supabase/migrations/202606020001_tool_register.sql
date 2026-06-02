create table if not exists public.ai_tools (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations (id) on delete cascade,
  name text not null,
  vendor text not null,
  website_url text,
  category text not null check (
    category in (
      'general_chatbot',
      'image_generation',
      'audio_generation',
      'video_generation',
      'transcription',
      'meeting_assistant',
      'coding_assistant',
      'marketing_automation',
      'crm_feature',
      'recruitment_feature',
      'analytics_feature',
      'other'
    )
  ),
  approval_status text not null check (
    approval_status in ('approved', 'restricted', 'prohibited')
  ),
  account_owner_user_id uuid not null references auth.users (id) on delete restrict,
  business_owner_user_id uuid not null references auth.users (id) on delete restrict,
  privacy_policy_url text,
  data_processing_notes text not null default '',
  notes text not null default '',
  last_reviewed_at date,
  next_review_at date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.ai_tools enable row level security;

grant select, insert, update on public.ai_tools to authenticated;

create policy "ai_tools_select_member_orgs"
on public.ai_tools
for select
to authenticated
using (
  exists (
    select 1
    from public.memberships current_membership
    where current_membership.organisation_id = ai_tools.organisation_id
      and current_membership.user_id = (select auth.uid())
      and current_membership.status = 'active'
  )
);

create policy "ai_tools_insert_owner_admin"
on public.ai_tools
for insert
to authenticated
with check (
  exists (
    select 1
    from public.memberships current_membership
    where current_membership.organisation_id = ai_tools.organisation_id
      and current_membership.user_id = (select auth.uid())
      and current_membership.status = 'active'
      and current_membership.role in ('owner', 'admin')
  )
);

create policy "ai_tools_update_owner_admin"
on public.ai_tools
for update
to authenticated
using (
  exists (
    select 1
    from public.memberships current_membership
    where current_membership.organisation_id = ai_tools.organisation_id
      and current_membership.user_id = (select auth.uid())
      and current_membership.status = 'active'
      and current_membership.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.memberships current_membership
    where current_membership.organisation_id = ai_tools.organisation_id
      and current_membership.user_id = (select auth.uid())
      and current_membership.status = 'active'
      and current_membership.role in ('owner', 'admin')
  )
);
