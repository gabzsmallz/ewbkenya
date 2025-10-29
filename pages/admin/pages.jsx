import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import AdminOnly from '../../components/AdminOnly';
import { useEffect, useState } from 'react';
import UploadImage from '../../components/UploadImage';
import AdminShell from '../../components/AdminShell';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <textarea className="w-full border rounded p-2" rows={6} />,
});
import 'react-quill/dist/quill.snow.css';

const defaultSections = [
  { key: 'about', title: 'About Us', content: '' },
  { key: 'vision', title: 'Our Vision', content: '' },
  { key: 'objectives', title: 'Our Objectives', content: '' },
  { key: 'outcomes', title: 'Expected Outcomes', content: '' },
  { key: 'team', title: 'Meet Our Team', content: '' },
  { key: 'journey', title: 'Our Journey So Far', content: '' },
];

const createDefaultSections = () => defaultSections.map((section) => ({ ...section }));

export default function AdminPages() {
  const [page, setPage] = useState({
    slug: 'home',
    title: '',
    content: '',
    hero_image_url: '',
    sections: createDefaultSections(),
  });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const r = await fetch('/api/admin/pages?slug=home');
    const d = await r.json();
    if (d) {
      setPage((p) => ({
        ...p,
        ...d,
        sections:
          Array.isArray(d.sections) && d.sections.length > 0
            ? d.sections
            : createDefaultSections(),
      }));
    } else {
      setPage((p) => ({ ...p, sections: createDefaultSections() }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const r = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
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
            <h2 className="text-xl font-semibold mb-3">Landing Page Content</h2>
            <form onSubmit={save} className="space-y-4">
              <input
                className="w-full border rounded p-2"
                placeholder="Title"
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
              />
              <div>
                <label className="text-sm block mb-1">Hero Image</label>
                <UploadImage
                  onUploaded={(url) => setPage({ ...page, hero_image_url: url })}
                />
                {page.hero_image_url && (
                  <img src={page.hero_image_url} className="mt-2 rounded" />
                )}
              </div>
              <div>
                <label className="text-sm block mb-1">Content</label>
                <ReactQuill
                  theme="snow"
                  value={page.content || ''}
                  onChange={(v) => setPage({ ...page, content: v })}
                />
              </div>
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
                    <ReactQuill
                      theme="snow"
                      value={section?.content || ''}
                      onChange={(v) => updateSection(idx, { content: v })}
                    />
                  </div>
                ))}
              </div>
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
