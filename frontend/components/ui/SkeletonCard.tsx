export function Skeleton({ w = '100%', h = 14, round }: { w?: string | number; h?: number; round?: boolean }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: round ? 99 : 8 }} aria-hidden />;
}
export function SkeletonStatCard() {
  return (
    <div className="card" style={{ padding: 22 }} aria-hidden>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <Skeleton w={90} h={13} /><Skeleton w={20} h={20} round />
      </div>
      <Skeleton w={70} h={34} /><Skeleton w={110} h={11} />
    </div>
  );
}
export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--border-light)' }} aria-hidden>
      <Skeleton w={36} h={36} round />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <Skeleton w="40%" h={13} /><Skeleton w="26%" h={11} />
      </div>
      <Skeleton w={64} h={24} round />
    </div>
  );
}
