import { requireAdmin } from '../../lib/adminGuard';
export default async function handler(req,res){ const { user, isAdmin, profile } = await requireAdmin(req,res); res.status(200).json({ user, isAdmin, profile }); }
