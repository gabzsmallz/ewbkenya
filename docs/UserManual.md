# EWB Kenya Community Portal — User Manual

## 1. Introduction
The EWB Kenya Community Portal is a web application built with Next.js and Supabase that brings together public storytelling, member collaboration, and administrator tooling in a single interface. Home and Donate pages are populated from Supabase content with rich sections, while projects, member resources, and announcements are managed through secure dashboards.【F:pages/index.jsx†L47-L176】【F:pages/donate.jsx†L10-L42】

## 2. Roles and access levels
The portal recognises three access levels:

- **Visitors** can browse public pages such as the landing page, project catalogue, and donation information.【F:components/Nav.jsx†L80-L129】【F:pages/projects/index.jsx†L1-L84】
- **Members** log in with a Supabase magic link to unlock protected resources, volunteer on projects, and view member-only announcements.【F:pages/member/index.jsx†L4-L23】【F:pages/projects/[slug].jsx†L177-L237】
- **Administrators** receive additional menu options for managing site content, projects, and settings.【F:components/Nav.jsx†L108-L118】【F:components/AdminShell.jsx†L4-L47】

Protected areas verify a signed-in Supabase profile and enforce role-based access before showing content.【F:components/Protected.jsx†L3-L30】【F:components/AdminOnly.jsx†L2-L7】

### 2.1 Managing roles in Supabase
All authenticated users are represented by a row in the `profiles` table, which stores their name, email, and `role` (`member` or `admin`).【F:db/schema.sql†L1-L7】 New accounts default to `member`, so you must explicitly promote administrators by updating this column.

1. Open the Supabase project dashboard and navigate to **Table Editor → profiles**.
2. Locate the user you want to update. If they have just signed up, ensure their email matches the Supabase Auth record.
3. Set the **role** field to `admin` for staff who should access the Admin console; leave it as `member` for standard users.
4. Save the change. Subsequent logins pick up the new role automatically because every protected route queries the profile via `/api/me` and checks the `role` field before rendering sensitive content.【F:components/Protected.jsx†L3-L30】【F:lib/adminGuard.js†L5-L15】

To demote an administrator back to a regular member, repeat the steps above and change the `role` value to `member`. No application redeploy is required because Supabase returns the updated role on the next request.【F:components/AdminOnly.jsx†L2-L7】【F:pages/api/project-signup.js†L7-L18】

## 3. Accessing the portal
Use the navigation bar to move between primary areas. The navigation automatically surfaces **Projects**, **Donate**, **Member**, and **Admin** (for administrators) links and offers a logout action for authenticated users.【F:components/Nav.jsx†L80-L129】

Members sign in by visiting `/member`, selecting **Email Magic Link**, and entering their address. Supabase sends a one-time link that redirects back to the member dashboard once clicked.【F:pages/member/index.jsx†L4-L23】

## 4. Public site features
### 4.1 Home page
The landing page pulls hero content, imagery, and scrollable sections from the `pages` table (`slug = 'home'`). Default sections cover About, Vision, Objectives, Outcomes, Team, and Journey, with optional per-member bios and photos.【F:pages/index.jsx†L7-L189】 The hero call-to-action highlights **Projects** and **Donate** shortcuts for visitors.【F:pages/index.jsx†L132-L155】

### 4.2 Projects directory
The `/projects` route lists published projects with status breakdowns, cover imagery, and links to detail pages. Statistics summarise total projects and counts per lifecycle stage (planned, in progress, completed) using Supabase data.【F:pages/projects/index.jsx†L1-L84】

### 4.3 Project detail and volunteering
Each project detail page includes the full description, updates from the `project_updates` table, and member volunteering tools. Logged-in members can submit skills, availability, and notes, update their entry, or remove themselves. Administrators additionally see buttons to remove other volunteers from the roster.【F:pages/projects/[slug].jsx†L2-L237】

### 4.4 Donate page
Donation copy and payment instructions are editable via the `pages` table (`slug = 'donate'`). If no custom content exists, default guidance is rendered.【F:pages/donate.jsx†L4-L42】

## 5. Member workspace
The member dashboard presents curated resources pulled from `member_dashboard_items`, including optional link buttons and descriptions arranged by sort order.【F:pages/member/index.jsx†L1-L23】 Quick actions link directly to member announcements.【F:pages/member/index.jsx†L5-L23】

The announcements view lists posts from the `announcements` table in reverse chronological order. Only authenticated members or administrators can access it.【F:pages/member/announcements.jsx†L1-L10】【F:components/Protected.jsx†L3-L30】

On project pages, members can view the roster of volunteers (name, email, skills, availability, notes) and manage their own signup. Administrators can additionally remove volunteer entries when necessary.【F:pages/projects/[slug].jsx†L155-L237】

