import { useEffect, useState } from 'react'; import { getSupabase } from '../lib/supabaseClient';
export default function Protected({children}){
  const supabase=getSupabase(); const [user,setUser]=useState(undefined);
  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setUser(data?.user||null)); },[]);
  if(user===undefined) return <p>Loading…</p>;
  if(!user) return <div className="card"><p>Please log in to view this page.</p></div>;
  return children;
}
