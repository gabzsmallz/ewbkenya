-- === Tables (unchanged; keep yours if you already created them) ===
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text check (role in ('admin','member')) default 'member',
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id bigserial primary key,
  slug text unique not null,
  title text not null,
  summary text,
  description text,
  status text check (status in ('planned','in_progress','completed')) default 'planned',
  start_date date,
  end_date date,
  cover_image_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.project_updates (
  id bigserial primary key,
  project_id bigint references public.projects(id) on delete cascade,
  body text not null,
  image_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.announcements (
  id bigserial primary key,
  title text not null,
  body text not null,
  visible_to text check (visible_to in ('members','admins')) default 'members',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.members (
  id bigserial primary key,
  profile_id uuid references public.profiles(id),
  full_name text not null,
  email text not null,
  phone text,
  skills text,
  interest_areas text,
  approved boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.project_signups (
  id bigserial primary key,
  project_id bigint references public.projects(id) on delete cascade,
  profile_id uuid references public.profiles(id),
  message text,
  created_at timestamptz default now(),
  unique(project_id, profile_id)
);

create table if not exists public.pages (
  id bigserial primary key,
  slug text unique not null,
  title text,
  content text,
  hero_image_url text,
  updated_at timestamptz default now()
);

-- === Enable RLS (must be ON before policies apply) ===
alter table public.projects         enable row level security;
alter table public.project_updates  enable row level security;
alter table public.announcements    enable row level security;
alter table public.members          enable row level security;
alter table public.project_signups  enable row level security;
alter table public.pages            enable row level security;

-- === Helper: admin check ===
create or replace function public.is_admin(uid uuid)
returns boolean language sql immutable as
$$
  select exists (
    select 1 from public.profiles p where p.id = uid and p.role = 'admin'
  );
$$;

-- === Policies (DROP if exists, then CREATE) ===
-- Projects: public read
drop policy if exists "projects public read" on public.projects;
create policy "projects public read"
  on public.projects
  for select
  using (true);

-- Project updates: public read
drop policy if exists "updates public read" on public.project_updates;
create policy "updates public read"
  on public.project_updates
  for select
  using (true);

-- Pages (CMS landing): public read
drop policy if exists "pages public read" on public.pages;
create policy "pages public read"
  on public.pages
  for select
  using (true);

-- Announcements: members/admins read (MVP: allow all reads; tighten later with auth)
drop policy if exists "announcements members read" on public.announcements;
create policy "announcements members read"
  on public.announcements
  for select
  using (true);

-- Members: allow public insert for registration (add captcha/rate limit in app)
drop policy if exists "members insert" on public.members;
create policy "members insert"
  on public.members
  for insert
  with check (true);

-- Project signups: allow insert (MVP). Before production, tie to auth user.
drop policy if exists "signups insert" on public.project_signups;
create policy "signups insert"
  on public.project_signups
  for insert
  with check (true);

-- === (Optional) STRONGER POLICIES for production — uncomment when ready ===
-- drop policy if exists "projects admin write" on public.projects;
-- create policy "projects admin write"
--   on public.projects
--   for all
--   using (public.is_admin(auth.uid()))
--   with check (public.is_admin(auth.uid()));

-- drop policy if exists "announcements admin write" on public.announcements;
-- create policy "announcements admin write"
--   on public.announcements
--   for all
--   using (public.is_admin(auth.uid()))
--   with check (public.is_admin(auth.uid()));

-- drop policy if exists "pages admin write" on public.pages;
-- create policy "pages admin write"
--   on public.pages
--   for all
--   using (public.is_admin(auth.uid()))
--   with check (public.is_admin(auth.uid()));

-- -- Require login for signups and bind to self:
-- drop policy if exists "signups member insert" on public.project_signups;
-- create policy "signups member insert"
--   on public.project_signups
--   for insert
--   with check (auth.uid() = profile_id);
