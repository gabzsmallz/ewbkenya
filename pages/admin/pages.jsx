import dynamic from 'next/dynamic'; import Layout from '../../components/Layout'; import AdminOnly from '../../components/AdminOnly'; import { useEffect, useState } from 'react'; import UploadImage from '../../components/UploadImage'; import AdminShell from '../../components/AdminShell';
const ReactQuill = dynamic(()=>import('react-quill'),{ssr:false,loading:()=> <textarea className="w-full border rounded p-2" rows={6}/>}); import 'react-quill/dist/quill.snow.css';
export default function AdminPages(){
  const [page,setPage]=useState({slug:'home',title:'',content:'',hero_image_url:''}); const [busy,setBusy]=useState(false);
  const load=async()=>{ const r=await fetch('/api/admin/pages?slug=home'); const d=await r.json(); if(d) setPage(p=>({...p,...d})); }; useEffect(()=>{load();},[]);
  const save=async(e)=>{ e.preventDefault(); setBusy(true); const r=await fetch('/api/admin/pages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(page)}); setBusy(false); if(!r.ok) alert('Save failed'); };
  return(<Layout title="Admin • Pages"><AdminOnly><AdminShell>
    <div className="card shadow-brand"><h2 className="text-xl font-semibold mb-3">Landing Page Content</h2>
      <form onSubmit={save} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Title" value={page.title} onChange={e=>setPage({...page,title:e.target.value})}/>
        <div><label className="text-sm block mb-1">Hero Image</label><UploadImage onUploaded={(url)=>setPage({...page,hero_image_url:url})}/>{page.hero_image_url&&<img src={page.hero_image_url} className="mt-2 rounded" />}</div>
        <div><label className="text-sm block mb-1">Content</label><ReactQuill theme="snow" value={page.content||''} onChange={v=>setPage({...page,content:v})}/></div>
        <button className="btn btn-primary" disabled={busy}>{busy?'Saving…':'Save Page'}</button>
      </form>
    </div>
  </AdminShell></AdminOnly></Layout>);
}
