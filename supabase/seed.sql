-- Mock-first seed notes
-- ---------------------
-- The runnable application currently uses in-memory mock data from
-- src/lib/data/mock-store.ts so the Milestone 0 scaffold works without a live
-- Supabase project.
--
-- When a Supabase project is connected, seed auth users first, then align
-- profiles and memberships with those user IDs.
--
-- Example starter organisation:
insert into public.organisations (
  id,
  name,
  sector,
  country,
  employee_band
)
values (
  '11111111-1111-1111-1111-111111111111',
  'BrightForge Studio',
  'Marketing agency',
  'United Kingdom',
  '11-30'
)
on conflict (id) do nothing;
