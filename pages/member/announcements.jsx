import Layout from '../../components/Layout'; import Protected from '../../components/Protected'; import { createClient } from '@supabase/supabase-js';
export async function getServerSideProps(){
  const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const {data:announcements}=await supabase.from('announcements').select('*').order('created_at',{ascending:false});
  return { props:{ announcements: announcements||[] } };
}
export default function Announcements({announcements}){
  return(<Layout title="Announcements">
    <Protected>
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      <div className="grid gap-3">{announcements.map(a=>(<div key={a.id} className="card"><h3 className="font-semibold">{a.title}</h3><p className="text-sm text-gray-500">{new Date(a.created_at).toLocaleString()}</p><p className="mt-2">{a.body}</p></div>))}{announcements.length===0&&<p>No announcements yet.</p>}</div>
    </Protected>
  </Layout>);
}
