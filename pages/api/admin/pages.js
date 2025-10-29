import { requireAdmin } from '../../../lib/adminGuard'; import { supabaseAdmin } from '../../../lib/supabaseAdmin';
export default async function handler(req,res){
  const { isAdmin } = await requireAdmin(req,res); if(!isAdmin) return res.status(403).json({error:'Admin only'});
  if(req.method==='GET'){ const { slug } = req.query; const { data, error } = await supabaseAdmin.from('pages').select('*').eq('slug',slug).single(); if(error && error.code!=='PGRST116') return res.status(500).json({error:error.message}); return res.status(200).json(data||null); }
  if(req.method==='POST'){
    const b=req.body||{};
    const row={
      slug:b.slug||'home',
      title:b.title,
      content:b.content,
      hero_image_url:b.hero_image_url,
      sections:b.sections||null
    };
    const { error } = await supabaseAdmin.from('pages').upsert(row,{onConflict:'slug'});
    if(error) return res.status(500).json({error:error.message});
    return res.status(200).json({ok:true});
  }
  return res.status(405).end();
}
