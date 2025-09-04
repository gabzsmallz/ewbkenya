# Software Requirements Specification (SRS) – Nonprofit Org Portal
Purpose: public pages & projects, donations, member portal (announcements + signups), admin CMS.
Users: Public, Member, Admin.
Functional: Projects, Announcements, Pages CMS, Donations page, Registrations & Signups (DB+Sheets).
Non-Functional: Cost low, HTTPS, RLS, minimal PII, SSG/SSR.
Data: profiles, projects, project_updates, announcements, members, project_signups, pages.
RLS: public read for projects/updates/pages; admin writes; member-only signups (enforce before prod).
