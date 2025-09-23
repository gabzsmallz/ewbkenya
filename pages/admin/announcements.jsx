import Layout from '../../components/Layout'; import AdminOnly from '../../components/AdminOnly'; import { useEffect, useState } from 'react';
export default function AdminAnnouncements(){
  const [items,setItems]=useState([]); const [form,setForm]=useState({title:'',body:'',visible_to:'members'}); const [busy,setBusy]=useState(false);
  const load=async()=>{ try{ const r=await fetch('/api/admin/announcements'); if(!r.ok){ setItems([]); return; } const d=await r.json(); setItems(Array.isArray(d)?d:[]);}catch{setItems([]);} }; useEffect(()=>{load();},[]);
  const save=async(e)=>{ e.preventDefault(); setBusy=True; const r=await fetch('/api/admin/announcements',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setBusy(false); if(r.ok){ setForm({title:'',body:'',visible_to:'members'}); load(); } };
  const del=async(id)=>{ if(!confirm('Delete announcement?')) return; const r=await fetch('/api/admin/announcements',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); if(r.ok) load(); };
  return(<Layout title="Admin • Announcements"><AdminOnly>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card"><h2 className="text-xl font-semibold mb-3">Create Announcement</h2>
        <form onSubmit={save} className="space-y-2">
          <input className="w-full border rounded p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <textarea className="w-full border rounded p-2" rows={5} placeholder="Body" value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/>
          <select className="w-full border rounded p-2" value={form.visible_to} onChange={e=>setForm({...form,visible_to:e.target.value})}><option value="members">members</option><option value="admins">admins</option></select>
          <button className="btn btn-primary" disabled={busy}>{busy?'Saving…':'Post'}</button>
        </form>
      </div>
      <div className="card"><h2 className="text-xl font-semibold mb-3">Announcements</h2>
        <div className="space-y-3">{Array.isArray(items)&&items.length?items.map(a=>(<div key={a.id} className="border rounded p-3"><div className="flex items-center justify-between"><div><div className="font-semibold">{a.title}</div><div className="text-xs text-gray-500">{new Date(a.created_at).toLocaleString()} • {a.visible_to}</div></div><button className="btn" onClick={()=>del(a.id)}>Delete</button></div></div>)):<p>No announcements yet.</p>}</div>
      </div>
    </div>
  </AdminOnly></Layout>);
}
