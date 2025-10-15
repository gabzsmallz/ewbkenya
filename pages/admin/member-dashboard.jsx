import Layout from '../../components/Layout'; import AdminOnly from '../../components/AdminOnly'; import { useEffect, useState } from 'react'; import AdminShell from '../../components/AdminShell';
const blankForm=()=>({title:'',description:'',link_label:'',link_url:'',sort_order:0});
export default function AdminMemberDashboard(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState(()=>blankForm());
  const [editingId,setEditingId]=useState(null);
  const [busy,setBusy]=useState(false);
  const load=async()=>{ try{ const r=await fetch('/api/admin/member-dashboard'); if(!r.ok){ setItems([]); return; } const d=await r.json(); setItems(Array.isArray(d)?d:[]);}catch{setItems([]);} };
  useEffect(()=>{ load(); },[]);
  const startNew=()=>{ setEditingId(null); setForm(blankForm()); };
  const startEdit=(item)=>{ setEditingId(item.id); setForm({ title:item.title||'', description:item.description||'', link_label:item.link_label||'', link_url:item.link_url||'', sort_order:typeof item.sort_order==='number'?item.sort_order:parseInt(item.sort_order,10)||0 }); };
  const save=async(e)=>{
    e.preventDefault();
    if(!form.title.trim()){ alert('Title is required'); return; }
    setBusy(true);
    const payload={...form,sort_order:Number.isNaN(parseInt(form.sort_order,10))?0:parseInt(form.sort_order,10)};
    const method=editingId?'PUT':'POST';
    const body=editingId?{...payload,id:editingId}:payload;
    const r=await fetch('/api/admin/member-dashboard',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    setBusy(false);
    if(r.ok){ startNew(); load(); } else alert('Save failed');
  };
  const cancelEdit=()=>{ startNew(); };
  const del=async(id)=>{ if(!confirm('Delete item?')) return; const r=await fetch('/api/admin/member-dashboard',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); if(r.ok) load(); };
  return(<Layout title="Admin • Member Dashboard"><AdminOnly><AdminShell>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card shadow-brand"><h2 className="text-xl font-semibold mb-3">{editingId?'Edit Item':'Create Item'}</h2>
        <form onSubmit={save} className="space-y-2">
          <input className="w-full border rounded p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <textarea className="w-full border rounded p-2" rows={3} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <input className="w-full border rounded p-2" placeholder="Button Label" value={form.link_label} onChange={e=>setForm({...form,link_label:e.target.value})}/>
          <input className="w-full border rounded p-2" placeholder="Button URL" value={form.link_url} onChange={e=>setForm({...form,link_url:e.target.value})}/>
          <input className="w-full border rounded p-2" type="number" placeholder="Sort Order" value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})}/>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" disabled={busy}>{busy?'Saving…':editingId?'Update Item':'Save Item'}</button>
            {editingId&&<button type="button" className="btn" onClick={cancelEdit} disabled={busy}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="card shadow-brand"><div className="flex items-center justify-between mb-3"><h2 className="text-xl font-semibold">Dashboard Items</h2>{editingId&&<button className="btn btn-ghost" onClick={startNew}>New Item</button>}</div>
        <div className="space-y-3">{Array.isArray(items)&&items.length?items.map(item=>(<div key={item.id} className={`border rounded p-3 ${editingId===item.id?'border-brand-500':'border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-gray-500">Order: {item.sort_order}</div>
              {item.description&&<p className="text-sm mt-1">{item.description}</p>}
              {(item.link_label||item.link_url)&&<p className="text-xs text-gray-500 mt-1">{item.link_label} → {item.link_url}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost" onClick={()=>startEdit(item)}>Edit</button>
              <button className="btn btn-ghost" onClick={()=>del(item.id)}>Delete</button>
            </div>
          </div>
        </div>)):<p>No dashboard items yet.</p>}</div>
      </div>
    </div>
  </AdminShell></AdminOnly></Layout>);
}
