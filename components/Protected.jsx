import { useEffect, useState } from 'react';
export default function Protected({children}){
  const [state,setState]=useState({loading:true,allowed:false,message:'Please log in to view this page.'});
  useEffect(()=>{
    let active=true;
    const load=async()=>{
      try{
        const res=await fetch('/api/me');
        const body=await res.json().catch(()=>null);
        if(!active) return;
        const profile=body?.profile||null;
        const user=body?.user||null;
        if(res.ok&&profile&&(profile.role==='admin'||profile.role==='member')){
          setState({loading:false,allowed:true,message:''});
        }else if(res.ok&&user){
          setState({loading:false,allowed:false,message:'You do not have access to view this page.'});
        }else{
          setState({loading:false,allowed:false,message:'Please log in to view this page.'});
        }
      }catch(e){
        if(!active) return;
        setState({loading:false,allowed:false,message:'Unable to verify access right now.'});
      }
    };
    load();
    return ()=>{ active=false; };
  },[]);
  if(state.loading) return <p>Loading…</p>;
  if(!state.allowed) return <div className="card"><p>{state.message}</p></div>;
  return children;
}
