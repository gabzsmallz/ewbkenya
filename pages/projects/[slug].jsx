import Layout from '../../components/Layout'; import Protected from '../../components/Protected'; import { createClient } from '@supabase/supabase-js'; import { useState } from 'react';
export async function getServerSideProps({params}){ const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); const {data:project}=await s.from('projects').select('*').eq('slug',params.slug).single(); const {data:updates}=await s.from('project_updates').select('*').eq('project_id',project?.id||-1).order('created_at',{ascending:false}); return { props:{ project: project||null, updates: updates||[] } }; }
export default function Project({project,updates}){
  const [message,setMessage]=useState(''); const [posting,setPosting]=useState(false);
  if(!project) return <Layout><p>Not found.</p></Layout>;
  const signup=async()=>{ setPosting(true); const r=await fetch('/api/project-signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId:project.id,message})}); setPosting(false); alert(r.ok?'Signed up!':'Failed.'); };
  return(<Layout title={project.title}>
    <div className="card"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">{project.title}</h1><span className="badge">{project.status}</span></div><p className="mt-3">{project.description}</p></div>
    <h2 className="text-xl font-semibold mt-6 mb-2">Updates</h2>
    <div className="grid gap-3">{updates.map(u=>(<div key={u.id} className="card"><p className="text-sm text-gray-500">{new Date(u.created_at).toLocaleString()}</p><p className="mt-2">{u.body}</p>{u.image_url&&<img src={u.image_url} className="rounded mt-2" />}</div>))}{updates.length===0&&<p>No updates yet.</p>}</div>
    <Protected><div className="card mt-6"><h3 className="font-semibold mb-2">Volunteer for this project</h3><textarea className="w-full border rounded p-2" rows={3} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Skills, availability" /><button className="btn btn-primary mt-3" onClick={signup} disabled={posting}>{posting?'Submitting…':'Sign up'}</button></div></Protected>
  </Layout>);
}
