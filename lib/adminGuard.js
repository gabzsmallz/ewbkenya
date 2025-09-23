import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
export async function requireAdmin(req,res){
  const supabase=createPagesServerClient({req,res});
  const { data:{ user } } = await supabase.auth.getUser();
  if(!user) return { user:null, isAdmin:false, profile:null };
  const { data: profile } = await supabase.from('profiles').select('id,role,email,full_name').eq('id', user.id).single();
  return { user, isAdmin: profile?.role==='admin', profile };
}
