drop policy if exists "organisations_insert_owner" on public.organisations;

create policy "organisations_insert_authenticated"
on public.organisations
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and char_length(name) > 0
  and char_length(sector) > 0
  and char_length(country) > 0
  and char_length(employee_band) > 0
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
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;
