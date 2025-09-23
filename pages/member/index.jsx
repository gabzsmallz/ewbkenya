import Layout from '../../components/Layout'; import Protected from '../../components/Protected'; import { getSupabase } from '../../lib/supabaseClient';
export default function Member(){
  const supabase=getSupabase();
  const login=async()=>{ const email=prompt('Enter your email for magic link'); if(!email) return; const {error}=await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: (process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')+'/member' } }); if(error) alert(error.message); else alert('Check your email for the login link.'); };
  return(<Layout title="Member"><Protected><div className="card"><h1 className="text-2xl font-bold">Member Dashboard</h1><a className="btn btn-primary mt-4" href="/member/announcements">Announcements</a></div></Protected><div className="card mt-6"><h2 className="font-semibold">Not logged in?</h2><button className="btn btn-primary mt-2" onClick={login}>Email Magic Link</button></div></Layout>);
}
