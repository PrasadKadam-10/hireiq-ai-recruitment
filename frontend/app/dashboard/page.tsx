'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs, getCandidates } from '@/lib/api';
import { Job, Candidate } from '@/lib/types';
import {
  Briefcase, Users, Star, Plus, ChevronRight,
  Clock, Search, FileSearch,
} from 'lucide-react';
import ScoreGauge from '@/components/ui/ScoreGauge';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';

/* ── Skeleton helper ── */
function Sk({ w = '100%', h = 14, round = false }: { w?: string | number; h?: number; round?: boolean }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: round ? 99 : 6 }} aria-hidden />;
}

/* ── Main dashboard ── */
export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getJobs(), getCandidates()])
      .then(([j, c]) => { setJobs(j.jobs || []); setCandidates(c.candidates || []); })
      .catch(() => setError('Cannot reach the HireIQ API. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const avg    = candidates.length ? Math.round(candidates.reduce((a, c) => a + c.score, 0) / candidates.length) : 0;
  const strong = candidates.filter(c => c.score >= 75).length;
  const recent = [...candidates].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 4);

  return (
    <div className="topnav-content" style={{ maxWidth: 1200, width: '100%', margin: '0 auto', paddingTop: 28 }}>
      {/* Sub-heading */}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Here&rsquo;s where your pipeline stands today.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 16px', marginBottom: 24, fontSize: 13, color: '#dc2626' }} role="alert">
          ⚠ {error}
        </div>
      )}

      {/* ── Top metrics row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36, alignItems: 'stretch' }}>

        {/* Dark score card */}
        <div style={{
          background: 'var(--score-card-bg)',
          borderRadius: 'var(--r-lg)',
          padding: '32px 36px',
          display: 'flex', alignItems: 'center', gap: 28,
          minHeight: 180,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {loading ? (
            <Sk w={100} h={100} round />
          ) : (
            <ScoreGauge score={avg} size={96} stroke={9} darkBg />
          )}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9490b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              AVG AI SCORE
            </p>
            {loading ? (
              <><Sk w={160} h={13} /><div style={{ marginTop: 8 }}><Sk w={220} h={11} /></div></>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--score-card-sub)', lineHeight: 1.65, maxWidth: 240 }}>
                Out of 100 points, averaged across{' '}
                <span style={{ color: '#f59e0b', fontWeight: 600 }}>{candidates.length} evaluated</span>{' '}
                candidate{candidates.length !== 1 ? 's' : ''} this cycle.
              </p>
            )}
          </div>
        </div>

        {/* 2×2 stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12 }}>
          {/* Active Jobs */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Active Jobs</p>
              <Briefcase size={17} color="var(--text-tertiary)" />
            </div>
            {loading ? <Sk w={50} h={36} /> : (
              <p style={{ fontSize: 40, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {jobs.length}
              </p>
            )}
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 5 }}>Open positions</p>
          </div>

          {/* Total Candidates */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Total Candidates</p>
              <Users size={17} color="var(--text-tertiary)" />
            </div>
            {loading ? <Sk w={50} h={36} /> : (
              <p style={{ fontSize: 40, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {candidates.length}
              </p>
            )}
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 5 }}>Evaluated by AI</p>
          </div>

          {/* Strong Fit */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Strong Fit</p>
              <Star size={17} color="var(--text-tertiary)" />
            </div>
            {loading ? <Sk w={50} h={36} /> : (
              <p style={{ fontSize: 40, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {strong}
              </p>
            )}
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 5 }}>Score ≥ 75</p>
          </div>

          {/* Quick Action card */}
          <div style={{
            background: 'var(--qa-bg)',
            border: '1px solid var(--qa-border)',
            borderRadius: 'var(--r-lg)',
            padding: '20px 22px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--qa-text)', letterSpacing: '0.02em' }}>Quick Action</p>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Screen a new resume
              </p>
              <Link href="/submit" style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 13, fontWeight: 700, color: 'var(--qa-link)',
                textDecoration: 'none',
              }}>
                Analyze now <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Candidates ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Recent Candidates
        </h2>
        <Link href="/candidates" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
          View all <ChevronRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <Sk w={36} h={36} round />
                <Sk w={36} h={36} round />
              </div>
              <Sk w="60%" h={14} />
              <div style={{ marginTop: 6 }}><Sk w="80%" h={11} /></div>
              <div style={{ marginTop: 14 }}><Sk w={80} h={22} round /></div>
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No candidates yet</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Submit a resume to run your first AI analysis.</p>
          <Link href="/submit" className="btn btn-accent btn-sm">Analyze Resume</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(recent.length + 1, 4)}, 1fr)`, gap: 14 }}>
          {recent.map(c => (
            <Link key={c._id} href={`/candidates/${c._id}`} style={{ textDecoration: 'none' }}>
              <div className="card card-hover" style={{ padding: '18px 18px 16px', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div className="avatar">{c.candidateName.charAt(0).toUpperCase()}</div>
                  <ScoreGauge score={c.score} size={42} stroke={4} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 3 }}>
                  {c.candidateName}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.jobTitle}
                </p>
                <StatusBadge tag={c.tag} score={c.score} size="sm" />
              </div>
            </Link>
          ))}

          {/* + Analyze another */}
          <Link href="/submit" style={{ textDecoration: 'none' }}>
            <div style={{
              border: '2px dashed var(--border-strong)',
              borderRadius: 'var(--r-lg)',
              padding: '18px', height: '100%', minHeight: 160,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 8, cursor: 'pointer',
              transition: 'border-color 140ms ease, background 140ms ease',
              color: 'var(--text-tertiary)', background: 'transparent',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-light)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'; }}
            >
              <div style={{ fontSize: 22, lineHeight: 1 }}>+</div>
              <p style={{ fontSize: 12, fontWeight: 600, textAlign: 'center' }}>Analyze another</p>
            </div>
          </Link>
        </div>
      )}

      {/* ── Bottom row: Top Performers + Active Jobs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 28 }}>

        {/* Top Performers */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="section-head">
            <span className="section-title">Top Performers</span>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
          </div>
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none' }}>
                <Sk w={24} h={11} /><div style={{ flex: 1 }}><Sk w="60%" h={13} /><div style={{ marginTop: 6 }}><Sk w="40%" h={10} /></div></div><Sk w={38} h={38} round />
              </div>
            ))
          ) : candidates.length === 0 ? (
            <EmptyState icon={<Star size={18} />} title="No candidates" desc="Submit a resume to see top performers." />
          ) : (
            [...candidates].sort((a, b) => b.score - a.score).slice(0, 4).map((c, i, arr) => (
              <Link key={c._id} href={`/candidates/${c._id}`} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none',
                textDecoration: 'none', transition: 'background 120ms ease',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', width: 22, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.candidateName}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.jobTitle}</p>
                </div>
                <ScoreGauge score={c.score} size={38} stroke={4} />
              </Link>
            ))
          )}
        </div>

        {/* Active Jobs */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="section-head">
            <span className="section-title">Active Jobs</span>
            <Link href="/jobs/create" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
              <Plus size={12} /> New
            </Link>
          </div>
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none', gap: 10 }}>
                <div style={{ flex: 1 }}><Sk w="60%" h={13} /><div style={{ marginTop: 6 }}><Sk w="35%" h={10} /></div></div>
                <Sk w={76} h={28} />
              </div>
            ))
          ) : jobs.length === 0 ? (
            <EmptyState icon={<Briefcase size={18} />} title="No jobs" desc="Create your first job posting." action={{ label: 'Create Job', href: '/jobs/create' }} />
          ) : (
            jobs.slice(0, 5).map((job, i) => (
              <div key={job._id} style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                borderBottom: i < Math.min(jobs.length, 5) - 1 ? '1px solid var(--border-light)' : 'none',
              }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {job.jobApplication.title}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={10} /> {job.createdAt?.split('T')[0]}
                  </p>
                </div>
                <Link href={`/submit?jobId=${job._id}`} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                  Submit CV
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
