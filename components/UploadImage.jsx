import { useState } from 'react'; import { getSupabase } from '../lib/supabaseClient';
export default function UploadImage({ onUploaded, bucket='media' }){
  const supabase=getSupabase(); const [busy,setBusy]=useState(false); const [error,setError]=useState(null);
  const onFile=async(e)=>{ const file=e.target.files?.[0]; if(!file) return; setBusy(true); setError(null);
    try{ const ext=file.name.split('.').pop(); const path=`${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error:upErr } = await supabase.storage.from(bucket).upload(path,file,{upsert:false}); if(upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path); onUploaded?.(data.publicUrl);
    }catch(err){ setError(err.message||'Upload failed'); }finally{ setBusy(false); } };
  return(<div><input type="file" accept="image/*" onChange={onFile} disabled={busy}/>{busy&&<p className="text-sm text-gray-500 mt-1">Uploading…</p>}{error&&<p className="text-sm text-red-600 mt-1">{error}</p>}</div>);
}
