import Layout from '../../components/Layout'; import Protected from '../../components/Protected'; import { createClient } from '@supabase/supabase-js'; import { useEffect, useState } from 'react'; import { getSupabase } from '../../lib/supabaseClient';
export async function getServerSideProps({ params }){
  const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: project } = await s.from('projects').select('*').eq('slug',params.slug).single();
  const { data: updates } = await s.from('project_updates').select('*').eq('project_id',project?.id||-1).order('created_at',{ascending:false});
  return { props:{ project: project||null, updates: updates||[] } };
}
export default function Project({ project, updates }){
  const supabase=getSupabase();
  const [message,setMessage]=useState('');
  const [skills,setSkills]=useState('');
  const [availability,setAvailability]=useState('');
  const [posting,setPosting]=useState(false);
  const [status,setStatus]=useState(null);
  const [loadingSignup,setLoadingSignup]=useState(true);
  const [hasSignup,setHasSignup]=useState(false);
  useEffect(()=>{
    let active=true;
    const loadSignup=async()=>{
      if(!project?.id){ if(active) setLoadingSignup(false); return; }
      setLoadingSignup(true);
      try{
        const { data } = await supabase.auth.getUser();
        if(!active) return;
        if(!data?.user){ setLoadingSignup(false); return; }
        const res=await fetch(`/api/project-signup?projectId=${project.id}`);
        const body=await res.json().catch(()=>null);
        if(!active) return;
        if(!res.ok){ if(res.status===403&&body?.error) setStatus({type:'error',text:body.error}); return; }
        if(body?.signup){
          setMessage(body.signup.message||'');
          setSkills(body.signup.skills||'');
          setAvailability(body.signup.availability||'');
          setHasSignup(true);
        }else{
          setMessage(''); setSkills(''); setAvailability(''); setHasSignup(false);
        }
      }catch(e){
        if(active) setStatus({type:'error',text:'Unable to load your volunteer details right now.'});
      }finally{
        if(active) setLoadingSignup(false);
      }
    };
    loadSignup();
    return()=>{ active=false; };
  },[project?.id,supabase]);
  if(!project) return <Layout><p>Not found.</p></Layout>;
  const signup=async(e)=>{
    e.preventDefault(); if(posting) return; setPosting(true); setStatus(null);
    try{
      const res=await fetch('/api/project-signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId:project.id,message,skills,availability})});
      const body=await res.json().catch(()=>null);
      if(res.ok){ setStatus({type:'success',text:body?.message||'Your volunteer information has been saved.'}); setHasSignup(true); }
      else{ setStatus({type:'error',text:body?.error||'Failed to save your volunteer information.'}); }
    }catch(err){
      setStatus({type:'error',text:'Failed to save your volunteer information.'});
    }finally{ setPosting(false); }
  };
  return(<Layout title={project.title}>
    <div className="card shadow-brand">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{color:'var(--brand-primary)'}}>{project.title}</h1>
        <span className="badge">{project.status}</span>
      </div>
      {project.cover_image_url&&(
        <img src={project.cover_image_url} alt={`${project.title} cover image`} className="rounded mt-3 w-full max-h-96 object-cover" />
      )}
      <p className="mt-3">{project.description}</p>
    </div>
    <h2 className="text-xl font-semibold mt-6 mb-2">Updates</h2>
    <div className="grid gap-3">
      {updates.map(u=>(
        <div key={u.id} className="card">
          <p className="text-sm text-gray-500">{new Date(u.created_at).toLocaleString()}</p>
          <p className="mt-2">{u.body}</p>
          {u.image_url&&<img src={u.image_url} className="rounded mt-2" alt="Project update" />}
        </div>
      ))}
      {updates.length===0&&<p>No updates yet.</p>}
    </div>
    <Protected>
      <div className="card mt-6">
        <h3 className="font-semibold mb-2">Volunteer for this project</h3>
        <p className="text-sm text-gray-600">Tell us how you can support this project and when you're available.</p>
        <form className="space-y-3 mt-3" onSubmit={signup}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills you can contribute</label>
            <textarea className="w-full border rounded p-2 mt-1" rows={3} value={skills} onChange={e=>setSkills(e.target.value)} placeholder="e.g. Structural analysis, CAD modeling" disabled={loadingSignup||posting} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <textarea className="w-full border rounded p-2 mt-1" rows={2} value={availability} onChange={e=>setAvailability(e.target.value)} placeholder="e.g. Weekends only, 5 hours per week" disabled={loadingSignup||posting} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Anything else we should know?</label>
            <textarea className="w-full border rounded p-2 mt-1" rows={3} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Share any other notes" disabled={loadingSignup||posting} />
          </div>
          {status&&<p className={`text-sm ${status.type==='error'?'text-red-600':'text-green-600'}`}>{status.text}</p>}
          {loadingSignup&&<p className="text-sm text-gray-500">Loading your volunteer details…</p>}
          <button className="btn btn-primary" type="submit" disabled={posting||loadingSignup}>{posting?'Saving…':hasSignup?'Update volunteer info':'Save volunteer info'}</button>
        </form>
      </div>
    </Protected>
  </Layout>);
}
