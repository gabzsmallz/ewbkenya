# Org Portal Starter • CMS + Seeds
Run `db/schema.sql` first, then `db/seed_pages.sql` and `db/seed_projects.sql` in Supabase.

If you set up the project before the site settings feature was added, also run
`db/migrations/20241007_add_site_settings.sql` to create the `site_settings`
table used for storing the logo URL and other global configuration.
