export default function SkillChips({ skills, variant, max }: { skills: string[]; variant: 'strong' | 'partial' | 'missing'; max?: number }) {
  if (!skills?.length) return <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>None identified</span>;
  const cls = variant === 'strong' ? 'chip-strong' : variant === 'partial' ? 'chip-partial' : 'chip-missing';
  const visible = max ? skills.slice(0, max) : skills;
  const extra = max ? Math.max(0, skills.length - max) : 0;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {visible.map((s, i) => <span key={i} className={cls}>{s}</span>)}
      {extra > 0 && <span className="badge badge-neutral" title={skills.slice(max!).join(', ')}>+{extra} more</span>}
    </div>
  );
}
