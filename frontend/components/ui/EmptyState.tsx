import Link from 'next/link';
export default function EmptyState({ icon, title, desc, action }: { icon: React.ReactNode; title: string; desc: string; action?: { label: string; href: string } }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 300, margin: '0 auto', lineHeight: 1.6 }}>{desc}</p>
      </div>
      {action && <Link href={action.href} className="btn btn-primary btn-sm" style={{ marginTop: 4 }}>{action.label}</Link>}
    </div>
  );
}
