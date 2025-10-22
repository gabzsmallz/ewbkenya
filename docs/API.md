# API Reference
POST /api/register-member  → DB insert + Sheets append (registration)  
GET  /api/project-signup   → Authenticated member's signup for a project (requires `projectId` query)
POST /api/project-signup   → Create/update member signup (stores skills, availability, notes)
Admin endpoints (admin role only):
- /api/admin/projects (GET, POST, DELETE)
- /api/admin/announcements (GET, POST, DELETE)
- /api/admin/pages (GET, POST)
