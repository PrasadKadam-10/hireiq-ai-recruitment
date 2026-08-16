'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileSearch, Search } from 'lucide-react';

/* ── Logo mark ── */
function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.28),
      background: 'linear-gradient(135deg, var(--violet-600) 0%, var(--violet-700) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(100,64,221,0.35)',
    }}>
      <span style={{ fontSize: Math.round(size * 0.55), fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: 'var(--font-display)' }}>H</span>
    </div>
  );
}

function DashNav() {
  const path = usePathname();

  const navItems = [
    { label: 'Overview',   href: '/dashboard', exact: true },
    { label: 'Analyzer',   href: '/submit' },
    { label: 'Candidates', href: '/candidates' },
    { label: 'Jobs',       href: '/jobs' },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? path === href : path.startsWith(href);

  return (
    <nav className="topnav-bar" aria-label="Main navigation">
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginRight: 28, flexShrink: 0 }}>
        <LogoMark size={30} />
        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>HireIQ</span>
      </Link>

      {/* Nav pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {navItems.map(({ label, href, exact }) => {
          const on = isActive(href, exact);
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center',
              padding: '6px 14px', borderRadius: 8,
              fontSize: 13, fontWeight: on ? 600 : 400,
              color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: on ? 'var(--violet-50)' : 'transparent',
              textDecoration: 'none',
              border: on ? '1px solid var(--violet-200)' : '1px solid transparent',
              transition: 'all 120ms ease',
            }}
              onMouseEnter={e => { if (!on) { (e.currentTarget as HTMLElement).style.background = 'var(--bg-muted)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; } }}
              onMouseLeave={e => { if (!on) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; } }}
              aria-current={on ? 'page' : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <button style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-secondary)', padding: '7px', borderRadius: 8,
        display: 'flex', alignItems: 'center',
        transition: 'background 120ms ease',
      }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-muted)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
        aria-label="Search"
      >
        <Search size={17} />
      </button>

      {/* CTA */}
      <Link href="/submit" className="btn btn-primary btn-sm" style={{ marginLeft: 8 }}>
        <FileSearch size={14} /> Analyze Resume
      </Link>
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="topnav-layout">
      <DashNav />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
