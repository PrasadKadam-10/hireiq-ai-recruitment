export default function StatCard({ label, value, icon, sub }: {
  label: string; value: string | number;
  icon: React.ReactNode; sub?: string;
}) {
  return (
    <div className="card" style={{ padding: '20px 22px', transition: 'box-shadow 160ms ease', cursor: 'default' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</p>
        <div style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>{icon}</div>
      </div>
      <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>{sub}</p>}
    </div>
  );
}
