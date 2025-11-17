import Layout from '../../components/Layout'; import { createClient } from '@supabase/supabase-js';
export async function getServerSideProps(){ const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); const {data:projects}=await s.from('projects').select('id,slug,title,summary,status,cover_image_url,featured,display_order').order('featured',{ascending:false}).order('display_order',{ascending:true,nullsLast:true}).order('created_at',{ascending:false}); return { props:{ projects: projects||[] } }; }
export default function Projects({projects}){
  const safeProjects=Array.isArray(projects)?projects:[];
  const statusLabels={
    planned:'Planned',
    in_progress:'In Progress',
    completed:'Completed'
  };
  const formatStatus=(status)=>{
    if(!status) return 'Unknown';
    if(statusLabels[status]) return statusLabels[status];
    return status
      .replace(/_/g,' ')
      .replace(/\b\w/g,(char)=>char.toUpperCase());
  };
  const totalProjects = safeProjects.length;
  const statusCounts = safeProjects.reduce((acc, project) => {
    const status = project.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const statusEntries = Object.entries(statusCounts);
  const palette = ['#2563eb', '#f97316', '#10b981', '#6366f1', '#f59e0b', '#ef4444'];
  let cumulativeAngle = 0;
  const gradientSegments = statusEntries.map(([status, count], index) => {
    const startAngle = cumulativeAngle;
    const sliceAngle = totalProjects ? (count / totalProjects) * 360 : 0;
    cumulativeAngle += sliceAngle;
    const color = palette[index % palette.length];
    return `${color} ${startAngle}deg ${startAngle + sliceAngle}deg`;
  }).join(', ');
  const featuredProject=safeProjects.find(project=>project.featured);
  const otherProjects=featuredProject?safeProjects.filter(p=>p.id!==featuredProject.id):safeProjects;

  return(<Layout title="Projects"><h1 className="text-2xl font-bold mb-4" style={{color:'var(--brand-primary)'}}>Projects</h1>
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Total Projects</p>
          <p className="text-3xl font-bold" style={{color:'var(--brand-primary)'}}>{totalProjects}</p>
        </div>
        <div className="flex items-center gap-6">
          <div
            className="h-32 w-32 rounded-full border border-gray-100 shadow-inner"
            style={{
              background: totalProjects ? `conic-gradient(${gradientSegments})` : '#e5e7eb'
            }}
          />
          <div className="space-y-2">
            {statusEntries.map(([status, count], index) => (
              <div key={status} className="flex items-center gap-3 text-sm">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{backgroundColor: palette[index % palette.length]}}
                />
                <span className="font-medium text-gray-700">{formatStatus(status)}</span>
                <span className="text-gray-500">{count}</span>
              </div>
            ))}
            {!statusEntries.length && (
              <p className="text-sm text-gray-500">No project data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    {featuredProject&&(
      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-brand md:flex md:items-center md:gap-8">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">Featured Project</p>
          <h2 className="mt-2 text-2xl font-bold" style={{color:'var(--brand-primary)'}}>{featuredProject.title}</h2>
          <p className="mt-2 text-sm text-gray-600">{featuredProject.summary||'Learn more about our highlighted initiative.'}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="badge bg-amber-100 text-amber-700">{formatStatus(featuredProject.status)}</span>
            <a className="btn btn-primary" href={`/projects/${featuredProject.slug}`}>Explore Project</a>
          </div>
        </div>
        {featuredProject.cover_image_url&&(
          <img
            src={featuredProject.cover_image_url}
            alt={`${featuredProject.title} cover image`}
            className="mt-4 h-52 w-full rounded-xl object-cover md:mt-0 md:w-1/2"
          />
        )}
      </div>
    )}
    <div className="grid md:grid-cols-2 gap-4">
      {otherProjects.length?otherProjects.map(p=>(
        <div key={p.id} className="card shadow-brand relative">
          <span className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{background:'linear-gradient(var(--brand-primary), var(--brand-accent))'}}/>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <span className="badge">{formatStatus(p.status)}</span>
          </div>
          {p.cover_image_url&&(
            <img
              src={p.cover_image_url}
              alt={`${p.title} cover image`}
              className="rounded mt-3 w-full max-h-60 object-cover"
            />
          )}
          <p className="mt-2 text-sm text-gray-600">{p.summary||''}</p>
          <a className="btn btn-primary mt-3" href={`/projects/${p.slug}`}>View</a>
        </div>
      )):<p className="text-gray-600">{featuredProject?'No additional projects yet.':'No projects yet.'}</p>}
    </div></Layout>);
}
