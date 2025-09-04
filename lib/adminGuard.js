import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
export async function requireAdmin(req,res){
  const supabase=createPagesServerClient({req,res});
  const { data:{ user } } = await supabase.auth.getUser();
  if(!user) return {user:null,isAdmin:false,profile:null};
  const { data:profile } = await supabase.from('profiles').select('id,role,full_name,email').eq('id',user.id).single();
  const isAdmin = profile?.role==='admin';
  return { user, isAdmin, profile };
}
