import { useEffect, useState } from 'react';
export default function AdminOnly({children}){
  const [state,setState]=useState({loading:true,ok:false});
  useEffect(()=>{ fetch('/api/me').then(r=>r.json()).then(d=>setState({loading:false,ok:d?.profile?.role==='admin'})).catch(()=>setState({loading:false,ok:false})); },[]);
  if(state.loading) return <div className="card"><p>Checking access…</p></div>;
  if(!state.ok) return <div className="card"><p>Admin access required.</p></div>;
  return children;
}
