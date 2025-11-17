import { requireAdmin } from '../../../lib/adminGuard'; import { supabaseAdmin } from '../../../lib/supabaseAdmin';
export default async function handler(req,res){
  const { isAdmin } = await requireAdmin(req,res); if(!isAdmin) return res.status(403).json({error:'Admin only'});
  if(req.method==='GET'){
    const {data,error}=await supabaseAdmin
      .from('projects')
      .select('*')
      .order('featured',{ascending:false})
      .order('display_order',{ascending:true,nullsLast:true})
      .order('created_at',{ascending:false});
    if(error) return res.status(500).json({error:error.message});
    return res.status(200).json(data);
  }
  if(req.method==='POST'){
    const { id,...values } = req.body||{};
    const { error }=await supabaseAdmin.from('projects').insert(values);
    if(error) return res.status(500).json({error:error.message});
    return res.status(201).json({ok:true});
  }
  if(req.method==='PUT'){
    const { id,...values } = req.body||{};
    if(!id) return res.status(400).json({error:'Missing project id'});
    const { error } = await supabaseAdmin.from('projects').update(values).eq('id',id);
    if(error) return res.status(500).json({error:error.message});
    return res.status(200).json({ok:true});
  }
  if(req.method==='DELETE'){ const { id } = req.body||{}; const { error } = await supabaseAdmin.from('projects').delete().eq('id',id); if(error) return res.status(500).json({error:error.message}); return res.status(200).json({ok:true}); }
  return res.status(405).end();
}
