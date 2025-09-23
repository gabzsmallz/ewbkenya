import { requireAdmin } from '../../../lib/adminGuard'; import { supabaseAdmin } from '../../../lib/supabaseAdmin';
export default async function handler(req,res){
  const { isAdmin } = await requireAdmin(req,res); if(!isAdmin) return res.status(403).json({error:'Admin only'});
  if(req.method==='GET'){ const {data,error}=await supabaseAdmin.from('announcements').select('*').order('created_at',{ascending:false}); if(error) return res.status(500).json({error:error.message}); return res.status(200).json(data); }
  if(req.method==='POST'){ const { error }=await supabaseAdmin.from('announcements').insert(req.body||{}); if(error) return res.status(500).json({error:error.message}); return res.status(200).json({ok:true}); }
  if(req.method==='DELETE'){ const { id } = req.body||{}; const { error } = await supabaseAdmin.from('announcements').delete().eq('id',id); if(error) return res.status(500).json({error:error.message}); return res.status(200).json({ok:true}); }
  return res.status(405).end();
}
