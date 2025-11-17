-- Add featured and display order fields to projects so editors can highlight and sort entries.
alter table public.projects
  add column if not exists featured boolean not null default false,
  add column if not exists display_order int;

-- Backfill ensures existing rows comply with the new not-null constraint.
update public.projects set featured = coalesce(featured, false)
  where featured is distinct from false;
