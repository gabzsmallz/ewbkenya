import { requireAdmin } from '../../../lib/adminGuard';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

function createUniquePath(filename = '') {
  const ext = filename.includes('.') ? filename.split('.').pop() : '';
  const safeExt = ext ? `.${ext.toLowerCase()}` : '';
  return `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  const { isAdmin } = await requireAdmin(req, res);
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bucket = 'media', base64, name, contentType } = req.body || {};
  if (!base64) {
    return res.status(400).json({ error: 'Missing file data' });
  }

  try {
    const path = createUniquePath(name);
    const buffer = Buffer.from(base64, 'base64');
    const { error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
      contentType: contentType || 'application/octet-stream',
      upsert: false,
    });

    if (error) {
      throw error;
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    return res.status(200).json({ url: data.publicUrl, path });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
