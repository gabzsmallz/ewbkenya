import Layout from '../../components/Layout';
import AdminOnly from '../../components/AdminOnly';
import { useEffect, useState } from 'react';
import UploadImage from '../../components/UploadImage';
import AdminShell from '../../components/AdminShell';
import WysiwygEditor from '../../components/WysiwygEditor';

const defaultSections = [
  { key: 'about', title: 'About Us', content: '' },
  { key: 'vision', title: 'Our Vision', content: '' },
  { key: 'objectives', title: 'Our Objectives', content: '' },
  { key: 'outcomes', title: 'Expected Outcomes', content: '' },
  { key: 'team', title: 'Meet Our Team', content: '' },
  { key: 'journey', title: 'Our Journey So Far', content: '' },
];

const createDefaultSections = () => defaultSections.map((section) => ({ ...section }));

const defaultPageContent = {
  home: {
    slug: 'home',
    title: '',
    content: '',
    hero_image_url: '',
    sections: createDefaultSections(),
  },
  donate: {
    slug: 'donate',
    title: 'Donate',
    content:
      '<p>Support our projects. Use any of the options below.</p><ul><li><strong>Paybill/Till:</strong> <code>XXXXXX</code></li><li><strong>Bank:</strong> Account Name, Account No, Bank, Branch, SWIFT</li><li><strong>PayPal:</strong> <a href="#">Donate button</a></li></ul>',
    hero_image_url: '',
    sections: null,
  },
};

const getDefaultPage = (slug) => {
  const base = defaultPageContent[slug];
  if (base) {
    if (slug === 'home') {
      return { ...base, sections: createDefaultSections() };
    }
    return { ...base };
  }
  return {
    slug,
    title: '',
    content: '',
    hero_image_url: '',
    sections: null,
  };
};

export default function AdminPages() {
  const [slug, setSlug] = useState('home');
  const [page, setPage] = useState(getDefaultPage('home'));
  const [busy, setBusy] = useState(false);

  const load = async (nextSlug) => {
    const targetSlug = nextSlug || slug;
    const r = await fetch(`/api/admin/pages?slug=${targetSlug}`);
    const d = await r.json();
    if (d) {
      setPage((p) => ({
        ...getDefaultPage(targetSlug),
        ...d,
        sections:
          targetSlug === 'home'
            ? Array.isArray(d.sections) && d.sections.length > 0
              ? d.sections
              : createDefaultSections()
            : null,
      }));
    } else {
      setPage(getDefaultPage(targetSlug));
    }
  };

  useEffect(() => {
    load(slug);
  }, [slug]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const r = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...page, slug }),
    });
    setBusy(false);
    if (!r.ok) alert('Save failed');
  };

  const updateSection = (index, changes) => {
    setPage((p) => {
      const nextSections = [...(p.sections || [])];
      nextSections[index] = { ...(nextSections[index] || {}), ...changes };
      return { ...p, sections: nextSections };
    });
  };

  return (
    <Layout title="Admin • Pages">
      <AdminOnly>
        <AdminShell>
          <div className="card shadow-brand">
            <h2 className="text-xl font-semibold mb-2">Website Page Content</h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose a page below to load its content. The Donate page shares the same editor as the
              landing page so you can adjust its copy right here.
            </p>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="text-sm block mb-1">Page</label>
                <select
                  className="w-full border rounded p-2"
                  value={slug}
                  onChange={(e) => {
                    const next = e.target.value;
                    setSlug(next);
                    setPage(getDefaultPage(next));
                  }}
                >
                  <option value="home">Home</option>
                  <option value="donate">Donate</option>
                </select>
              </div>
              <input
                className="w-full border rounded p-2"
                placeholder="Title"
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
              />
              {slug === 'home' && (
                <div>
                  <label className="text-sm block mb-1">Hero Image</label>
                  <UploadImage
                    onUploaded={(url) => setPage({ ...page, hero_image_url: url })}
                  />
                  {page.hero_image_url && (
                    <img src={page.hero_image_url} className="mt-2 rounded" />
                  )}
                </div>
              )}
              <div>
                <label className="text-sm block mb-1">Content</label>
                <WysiwygEditor
                  value={page.content || ''}
                  onChange={(v) => setPage({ ...page, content: v })}
                />
              </div>
              {slug === 'home' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Scroll Sections</h3>
                  {(page.sections || []).map((section, idx) => (
                    <div
                      key={section?.key || idx}
                      className="border rounded-lg p-3 space-y-3 bg-gray-50"
                    >
                      <input
                        className="w-full border rounded p-2"
                        placeholder="Section title"
                        value={section?.title || ''}
                        onChange={(e) =>
                          updateSection(idx, { title: e.target.value })
                        }
                      />
                      <WysiwygEditor
                        value={section?.content || ''}
                        onChange={(v) => updateSection(idx, { content: v })}
                      />
                    </div>
                  ))}
                </div>
              )}
              <button className="btn btn-primary" disabled={busy}>
                {busy ? 'Saving…' : 'Save Page'}
              </button>
            </form>
          </div>
        </AdminShell>
      </AdminOnly>
    </Layout>
  );
}
