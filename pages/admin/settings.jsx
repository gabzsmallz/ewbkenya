import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import AdminOnly from '../../components/AdminOnly';
import AdminShell from '../../components/AdminShell';
import UploadImage from '../../components/UploadImage';

const LOGO_KEY = 'site_logo_url';

export default function SiteSettings() {
  const [logoUrl, setLogoUrl] = useState('');
  const [initialLogoUrl, setInitialLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setMessage(null);
        const response = await fetch('/api/admin/site-settings');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load site settings');
        }
        const { settings } = await response.json();
        if (!active) return;
        const currentLogo = settings?.[LOGO_KEY] ?? '';
        setLogoUrl(currentLogo);
        setInitialLogoUrl(currentLogo);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load site settings');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const hasChanges = useMemo(() => logoUrl !== initialLogoUrl, [logoUrl, initialLogoUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!hasChanges) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: LOGO_KEY, value: logoUrl })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to save site settings');
      }

      setInitialLogoUrl(logoUrl);
      setMessage('Site settings updated successfully.');
    } catch (err) {
      setError(err.message || 'Unable to save site settings');
    } finally {
      setSaving(false);
    }
  };

  const handleClearLogo = () => {
    setLogoUrl('');
    setMessage(null);
    setError(null);
  };

  const onUploaded = (url) => {
    setLogoUrl(url);
    setMessage('Image uploaded. Save changes to update the logo.');
    setError(null);
  };

  return (
    <Layout title="Site Settings">
      <AdminOnly>
        <AdminShell>
          <div className="card shadow-brand">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
              Site Settings
            </h1>
            <p className="mt-3 text-sm md:text-base">
              Manage shared settings for the public site. Upload a new organisation logo to replace the current header logo.
            </p>
          </div>

          <div className="card shadow-brand">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--brand-primary)' }}>
              Header Logo
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Upload an image to the Supabase <code>media</code> bucket or paste a hosted image URL. Square or landscape images with a
              transparent background work best.
            </p>

            {loading ? (
              <p className="mt-4 text-sm text-gray-600">Loading current logo…</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="logoUrl" style={{ color: 'var(--brand-text)' }}>
                    Logo URL
                  </label>
                  <input
                    id="logoUrl"
                    type="url"
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="https://..."
                    value={logoUrl}
                    onChange={(event) => {
                      setLogoUrl(event.target.value);
                      setMessage(null);
                    }}
                  />
                  <UploadImage onUploaded={onUploaded} />
                  <div className="flex gap-3 text-sm text-gray-600">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleClearLogo}
                      disabled={!logoUrl}
                    >
                      Remove logo
                    </button>
                    <span className="self-center">Upload a new file or clear the URL to remove the logo.</span>
                  </div>
                </div>

                {logoUrl ? (
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
                      Preview
                    </p>
                    <div className="mt-2 flex items-center gap-3 rounded-xl border p-4">
                      <img src={logoUrl} alt="Header logo preview" className="h-16 w-auto" />
                      <span className="text-sm text-gray-600">Displayed next to the site name in the navigation bar.</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No logo will be shown in the header.</p>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}
                {message && <p className="text-sm text-emerald-600">{message}</p>}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!hasChanges || saving}
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                  {!hasChanges && !saving && (
                    <span className="text-sm text-gray-600">No changes to save.</span>
                  )}
                </div>
              </form>
            )}
          </div>
        </AdminShell>
      </AdminOnly>
    </Layout>
  );
}
