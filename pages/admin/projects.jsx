import Layout from '../../components/Layout'; import AdminOnly from '../../components/AdminOnly'; import { useEffect, useState } from 'react'; import UploadImage from '../../components/UploadImage';
export default function AdminProjects(){
  const [projects,setProjects]=useState([]);
  const [form,setForm]=useState({title:'',slug:'',summary:'',description:'',status:'planned',cover_image_url:''});
  const [busy,setBusy]=useState(false);
  const load=async()=>{ const r=await fetch('/api/admin/projects'); setProjects(await r.json()||[]); }; useEffect(()=>{load();},[]);
  const save=async(e)=>{ e.preventDefault(); setBusy(true);
    const r=await fetch('/api/admin/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    setBusy(false); if(r.ok){ setForm({title:'',slug:'',summary:'',description:'',status:'planned',cover_image_url:''}); load(); } else alert('Save failed');
  };
  const del=async(id)=>{ if(!confirm('Delete project?')) return;
    const r=await fetch('/api/admin/projects',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
    if(r.ok) load(); else alert('Delete failed');
  };
  return(<Layout title="Admin • Projects"><AdminOnly>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card"><h2 className="text-xl font-semibold mb-3">Create / Edit Project</h2>
        <form onSubmit={save} className="space-y-2">
          <input className="w-full border rounded p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <input className="w-full border rounded p-2" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/>
          <input className="w-full border rounded p-2" placeholder="Summary" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})}/>
          <textarea className="w-full border rounded p-2" rows={4} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <select className="w-full border rounded p-2" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
            <option value="planned">planned</option><option value="in_progress">in_progress</option><option value="completed">completed</option>
          </select>
          <div><label className="text-sm">Cover Image</label><UploadImage onUploaded={(url)=>setForm({...form,cover_image_url:url})}/>{form.cover_image_url&&<img src={form.cover_image_url} className="mt-2 rounded"/>}</div>
          <button className="btn btn-primary" disabled={busy}>{busy?'Saving…':'Save Project'}</button>
        </form>
      </div>
      <div className="card"><h2 className="text-xl font-semibold mb-3">Projects</h2>
        <div className="space-y-3">{projects.map(p=>(<div key={p.id} className="border rounded p-3">
          <div className="flex items-center justify-between"><div><div className="font-semibold">{p.title}</div><div className="text-xs text-gray-500">{p.slug} • {p.status}</div></div>
          <button className="btn" onClick={()=>del(p.id)}>Delete</button></div></div>))}{projects.length===0&&<p>No projects yet.</p>}</div>
      </div>
    </div>
  </AdminOnly></Layout>);
}
