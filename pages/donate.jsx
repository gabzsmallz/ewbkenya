import Layout from '../components/Layout';
import { createClient } from '@supabase/supabase-js';

const defaultContent = {
  title: 'Donate',
  content:
    '<p>Support our projects. Use any of the options below.</p><ul><li><strong>Paybill/Till:</strong> <code>XXXXXX</code></li><li><strong>Bank:</strong> Account Name, Account No, Bank, Branch, SWIFT</li><li><strong>PayPal:</strong> <a href="#">Donate button</a></li></ul>',
};

export async function getServerSideProps() {
  const s = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: page } = await s
    .from('pages')
    .select('*')
    .eq('slug', 'donate')
    .single();

  return { props: { page: page || null } };
}

export default function Donate({ page }) {
  const title = page?.title || defaultContent.title;
  const content = page?.content || defaultContent.content;

  return (
    <Layout title={title || 'Donate'}>
      <div className="card shadow-brand">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--brand-primary)' }}
        >
          {title}
        </h1>
        <div
          className="mt-2 space-y-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </Layout>
  );
}