## 6. Administrator console
Administrators see a persistent sidebar with quick links to Overview, Projects, Member Dashboard, Announcements, Pages, and Site Settings tools.【F:components/AdminShell.jsx†L4-L47】 Each admin page is wrapped in an access check to ensure only admin profiles can view or modify content.【F:components/AdminOnly.jsx†L2-L7】

### 6.1 Projects management
The Projects screen supports creating, editing, and deleting entries with fields for title, slug, summary, full description, status, and cover image. Uploading an image uses the shared Supabase storage bucket and immediately previews the selected file.【F:pages/admin/projects.jsx†L1-L62】【F:components/UploadImage.jsx†L1-L58】 Project lists show current status labels and provide quick edit/delete controls.【F:pages/admin/projects.jsx†L38-L60】

### 6.2 Member dashboard content
Administrators can add or reorder member dashboard tiles with titles, descriptions, optional button labels/URLs, and numeric sort order. The interface enforces a required title and offers edit or delete actions for existing items.【F:pages/admin/member-dashboard.jsx†L1-L57】

### 6.3 Announcements
Announcements can be drafted with a title, rich body text, and visibility scope (`members` or `admins`). Existing posts display timestamp, audience, and a delete option.【F:pages/admin/announcements.jsx†L1-L22】

### 6.4 Page builder (Home & Donate)
The Pages tool lets administrators switch between the Home and Donate entries, edit hero copy, upload a hero image (home only), and compose rich text using a WYSIWYG editor. For the Home page, each scroll section can be customised, including managing the Meet Our Team grid with name, role, photo (via upload or direct URL), and bio per member.【F:pages/admin/pages.jsx†L1-L196】【F:components/WysiwygEditor.jsx†L1-L58】

### 6.5 Site settings
The Site Settings screen manages shared configuration values, currently focusing on the header logo stored under the `site_logo_url` key. Administrators can paste a URL, upload a new image to Supabase, preview the logo, clear it, and save changes once satisfied.【F:pages/admin/settings.jsx†L7-L182】 The navigation bar automatically displays the saved logo alongside the site name.【F:components/Nav.jsx†L47-L100】

## 7. File uploads
Image uploads across the admin experience convert selected files to Base64, send them through `/api/admin/uploads`, and return a public URL saved in Supabase storage. Upload progress and errors are surfaced inline so admins know when an upload has completed.【F:components/UploadImage.jsx†L1-L58】 The WYSIWYG editor also hooks into the same upload helper for inline images.【F:components/WysiwygEditor.jsx†L1-L58】

## 8. Data sources
Most pages rely on Supabase queries that pull from tables such as `pages`, `projects`, `project_updates`, `member_dashboard_items`, and `announcements`. Environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be present for server-side data fetching to succeed.【F:pages/index.jsx†L47-L66】【F:pages/projects/index.jsx†L1-L21】【F:pages/member/index.jsx†L1-L6】【F:pages/donate.jsx†L10-L22】

## 9. Troubleshooting tips
- **Cannot view member or admin pages:** Ensure you are logged in and that your Supabase profile has the appropriate `role` (`member` or `admin`). Otherwise a friendly message explains the missing access.【F:components/Protected.jsx†L3-L30】
- **Admin access denied:** If the admin guard cannot confirm an admin profile, the page shows an "Admin access required" notice and stops rendering sensitive tools.【F:components/AdminOnly.jsx†L2-L7】
- **Image upload issues:** Upload widgets report errors returned by `/api/admin/uploads`; retry after verifying file type and size.【F:components/UploadImage.jsx†L31-L58】
- **Volunteer signup errors:** Project pages display inline success or error messages when saving, removing, or loading volunteer information fails, helping members retry once the issue is resolved.【F:pages/projects/[slug].jsx†L99-L237】

## 10. Support handoff checklist
When handing the portal to a new administrator:

1. Provide Supabase project credentials (URL, anon key) and confirm tables are migrated (see `db/schema.sql`).【F:pages/index.jsx†L47-L66】
2. Ensure new admins have a `profiles` row with `role = 'admin'` so protected routes load correctly.【F:components/AdminOnly.jsx†L2-L7】【F:components/Protected.jsx†L13-L18】
3. Share this manual plus credentials for any third-party donation processors referenced on the Donate page.【F:pages/donate.jsx†L4-L42】
4. Walk through uploading a logo and updating a project to validate Supabase storage permissions and API keys.【F:pages/admin/settings.jsx†L7-L182】【F:pages/admin/projects.jsx†L1-L62】

Following these steps keeps the EWB Kenya Community Portal content fresh and accessible for the entire organisation.
