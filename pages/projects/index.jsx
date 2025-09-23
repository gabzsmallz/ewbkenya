import Layout from '../../components/Layout'; import { createClient } from '@supabase/supabase-js';
export async function getServerSideProps(){ const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); const {data:projects}=await s.from('projects').select('id,slug,title,summary,status').order('created_at',{ascending:false}); return { props:{ projects: projects||[] } }; }
export default function Projects({projects}){
  return(<Layout title="Projects"><h1 className="text-2xl font-bold mb-4">Projects</h1>
    <div className="grid md:grid-cols-2 gap-4">
      {Array.isArray(projects)&&projects.length?projects.map(p=>(
        <div key={p.id} className="card"><div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{p.title}</h3><span className="badge">{p.status}</span></div><p className="mt-2 text-sm text-gray-600">{p.summary||''}</p><a className="btn btn-primary mt-3" href={`/projects/${p.slug}`}>View</a></div>
      )):<p>No projects yet.</p>}
    </div></Layout>);
}
