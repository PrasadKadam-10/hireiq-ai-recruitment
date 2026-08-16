'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getCandidate } from '@/lib/api';
import { Candidate } from '@/lib/types';
import { ArrowLeft, CheckCircle, XCircle, Globe, ChevronDown, ChevronUp, MapPin, Mail, Briefcase, Calendar } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ScoreGauge from '@/components/ui/ScoreGauge';
import StatusBadge from '@/components/ui/StatusBadge';
import SkillChips from '@/components/ui/SkillChips';

export default function CandidateDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReasoning, setShowReasoning] = useState(false);

  useEffect(() => {
    getCandidate(id).then(r => setCandidate(r.candidate)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <AppShell title="Candidate Report">
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AppShell>
  );

  if (!candidate) return (
    <AppShell title="Not Found">
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Candidate not found.</p>
        <Link href="/candidates" className="btn btn-secondary">← Back</Link>
      </div>
    </AppShell>
  );

  const c = candidate;
  const total = (c.skillsMatch?.strong?.length || 0) + (c.skillsMatch?.partial?.length || 0) + (c.skillsMatch?.missing?.length || 0);
  const pct = total > 0 ? ((c.skillsMatch?.strong?.length || 0) / total) : 0;

  return (
    <AppShell
      title="Candidate's Job Submission Report"
      actions={
        <Link href="/candidates" className="btn btn-secondary btn-sm">
          <ArrowLeft size={13} /> Back
        </Link>
      }
    >
      <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Header card: name, job title, timestamp ── */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div>
              {/* Big hero text like screenshot 1 */}
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 4 }}>
                {c.candidateName}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--accent)' }}>
                  <Mail size={13} /> {c.candidateEmail}
                </span>
                {c.timestamp && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-tertiary)' }}>
                    <Calendar size={12} />
                    Evaluated on {new Date(c.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                Job Title
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{c.jobTitle}</p>
            </div>
          </div>
        </div>

        {/* ── Score + AI Decision side by side ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>

          {/* Score card */}
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              AI Match Score
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Score/100</span>
            </div>
            <ScoreGauge score={c.score} size={120} stroke={10} showLabel />
          </div>

          {/* AI Decision */}
          <div className="card" style={{ padding: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              AI Decision
            </p>
            {c.evaluation?.decision && (
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>
                {c.evaluation.decision}
              </p>
            )}
            {c.evaluation?.reasoning && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {showReasoning ? c.evaluation.reasoning : c.evaluation.reasoning.slice(0, 280) + (c.evaluation.reasoning.length > 280 ? '…' : '')}
                </p>
                {c.evaluation.reasoning.length > 280 && (
                  <button onClick={() => setShowReasoning(!showReasoning)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)',
                    fontSize: 12, fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)',
                  }}>
                    {showReasoning ? <><ChevronUp size={13} /> Hide reasoning</> : <><ChevronDown size={13} /> View AI reasoning</>}
                  </button>
                )}
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <StatusBadge tag={c.tag} score={c.score} />
            </div>
          </div>
        </div>

        {/* ── Key Strengths + Gaps ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <CheckCircle size={15} color="var(--success)" />
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Key Strengths</p>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {c.evaluation?.strengths?.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <CheckCircle size={13} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                  {s}
                </li>
              ))}
              {!c.evaluation?.strengths?.length && <li style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>None identified</li>}
            </ul>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <XCircle size={15} color="var(--error)" />
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Gaps / Risks</p>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {c.evaluation?.gaps?.map((g, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ fontSize: 13, color: 'var(--error)', flexShrink: 0 }}>•</span>
                  {g}
                </li>
              ))}
              {!c.evaluation?.gaps?.length && <li style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>None identified</li>}
            </ul>
          </div>
        </div>

        {/* ── Candidate Skills Snapshot ── */}
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Candidate Skills Snapshot</p>

          {/* Coverage bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Skills Match Overall Score</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{pct.toFixed(2)}</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-muted)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                width: `${pct * 100}%`,
                background: pct >= 0.7 ? 'var(--success)' : pct >= 0.4 ? 'var(--warning)' : 'var(--error)',
                transition: 'width 0.9s ease',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Strong Match', variant: 'strong' as const, skills: c.skillsMatch?.strong },
              { label: 'Partial Match', variant: 'partial' as const, skills: c.skillsMatch?.partial },
              { label: 'Missing',      variant: 'missing' as const, skills: c.skillsMatch?.missing },
            ].filter(r => r.skills?.length > 0).map(r => (
              <div key={r.variant}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{r.label}</p>
                <SkillChips skills={r.skills} variant={r.variant} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Summary ── */}
        {c.summary && (
          <div className="card" style={{ padding: 22 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>AI Summary</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{c.summary}</p>
          </div>
        )}

        {/* ── Web Intelligence ── */}
        {(c.webResearch?.summary || c.webResearch?.github?.length > 0 || c.webResearch?.linkedin?.length > 0) && (
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <Globe size={15} color="var(--accent)" />
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Web Intelligence</p>
            </div>
            {c.webResearch?.summary && (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14, background: 'var(--accent-light)', borderRadius: 'var(--r-md)', padding: '10px 14px', border: '1px solid var(--accent-border)' }}>
                {c.webResearch.summary}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {c.webResearch?.github?.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>GitHub</p>
                  {c.webResearch.github.map((g: any, i: number) => (
                    <a key={i} href={g.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 13, color: 'var(--accent)', textDecoration: 'none', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      ↗ {g.title}
                    </a>
                  ))}
                </div>
              )}
              {c.webResearch?.linkedin?.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>LinkedIn</p>
                  {c.webResearch.linkedin.map((l: any, i: number) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 13, color: 'var(--accent)', textDecoration: 'none', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      ↗ {l.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <Link href="/candidates" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
          <ArrowLeft size={13} /> Back to Candidates
        </Link>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AppShell>
  );
}
