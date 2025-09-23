import Layout from '../components/Layout'; import Link from 'next/link'; import { createClient } from '@supabase/supabase-js';
export async function getServerSideProps(){ const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); const {data:page}=await s.from('pages').select('*').eq('slug','home').single(); return { props:{ page: page||null } }; }
export default function Home({page}){
  const hero = page?.hero_image_url || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80';
  return(<Layout title="Home">
    <section className="grid md:grid-cols-2 gap-6 items-center">
      <div className="card">
        <h1 className="text-3xl font-bold">{page?.title || 'Our Mission'}</h1>
        <div className="mt-3 text-gray-700" dangerouslySetInnerHTML={{__html: page?.content || 'We are a nonprofit dedicated to impactful engineering projects.'}} />
        <div className="mt-6 space-x-3"><Link href="/projects" className="btn btn-primary">See Projects</Link><Link href="/donate" className="btn">Donate</Link></div>
      </div>
      <div className="card"><img alt="hero" src={hero} className="rounded-xl" /></div>
    </section>
  </Layout>);
}
