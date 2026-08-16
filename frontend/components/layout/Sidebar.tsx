'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, FileSearch, X } from 'lucide-react';

const nav = [
  { label: 'Overview',        href: '/',          icon: LayoutDashboard, exact: true },
  { label: 'Resume Analyzer', href: '/submit',     icon: FileSearch },
  { label: 'Candidates',      href: '/candidates', icon: Users },
  { label: 'Jobs',            href: '/jobs',       icon: Briefcase },
];

/* ── Same mark used on the landing page navbar — keep this in sync if it changes there ── */
function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.28),
      background: 'linear-gradient(150deg, var(--violet-400, #9c82df) 0%, var(--violet-700, #5030b3) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 4px 12px rgba(100,64,221,0.35)',
    }}>
      <svg viewBox="0 0 24 24" width={Math.round(size * 0.5)} height={Math.round(size * 0.5)} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2.4" /><circle cx="5" cy="19" r="2.4" /><circle cx="19" cy="19" r="2.4" />
        <path d="M12 7.4V13M9.6 17.4 12 13l2.4 4.4" />
      </svg>
    </div>
  );
}

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const path = usePathname();
  const isActive = (href: string, exact?: boolean) => exact ? path === href : path.startsWith(href);

  return (
    <>
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`sidebar${open ? ' open' : ''}`}
        aria-label="Main navigation"
        style={{ background: 'linear-gradient(185deg, var(--ink-900, #1e1930) 0%, var(--ink-950, #171325) 100%)' }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <LogoMark size={36} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'var(--font-display, "Sora", sans-serif)' }}>
                HireIQ
              </div>
              <div style={{ fontSize: 9, fontWeight: 600, color: '#9490b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                AI Recruitment
              </div>
            </div>
          </Link>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9490b8', padding: 4 }} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#9490b8', padding: '4px 10px 10px', opacity: 0.7,
          }}>
            Platform
          </p>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {nav.map(({ label, href, icon: Icon, exact }) => {
              const on = isActive(href, exact);
              return (
                <Link key={href} href={href} onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', borderRadius: 9,
                    fontSize: 13, fontWeight: on ? 600 : 400,
                    color: on ? '#ffffff' : '#a8a3c4',
                    background: on ? 'linear-gradient(135deg, rgba(124,92,240,0.28), rgba(80,48,179,0.28))' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 140ms ease',
                    border: on ? '1px solid rgba(124,92,240,0.35)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => { if (!on) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { if (!on) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  aria-current={on ? 'page' : undefined}
                >
                  <Icon size={15} color={on ? '#bcabea' : '#a8a3c4'} strokeWidth={on ? 2.5 : 1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div style={{ marginTop: 20, padding: '0 2px' }}>
            <Link href="/submit" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '10px 14px',
              background: 'linear-gradient(150deg, var(--violet-500, #7c5cf0), var(--violet-700, #5030b3))',
              color: '#fff',
              borderRadius: 9,
              fontSize: 13, fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(100,64,221,0.35)',
              transition: 'filter 140ms ease, transform 140ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <FileSearch size={14} />
              Analyze Resume
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 18px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div className="status-dot" />
          <span style={{ fontSize: 11, color: '#9490b8', fontWeight: 500 }}>
            LangGraph active
          </span>
        </div>
      </aside>
    </>
  );
}