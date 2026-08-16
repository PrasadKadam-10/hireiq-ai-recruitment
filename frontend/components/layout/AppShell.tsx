'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell({
  children, title, sub, actions,
}: {
  children: React.ReactNode;
  title?: string;
  sub?: string;
  actions?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main-content" style={{ background: 'var(--bg-page)' }}>
        <TopBar onMenu={() => setOpen(true)} title={title} sub={sub} actions={actions} />
        <main className="page-content" id="main">
          {children}
        </main>
      </div>
    </div>
  );
}
