import { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const defaultTeamMembers = [
  {
    name: 'Jane Mwangi',
    role: 'Program Director',
    image:
      'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400&h=400&fit=crop',
    bio: 'Leads our strategic partnerships and community co-design efforts.',
  },
  {
    name: 'David Otieno',
    role: 'Lead Engineer',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop',
    bio: 'Guides project engineering standards and volunteer mentorship.',
  },
  {
    name: 'Aisha Njeri',
    role: 'Community Liaison',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    bio: 'Builds strong relationships with local leaders and project teams.',
  },
  {
    name: 'Peter Kimani',
    role: 'Innovation Fellow',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    bio: 'Explores emerging technologies that support resilient communities.',
  },
];

const defaultScrollSections = [
  {
    key: 'about',
    title: 'About Us',
    content:
      '<p>Engineers Without Borders Kenya is a collaborative community of volunteers, students, and professionals committed to co-creating sustainable solutions with local partners.</p>',
  },
  {
    key: 'vision',
    title: 'Our Vision',
    content:
      '<p>We envision thriving communities empowered through engineering, innovation, and shared knowledge to drive lasting change.</p>',
  },
  {
    key: 'objectives',
    title: 'Our Objectives',
    content:
      '<ul><li>Co-design impactful engineering projects with communities.</li><li>Mentor the next generation of socially conscious engineers.</li><li>Build resilient systems that respect people and the planet.</li></ul>',
  },
  {
    key: 'outcomes',
    title: 'Expected Outcomes',
    content:
      '<p>Through every initiative we pursue measurable outcomes&mdash;improved livelihoods, stronger infrastructure, and empowered community leaders prepared to steward their own development.</p>',
  },
  {
    key: 'team',
    title: 'Meet Our Team',
    content:
      '<p>Our multidisciplinary team brings together experienced engineers, community organizers, and dedicated volunteers whose stories embody our values and commitment.</p>',
    teamMembers: defaultTeamMembers,
  },
  {
    key: 'journey',
    title: 'Our Journey So Far',
    content:
      '<p>From grassroots beginnings to nationwide collaborations, our journey is built on learning, partnership, and the shared belief that engineering can uplift every community we serve.</p>',
  },
];

export async function getServerSideProps() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { props: { page: null } };
  }

  try {
    const s = createClient(supabaseUrl, supabaseKey);
    const { data: page } = await s
      .from('pages')
      .select('*')
      .eq('slug', 'home')
      .single();
    return { props: { page: page || null } };
  } catch (error) {
    console.error('Failed to load page content from Supabase:', error);
    return { props: { page: null } };
  }
}

export default function Home({ page }) {
  const hero =
    page?.hero_image_url ||
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80';

  const sections = useMemo(() => {
    const stored = Array.isArray(page?.sections) ? page.sections : [];
    const merged = defaultScrollSections.map((item) => {
      const found = stored.find((entry) => entry?.key === item.key);
      if (found) {
        return {
          ...item,
          ...found,
          key: found.key || item.key,
        };
      }
      return item;
    });
    const additional = stored.filter(
      (entry) => entry?.key && !merged.some((item) => item.key === entry.key)
    );
    return [...merged, ...additional];
  }, [page]);

  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, sections.length);
  }, [sections]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            if (!Number.isNaN(idx)) {
              setActiveSection(idx);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-35% 0px -35% 0px',
      }
    );
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
      observer.disconnect();
    };
  }, [sections]);

  return (
    <Layout title="Home">
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">
        <section className="min-h-screen snap-start flex items-center justify-center px-6 py-16 bg-gradient-to-br from-white via-white to-slate-100">
          <div className="max-w-6xl w-full grid gap-10 md:grid-cols-2 items-center">
            <div className="card shadow-brand">
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                {page?.title || 'Our Mission'}
              </h1>
              <div
                className="mt-3 text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    page?.content ||
                    'We are a nonprofit dedicated to impactful engineering projects.',
                }}
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/projects" className="btn btn-primary">
                  See Projects
                </Link>
                <Link href="/donate" className="btn btn-ghost">
                  Donate
                </Link>
              </div>
            </div>
            <div className="card shadow-brand">
              <img alt="hero" src={hero} className="rounded-xl object-cover w-full h-full" />
            </div>
          </div>
        </section>
        {sections.map((section, index) => (
          <section
            key={section.key || index}
            data-index={index}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className={`min-h-screen snap-start flex items-center justify-center px-6 py-12 transition-all duration-700 ease-out ${
              activeSection === index
                ? 'opacity-100 translate-y-0'
                : 'opacity-20 translate-y-6'
            }`}
          >
            <div className="max-w-5xl w-full text-center space-y-8 bg-white/70 backdrop-blur rounded-3xl shadow-xl p-10">
              <h2 className="text-3xl font-semibold text-gray-900">{section.title}</h2>
              {section.key === 'team' ? (
                <div className="space-y-10">
                  <div
                    className="prose max-w-none mx-auto text-gray-600"
                    dangerouslySetInnerHTML={{ __html: section.content || '' }}
                  />
                  <div className="grid gap-8 sm:grid-cols-2">
                    {(Array.isArray(section.teamMembers) && section.teamMembers.length
                      ? section.teamMembers
                      : defaultTeamMembers
                    ).map((member) => (
                      <div
                        key={member.name}
                        className="group relative flex flex-col items-center gap-5 rounded-[2.5rem] bg-white p-6 shadow-lg ring-1 ring-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
                      >
                        <div
                          className="relative w-32 h-32 rounded-full shadow-lg"
                          style={{
                            border: '4px solid var(--brand-primary)',
                            boxShadow: '0 18px 45px -20px rgba(15, 118, 110, 0.45)',
                          }}
                        >
                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm uppercase tracking-wide text-teal-600">{member.role}</p>
                          {member.bio ? (
                            <p className="text-sm text-gray-600">{member.bio}</p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="prose max-w-none mx-auto text-gray-600"
                  dangerouslySetInnerHTML={{ __html: section.content || '' }}
                />
              )}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}
