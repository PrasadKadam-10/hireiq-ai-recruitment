export default function StatusBadge({ tag, score, size = 'md' }: { tag: string; score?: number; size?: 'sm' | 'md' }) {
  const s = score ?? 0;
  const cls = s >= 75 || tag.includes('Strong') ? 'badge badge-strong'
    : s >= 50 || tag.includes('Potential') ? 'badge badge-mid'
    : 'badge badge-weak';
  const clean = tag.replace(/[✅🟡❌]/g, '').trim();
  const sm = size === 'sm' ? { fontSize: 10, padding: '2px 8px' } : undefined;
  return <span className={cls} style={sm}>{clean}</span>;
}
