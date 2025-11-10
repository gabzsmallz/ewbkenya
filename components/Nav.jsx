import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';

export default function Nav() {
  const supabase = getSupabase();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      setProfile(null);
      return undefined;
    }

    let active = true;

    const load = async () => {
      try {
        const res = await fetch('/api/me');
        const body = await res.json().catch(() => null);
        if (!active) return;

        if (res.ok && body) {
          setUser(body.user || null);
          setProfile(body.profile || null);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        if (!active) return;
        setUser(null);
        setProfile(null);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      setLogoUrl(null);
      return undefined;
    }

    let active = true;

    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'site_logo_url')
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) return;
        setLogoUrl(data?.value || null);
      });

    return () => {
      active = false;
    };
  }, [supabase]);

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = '/';
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <nav
      className="bg-white/80 backdrop-blur border-b"
      style={{ borderColor: 'var(--brand-tint)' }}
    >
      <div className="container flex items-center justify-between py-3">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold"
          style={{ color: 'var(--brand-primary)' }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="EWB Kenya Community logo"
              className="h-10 w-auto"
              loading="lazy"
            />
          ) : null}
          <span className="whitespace-nowrap">EWB Kenya Community</span>
        </Link>
        <div className="space-x-4">
          <Link href="/projects" style={{ color: 'var(--brand-text)' }}>
            Projects
          </Link>
          <Link href="/donate" style={{ color: 'var(--brand-text)' }}>
            Donate
          </Link>
          {user ? (
            <>
              <Link href="/member" className="btn btn-ghost">
                Member
              </Link>
              {isAdmin ? (
                <Link href="/admin/projects" className="btn btn-primary">
                  Admin
                </Link>
              ) : null}
              <button className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/member" className="btn btn-ghost">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
