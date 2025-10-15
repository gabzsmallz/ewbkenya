import { requireAdmin } from '../../../lib/adminGuard';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  const { isAdmin } = await requireAdmin(req, res);
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('site_settings').select('key,value');
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const settings = Object.fromEntries((data || []).map((row) => [row.key, row.value]));
    return res.status(200).json({ settings });
  }

  if (req.method === 'PUT') {
    const { key, value } = req.body || {};
    if (!key) {
      return res.status(400).json({ error: 'Missing setting key' });
    }

    const normalizedValue = value ?? '';
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ key, value: normalizedValue, updated_at: new Date().toISOString() });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ok: true, key, value: normalizedValue });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).end();
}
