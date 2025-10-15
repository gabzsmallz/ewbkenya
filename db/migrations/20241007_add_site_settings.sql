-- Ensure the site_settings table exists for storing portal-wide configuration such as the logo URL.
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Allow clients to read the settings without authentication and make sure RLS is on
alter table public.site_settings enable row level security;

drop policy if exists "site settings public read" on public.site_settings;
create policy "site settings public read" on public.site_settings
  for select
  using (true);
