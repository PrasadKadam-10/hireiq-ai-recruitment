'use client';

import { Menu } from 'lucide-react';

export default function TopBar({ onMenu, title, sub, actions }: {
  onMenu: () => void; title?: string; sub?: string; actions?: React.ReactNode;
}) {
  if (!title && !actions) return null;
  return (
    <header style={{
      height: 58,
      background: '#ffffff',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 32px', gap: 14,
      position: 'sticky', top: 0, zIndex: 30,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}>
      <button onClick={onMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 6, borderRadius: 6, display: 'none' }} aria-label="Menu">
        <Menu size={17} />
      </button>
      <div style={{ flex: 1 }}>
        {title && <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>{title}</h1>}
        {sub && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{sub}</p>}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
    </header>
  );
}
