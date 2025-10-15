import { requireAdmin } from '../../../lib/adminGuard'; import { supabaseAdmin } from '../../../lib/supabaseAdmin';
const sanitizePayload=(body)=>{
  const values={
    title:body?.title?.trim()||'',
    description:body?.description||'',
    link_label:body?.link_label||'',
    link_url:body?.link_url||'',
    sort_order:body?.sort_order
  };
  const parsed=parseInt(values.sort_order,10);
  values.sort_order=Number.isNaN(parsed)?0:parsed;
  return values;
};
export default async function handler(req,res){
  const { isAdmin } = await requireAdmin(req,res); if(!isAdmin) return res.status(403).json({error:'Admin only'});
  if(req.method==='GET'){
    const {data,error}=await supabaseAdmin.from('member_dashboard_items').select('*').order('sort_order',{ascending:true}).order('created_at',{ascending:false});
    if(error) return res.status(500).json({error:error.message});
    return res.status(200).json(data);
  }
  if(req.method==='POST'){
    const payload=sanitizePayload(req.body||{});
    if(!payload.title) return res.status(400).json({error:'Title is required'});
    const { error }=await supabaseAdmin.from('member_dashboard_items').insert(payload);
    if(error) return res.status(500).json({error:error.message});
    return res.status(201).json({ok:true});
  }
  if(req.method==='PUT'){
    const { id }=req.body||{}; if(!id) return res.status(400).json({error:'Missing item id'});
    const payload=sanitizePayload(req.body||{});
    if(!payload.title) return res.status(400).json({error:'Title is required'});
    const { error }=await supabaseAdmin.from('member_dashboard_items').update(payload).eq('id',id);
    if(error) return res.status(500).json({error:error.message});
    return res.status(200).json({ok:true});
  }
  if(req.method==='DELETE'){
    const { id }=req.body||{}; if(!id) return res.status(400).json({error:'Missing item id'});
    const { error }=await supabaseAdmin.from('member_dashboard_items').delete().eq('id',id);
    if(error) return res.status(500).json({error:error.message});
    return res.status(200).json({ok:true});
  }
  return res.status(405).end();
}
