import Layout from '../../components/Layout';
import AdminOnly from '../../components/AdminOnly';
import { useEffect, useState } from 'react';
import UploadImage from '../../components/UploadImage';
import AdminShell from '../../components/AdminShell';
import WysiwygEditor from '../../components/WysiwygEditor';
import { createDefaultTeamMembers } from '../../utils/defaultTeamMembers';

const defaultSections = [
  { key: 'about', title: 'About Us', content: '' },
  { key: 'vision', title: 'Our Vision', content: '' },
  { key: 'objectives', title: 'Our Objectives', content: '' },
  { key: 'outcomes', title: 'Expected Outcomes', content: '' },
  { key: 'team', title: 'Meet Our Team', content: '' },
  { key: 'journey', title: 'Our Journey So Far', content: '' },
];

const createDefaultSections = () =>
  defaultSections.map((section) => ({
    ...section,
    ...(section.key === 'team'
      ? { teamMembers: createDefaultTeamMembers() }
      : {}),
  }));

const ensureTeamMembers = (members) =>
  Array.isArray(members)
    ? members.map((member) => ({ ...member }))
    : createDefaultTeamMembers();

const mergeSections = (sections) => {
  const incoming = Array.isArray(sections) ? sections : [];
  const defaults = createDefaultSections();
  const sanitizedIncoming = incoming.filter(
    (section) => section && typeof section === 'object'
  );

  const merged = defaults.map((section) => {
    const found = sanitizedIncoming.find((entry) => entry?.key === section.key);
    if (!found) return section;

    const next = {
      ...section,
      ...found,
    };

    if (section.key === 'team') {
      next.teamMembers = ensureTeamMembers(found.teamMembers);
    }

    return next;
  });

  const additional = sanitizedIncoming
    .filter((entry) => entry?.key && !merged.some((section) => section.key === entry.key))
    .map((entry) =>
      entry.key === 'team'
        ? { ...entry, teamMembers: ensureTeamMembers(entry.teamMembers) }
        : entry
    );

  return [...merged, ...additional];
};

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
            ? mergeSections(d.sections)
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

  const updateTeamMember = (sectionIndex, memberIndex, changes) => {
    setPage((p) => {
      const nextSections = [...(p.sections || [])];
      const currentSection = { ...(nextSections[sectionIndex] || {}) };
      const members = Array.isArray(currentSection.teamMembers)
        ? [...currentSection.teamMembers]
        : [];

      members[memberIndex] = {
        ...(members[memberIndex] || {}),
        ...changes,
      };

      currentSection.teamMembers = members;
      nextSections[sectionIndex] = currentSection;
      return { ...p, sections: nextSections };
    });
  };

  const addTeamMember = (sectionIndex) => {
    setPage((p) => {
      const nextSections = [...(p.sections || [])];
      const currentSection = { ...(nextSections[sectionIndex] || {}) };
      const members = Array.isArray(currentSection.teamMembers)
        ? [...currentSection.teamMembers]
        : [];

      members.push({ name: '', role: '', image: '', bio: '' });

      currentSection.teamMembers = members;
      nextSections[sectionIndex] = currentSection;
      return { ...p, sections: nextSections };
    });
  };

  const removeTeamMember = (sectionIndex, memberIndex) => {
    setPage((p) => {
      const nextSections = [...(p.sections || [])];
      const currentSection = { ...(nextSections[sectionIndex] || {}) };
      const members = Array.isArray(currentSection.teamMembers)
        ? currentSection.teamMembers.filter((_, idx) => idx !== memberIndex)
        : [];

      currentSection.teamMembers = members;
      nextSections[sectionIndex] = currentSection;
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
                      {section?.key === 'team' ? (
                        <div className="space-y-4">
                          <WysiwygEditor
                            value={section?.content || ''}
                            onChange={(v) => updateSection(idx, { content: v })}
                          />
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-md font-semibold">Team Members</h4>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => addTeamMember(idx)}
                              >
                                Add member
                              </button>
                            </div>
                            {Array.isArray(section?.teamMembers) && section.teamMembers.length > 0 ? (
                              section.teamMembers.map((member, memberIdx) => (
                                <div
                                  key={`${member?.name || 'member'}-${memberIdx}`}
                                  className="space-y-3 rounded-md border border-gray-200 bg-white p-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-semibold text-gray-700">
                                      Member {memberIdx + 1}
                                    </h5>
                                    <button
                                      type="button"
                                      className="text-xs text-red-600 hover:underline"
                                      onClick={() => removeTeamMember(idx, memberIdx)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <label className="space-y-1 text-sm">
                                      <span className="block text-gray-600">Name</span>
                                      <input
                                        className="w-full rounded border p-2"
                                        value={member?.name || ''}
                                        onChange={(e) =>
                                          updateTeamMember(idx, memberIdx, {
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </label>
                                    <label className="space-y-1 text-sm">
                                      <span className="block text-gray-600">Role</span>
                                      <input
                                        className="w-full rounded border p-2"
                                        value={member?.role || ''}
                                        onChange={(e) =>
                                          updateTeamMember(idx, memberIdx, {
                                            role: e.target.value,
                                          })
                                        }
                                      />
                                    </label>
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <label className="space-y-1 text-sm">
                                      <span className="block text-gray-600">Photo</span>
                                      <UploadImage
                                        onUploaded={(url) =>
                                          updateTeamMember(idx, memberIdx, {
                                            image: url,
                                          })
                                        }
                                      />
                                      <input
                                        className="mt-2 w-full rounded border p-2"
                                        placeholder="Or paste an image URL"
                                        value={member?.image || ''}
                                        onChange={(e) =>
                                          updateTeamMember(idx, memberIdx, {
                                            image: e.target.value,
                                          })
                                        }
                                      />
                                    </label>
                                    {member?.image ? (
                                      <div className="flex items-end justify-center">
                                        <img
                                          src={member.image}
                                          alt={member?.name || `Team member ${memberIdx + 1}`}
                                          className="h-24 w-24 rounded-full object-cover shadow"
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                  <label className="space-y-1 text-sm">
                                    <span className="block text-gray-600">Bio</span>
                                    <textarea
                                      className="w-full rounded border p-2"
                                      rows={3}
                                      value={member?.bio || ''}
                                      onChange={(e) =>
                                        updateTeamMember(idx, memberIdx, {
                                          bio: e.target.value,
                                        })
                                      }
                                    />
                                  </label>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-600">
                                No team members yet. Click “Add member” to create one.
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <WysiwygEditor
                          value={section?.content || ''}
                          onChange={(v) => updateSection(idx, { content: v })}
                        />
                      )}
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
