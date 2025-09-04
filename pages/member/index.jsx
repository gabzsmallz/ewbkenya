import Layout from '../../components/Layout'; import Protected from '../../components/Protected'; import { getSupabase } from '../../lib/supabaseClient';
export default function Member(){
  const supabase=getSupabase();
  const login=async()=>{ const email=prompt('Enter your email for magic link'); if(!email) return;
    const {error}=await supabase.auth.signInWithOtp({email}); if(error) alert(error.message); else alert('Check your email for a login link.');
  };
  return(<Layout title="Member">
    <Protected><div className="card"><h1 className="text-2xl font-bold">Member Dashboard</h1><p className="mt-2">Welcome! See announcements and your sign-ups.</p><a href="/member/announcements" className="btn btn-primary mt-4">Announcements</a></div></Protected>
    <div className="card mt-6"><h2 className="font-semibold">Not logged in?</h2><button onClick={login} className="btn btn-primary mt-2">Email Magic Link</button></div>
  </Layout>);
}
