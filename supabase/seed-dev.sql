-- seed-dev.sql — one-shot dev login wiring for FAICER (Supabase mode)
-- ====================================================================
--
-- PREREQUISITE — create the auth user FIRST:
--   Supabase dashboard -> Authentication -> Users -> Add user
--     • Email: must match v_email below
--     • Password: your choice
--     • ☑ Auto Confirm User  (so you can sign in immediately)
--
-- THEN run this file:
--   Dashboard -> SQL Editor -> paste -> Run
--   (the SQL Editor runs as the service role, so it bypasses RLS)
--
-- Idempotent: safe to re-run. Edit the three values below, then run.

do $$
declare
  v_email        text := 'owner@brightforge.test';        -- must match the auth user
  v_display_name text := 'BrightForge Owner';             -- shown in member/activity views
  v_org_id       uuid := '11111111-1111-1111-1111-111111111111';
  v_user_id      uuid;
begin
  -- 1. Resolve the auth user you created in the dashboard
  select id into v_user_id from auth.users where email = v_email;
  if v_user_id is null then
    raise exception
      'No auth user found for "%". Create it under Authentication -> Users (with Auto Confirm) first.',
      v_email;
  end if;

  -- 2. Ensure the organisation exists
  insert into public.organisations (id, name, sector, country, employee_band)
  values (v_org_id, 'BrightForge Studio', 'Marketing agency', 'United Kingdom', '11-30')
  on conflict (id) do nothing;

  -- 3. Profile (primary key = auth user id)
  insert into public.profiles (id, email, display_name)
  values (v_user_id, v_email, v_display_name)
  on conflict (id) do update
    set email        = excluded.email,
        display_name = excluded.display_name,
        updated_at   = timezone('utc', now());

  -- 4. Membership — owner, active (this is what unlocks the workspace)
  insert into public.memberships (organisation_id, user_id, role, status, joined_at)
  values (v_org_id, v_user_id, 'owner', 'active', timezone('utc', now()))
  on conflict (organisation_id, user_id) do update
    set role     = excluded.role,
        status   = excluded.status,
        joined_at = coalesce(memberships.joined_at, excluded.joined_at);

  raise notice 'Seeded owner % (user %) into org % — sign in at /sign-in',
    v_email, v_user_id, v_org_id;
end $$;
