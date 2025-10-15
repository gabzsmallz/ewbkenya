import Layout from '../../components/Layout';
import AdminOnly from '../../components/AdminOnly';
import AdminShell from '../../components/AdminShell';

export default function Admin(){
  return (
    <Layout title="Admin">
      <AdminOnly>
        <AdminShell>
          <div className="card shadow-brand">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
              Admin Overview
            </h1>
            <p className="mt-3 text-sm md:text-base">
              Use the menu to manage projects, member dashboard content, and announcements for the community.
            </p>
            <p className="mt-2 text-sm md:text-base">
              Access each section to create, update, or remove content as needed. Changes are saved instantly for members.
            </p>
          </div>
        </AdminShell>
      </AdminOnly>
    </Layout>
  );
}
