# Org Portal Starter (Next.js + Supabase + Tailwind + Google Sheets + CMS)
See /docs for SRS, ADR, API, and RLS notes.

## Quick Start
1) Supabase: create project → URL, anon key, service role.  
2) SQL: run `db/schema.sql`.  
3) Storage: create a **public bucket** called `media` (used for uploads).  
4) Google Sheets: create tabs `Members` and `Signups`; share with service account.  
5) Env: copy `.env.example` → `.env.local` and fill values.  
6) Install & run: `npm install` then `npm run dev` → http://localhost:3000

## Admin Access
Set your user as admin:
```sql
insert into public.profiles(id, full_name, email, role)
values ('<your-auth-users-id>', 'Your Name', 'you@example.org', 'admin')
on conflict (id) do update set role='admin';
```
Then visit `/admin/projects`, `/admin/announcements`, `/admin/pages`.

## CMS Features
- Admin CRUD for Projects, Announcements, and Landing Page (Pages).
- WYSIWYG editor (ReactQuill) for landing content.
- Image uploads to Supabase Storage (`media` bucket).
- Server-side admin guard + API routes under `/api/admin/*`.
- Public landing reads content from `pages` table (slug `home`).

## Harden before production
- Replace permissive policies with admin-only writes; require member auth for signups.
- Add captcha/rate limit to public endpoints.
- Rotate service key; restrict service usage to server only.
