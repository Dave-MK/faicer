-- Add EU AI Act risk-tier classification to use cases.
-- Tiers follow Regulation (EU) 2024/1689: prohibited (Art. 5), high (Annex III),
-- limited (Art. 50 transparency), minimal, plus 'unclassified' as the default
-- until a use case has been assessed.

alter table public.use_cases
  add column if not exists eu_ai_act_tier text not null default 'unclassified'
    check (eu_ai_act_tier in ('prohibited', 'high', 'limited', 'minimal', 'unclassified'));

comment on column public.use_cases.eu_ai_act_tier is
  'EU AI Act risk tier for this use of AI. Decision-support only; confirm with a competent person.';

create index if not exists use_cases_eu_ai_act_tier_idx
  on public.use_cases (organisation_id, eu_ai_act_tier);
