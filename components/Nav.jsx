import Link from 'next/link'; import { getSupabase } from '../lib/supabaseClient'; import { useEffect, useState } from 'react';
export default function Nav(){
  const supabase=getSupabase(); const [user,setUser]=useState(null);
  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setUser(data?.user||null)); },[]);
  const logout=async()=>{ await supabase.auth.signOut(); window.location.href='/'; };
  return(<nav className="bg-white/80 backdrop-blur border-b" style={{borderColor:'var(--brand-tint)'}}>
    <div className="container flex items-center justify-between py-3">
      <Link href="/" className="font-semibold" style={{color:'var(--brand-primary)'}}>EWB Kenya Community</Link>
      <div className="space-x-4">
        <Link href="/projects" style={{color:'var(--brand-text)'}}>Projects</Link>
        <Link href="/donate" style={{color:'var(--brand-text)'}}>Donate</Link>
        {user?(<>
          <Link href="/member" className="btn btn-ghost">Member</Link>
          <Link href="/admin/projects" className="btn btn-primary">Admin</Link>
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </>):(<Link href="/member" className="btn btn-ghost">Login</Link>)}
      </div>
    </div>
  </nav>);
}
