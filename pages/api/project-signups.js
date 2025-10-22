import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const supabase = createPagesServerClient({ req, res });
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError) return res.status(500).json({ error: authError.message });
  if (!userData?.user) return res.status(401).json({ error: 'Not authenticated' });

  const projectId = parseInt(req.query?.projectId, 10);
  if (!projectId) return res.status(400).json({ error: 'Missing projectId' });

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', userData.user.id)
    .maybeSingle();
  if (profileError) return res.status(500).json({ error: profileError.message });
  if (!profile) return res.status(403).json({ error: 'Member profile required' });

  if (profile.role !== 'member' && profile.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to view project signups' });
  }

  const { data: signups, error: signupsError } = await supabaseAdmin
    .from('project_signups')
    .select(
      `id, message, skills, availability, created_at,
      profiles:profiles!project_signups_profile_id_fkey(id, full_name, email)`
    )
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (signupsError) return res.status(500).json({ error: signupsError.message });

  const normalizedSignups = (signups || []).map((signup) => ({
    id: signup.id,
    message: signup.message,
    skills: signup.skills,
    availability: signup.availability,
    created_at: signup.created_at,
    profile: signup.profiles
      ? {
          id: signup.profiles.id,
          full_name: signup.profiles.full_name,
          email: signup.profiles.email,
        }
      : null,
  }));

  return res.status(200).json({ signups: normalizedSignups });
}
