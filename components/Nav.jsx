import Link from 'next/link';
import { getSupabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
export default function Nav(){
  const supabase=getSupabase(); const [user,setUser]=useState(null);
  useEffect(()=>{supabase.auth.getUser().then(({data})=>setUser(data?.user||null));},[]);
  const logout=async()=>{await supabase.auth.signOut(); window.location.href='/';};
  return(<nav className="bg-white shadow">
    <div className="container flex items-center justify-between py-3">
      <Link href="/" className="font-semibold">Org Portal</Link>
      <div className="space-x-4">
        <Link href="/projects">Projects</Link>
        <Link href="/donate">Donate</Link>
        {user?(<><Link href="/member">Member</Link><Link href="/admin/projects">Admin</Link><button className="btn" onClick={logout}>Logout</button></>):(<Link href="/member">Login</Link>)}
      </div>
    </div>
  </nav>);
}
