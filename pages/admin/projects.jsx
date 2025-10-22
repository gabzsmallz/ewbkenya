import Layout from '../../components/Layout'; import AdminOnly from '../../components/AdminOnly'; import UploadImage from '../../components/UploadImage'; import { useEffect, useState } from 'react'; import AdminShell from '../../components/AdminShell';
export default function AdminProjects(){
  const statusOptions=[
    {value:'planned',label:'Planned'},
    {value:'in_progress',label:'In Progress'},
    {value:'completed',label:'Completed'}
  ];
  const statusLabels=statusOptions.reduce((acc,opt)=>{acc[opt.value]=opt.label;return acc;},{});
  const [projects,setProjects]=useState([]);
  const blankForm=()=>({title:'',slug:'',summary:'',description:'',status:'planned',cover_image_url:''});
  const [form,setForm]=useState(blankForm);
  const [editingId,setEditingId]=useState(null);
  const [busy,setBusy]=useState(false);
  const load=async()=>{ try{ const r=await fetch('/api/admin/projects'); if(!r.ok){ setProjects([]); return; } const d=await r.json(); setProjects(Array.isArray(d)?d:[]);}catch{setProjects([]);} };
  useEffect(()=>{ load(); },[]);
  const startNew=()=>{ setEditingId(null); setForm(blankForm()); };
  const startEdit=(project)=>{
    setEditingId(project.id);
    setForm({
      title:project.title||'',
      slug:project.slug||'',
      summary:project.summary||'',
      description:project.description||'',
      status:project.status||'planned',
      cover_image_url:project.cover_image_url||''
    });
  };
  const save=async(e)=>{
    e.preventDefault();
    setBusy(true);
    const method=editingId?'PUT':'POST';
    const payload=editingId?{...form,id:editingId}:form;
    const r=await fetch('/api/admin/projects',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    setBusy(false);
    if(r.ok){ startNew(); load(); } else alert('Save failed'); };
  const cancelEdit=()=>{ startNew(); };
  const del=async(id)=>{ if(!confirm('Delete project?')) return; const r=await fetch('/api/admin/projects',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); if(r.ok) load(); };
  return(<Layout title="Admin • Projects"><AdminOnly><AdminShell>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card shadow-brand"><h2 className="text-xl font-semibold mb-3">{editingId?'Edit Project':'Create Project'}</h2>
        <form onSubmit={save} className="space-y-2">
          <input className="w-full border rounded p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <input className="w-full border rounded p-2" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/>
          <input className="w-full border rounded p-2" placeholder="Summary" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})}/>
          <textarea className="w-full border rounded p-2" rows={4} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <select className="w-full border rounded p-2" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
            {statusOptions.map(option=>(
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <div><label className="text-sm">Cover Image</label><UploadImage onUploaded={(url)=>setForm({...form,cover_image_url:url})}/>{form.cover_image_url&&<img src={form.cover_image_url} className="mt-2 rounded" />}</div>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" disabled={busy}>{busy?'Saving…':editingId?'Update Project':'Save Project'}</button>
            {editingId&&<button type="button" className="btn" onClick={cancelEdit} disabled={busy}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="card shadow-brand"><div className="flex items-center justify-between mb-3"><h2 className="text-xl font-semibold">Projects</h2>{editingId&&<button className="btn btn-ghost" onClick={startNew}>New Project</button>}</div>
        <div className="space-y-3">{Array.isArray(projects)&&projects.length?projects.map(p=>(<div key={p.id} className={`border rounded p-3 ${editingId===p.id?'border-brand-500':'border-gray-200'}`}><div className="flex items-center justify-between"><div><div className="font-semibold">{p.title}</div><div className="text-xs text-gray-500">{p.slug} • {statusLabels[p.status]||p.status}</div></div><div className="flex items-center gap-2"><button className="btn btn-ghost" onClick={()=>startEdit(p)}>Edit</button><button className="btn btn-ghost" onClick={()=>del(p.id)}>Delete</button></div></div></div>)):<p>No projects yet.</p>}</div>
      </div>
    </div>
  </AdminShell></AdminOnly></Layout>);
}
