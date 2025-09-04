import Layout from '../../components/Layout';
export default function Admin(){return(<Layout title="Admin">
  <div className="card"><h1 className="text-2xl font-bold">Admin</h1>
    <ul className="list-disc ml-6 mt-3"><li><a href="/admin/projects">Projects</a></li><li><a href="/admin/announcements">Announcements</a></li><li><a href="/admin/pages">Pages (Landing)</a></li></ul>
  </div>
</Layout>);}
