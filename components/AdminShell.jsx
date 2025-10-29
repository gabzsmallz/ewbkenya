import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/member-dashboard', label: 'Member Dashboard' },
  { href: '/admin/announcements', label: 'Announcements' },
  { href: '/admin/pages', label: 'Pages (Home & Donate)' },
  { href: '/admin/settings', label: 'Site Settings' }
];

export default function AdminShell({ children }) {
  const router = useRouter();
  const currentPath = router?.asPath?.split('?')[0].split('#')[0] || '';

  return (
    <div className="md:grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="card shadow-brand md:sticky md:top-24 h-max">
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-primary)' }}>
          Admin Menu
        </h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 transition-colors ${
                  isActive ? 'font-semibold shadow-sm' : 'hover:bg-gray-50'
                }`}
                style={{
                  color: isActive ? 'var(--brand-primary)' : 'var(--brand-text)',
                  backgroundColor: isActive ? 'var(--brand-tint)' : 'transparent'
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
