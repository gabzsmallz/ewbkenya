import Link from 'next/link';
export default function ProjectCard({project}){
  return(<div className="card">
    <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{project.title}</h3><span className="badge">{project.status}</span></div>
    <p className="mt-2 text-sm text-gray-600">{project.summary||'No summary yet.'}</p>
    <div className="mt-4"><Link href={`/projects/${project.slug}`} className="btn btn-primary">View</Link></div>
  </div>);
}
