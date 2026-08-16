interface ScoreGaugeProps {
  score: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
  darkBg?: boolean;
}

function getColors(s: number) {
  if (s >= 75) return { ring: '#22c55e', track: 'rgba(34,197,94,0.2)', label: 'Strong',   text: '#16a34a' };
  if (s >= 50) return { ring: '#f59e0b', track: 'rgba(245,158,11,0.2)', label: 'Moderate', text: '#d97706' };
  return             { ring: '#ef4444', track: 'rgba(239,68,68,0.2)',  label: 'Weak',     text: '#dc2626' };
}

export default function ScoreGauge({ score, size = 64, stroke = 6, showLabel, darkBg }: ScoreGaugeProps) {
  const c = getColors(score);
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;
  const numSize = size < 52 ? Math.round(size * 0.25) : size < 80 ? Math.round(size * 0.22) : Math.round(size * 0.2);
  const textColor = darkBg ? '#f1f5f9' : 'var(--text-primary)';
  const subColor  = darkBg ? '#94a3b8'  : 'var(--text-tertiary)';

  return (
    <div
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
      role="img"
      aria-label={`Score ${score}/100 — ${c.label}`}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={c.track} strokeWidth={stroke} />
          <circle
            cx={cx} cy={cy} r={r} fill="none"
            stroke={c.ring} strokeWidth={stroke}
            strokeDasharray={`${filled} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: numSize, fontWeight: 800, color: textColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {score}
          </span>
          {size >= 80 && (
            <span style={{ fontSize: Math.round(numSize * 0.55), color: subColor, lineHeight: 1, marginTop: 2 }}>
              Match Score
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.ring, display: 'inline-block' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: darkBg ? c.ring : c.text, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {c.label}
          </span>
        </div>
      )}
    </div>
  );
}
