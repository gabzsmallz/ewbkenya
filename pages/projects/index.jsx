import Layout from '../../components/Layout'; import ProjectCard from '../../components/ProjectCard'; import { createClient } from '@supabase/supabase-js';
export async function getServerSideProps(){
  const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const {data:projects}=await supabase.from('projects').select('id,slug,title,summary,status').order('created_at',{ascending:false});
  return { props:{ projects: projects||[] } };
}
export default function Projects({projects}){
  return(<Layout title="Projects">
    <h1 className="text-2xl font-bold mb-4">Projects</h1>
    <div className="grid md:grid-cols-2 gap-4">{projects.map(p=><ProjectCard key={p.id} project={p}/>)}
    {projects.length===0&&<p>No projects yet.</p>}</div>
  </Layout>);
}
