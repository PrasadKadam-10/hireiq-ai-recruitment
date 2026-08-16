'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getCandidates } from '@/lib/api';
import { Candidate } from '@/lib/types';
import { Users, Search, Plus, ChevronRight, SortAsc, SortDesc } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ScoreGauge from '@/components/ui/ScoreGauge';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { SkeletonRow } from '@/components/ui/SkeletonCard';

type SortKey = 'score' | 'name' | 'date';
type Dir = 'asc' | 'desc';
type Filter = 'all' | 'strong' | 'moderate' | 'weak';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [dir, setDir] = useState<Dir>('desc');

  useEffect(() => {
    getCandidates().then(r => setCandidates(r.candidates || [])).finally(() => setLoading(false));
  }, []);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setDir('desc'); }
  };

  const list = useMemo(() => {
    let l = [...candidates];
    if (filter === 'strong')   l = l.filter(c => c.score >= 75);
    if (filter === 'moderate') l = l.filter(c => c.score >= 50 && c.score < 75);
    if (filter === 'weak')     l = l.filter(c => c.score < 50);
    if (query.trim()) {
      const q = query.toLowerCase();
      l = l.filter(c => c.candidateName.toLowerCase().includes(q) || c.candidateEmail.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q));
    }
    l.sort((a, b) => {
      const cmp = sortKey === 'score' ? a.score - b.score
        : sortKey === 'name' ? a.candidateName.localeCompare(b.candidateName)
        : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return dir === 'desc' ? -cmp : cmp;
    });
    return l;
  }, [candidates, filter, query, sortKey, dir]);

  const count = (f: Filter) => f === 'all' ? candidates.length
    : f === 'strong' ? candidates.filter(c => c.score >= 75).length
    : f === 'moderate' ? candidates.filter(c => c.score >= 50 && c.score < 75).length
    : candidates.filter(c => c.score < 50).length;

  const SIcon = ({ k }: { k: SortKey }) =>
    sortKey !== k ? null : dir === 'desc' ? <SortDesc size={11} /> : <SortAsc size={11} />;

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'strong', label: 'Strong Fit' },
    { key: 'moderate', label: 'Moderate' },
    { key: 'weak', label: 'Weak Fit' },
  ];

  return (
    <AppShell
      title="Candidates"
      sub={`${candidates.length} evaluated by AI`}
      actions={<Link href="/submit" className="btn btn-primary btn-sm"><Plus size={13} /> Analyze Resume</Link>}
    >
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
          <input type="search" className="input" placeholder="Search by name, email or role…"
            value={query} onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: 36 }} aria-label="Search" />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 3, gap: 2 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
              background: filter === f.key ? 'var(--accent)' : 'transparent',
              color: filter === f.key ? '#fff' : 'var(--text-secondary)',
              transition: 'all 140ms ease',
            }}>
              {f.label} <span style={{ opacity: 0.7, marginLeft: 2 }}>({count(f.key)})</span>
            </button>
          ))}
        </div>

        {/* Sort */}
        {(['score', 'name', 'date'] as SortKey[]).map(k => (
          <button key={k} onClick={() => toggleSort(k)} className={`btn btn-sm ${sortKey === k ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}>
            {k} <SIcon k={k} />
          </button>
        ))}
      </div>

      {!loading && candidates.length > 0 && (
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 10 }}>
          Showing <strong style={{ color: 'var(--text-secondary)' }}>{list.length}</strong> of {candidates.length}
        </p>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
        ) : list.length === 0 && candidates.length === 0 ? (
          <EmptyState icon={<Users size={22} />} title="No candidates yet"
            desc="Submit a resume to run your first AI evaluation." action={{ label: 'Analyze Resume', href: '/submit' }} />
        ) : list.length === 0 ? (
          <EmptyState icon={<Search size={20} />} title="No results" desc="Try a different search term or filter." />
        ) : (
          <table className="data-table" aria-label="Candidates">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Role</th>
                <th>Score</th>
                <th>Status</th>
                <th>Evaluated</th>
                <th style={{ width: 32 }} />
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c._id} onClick={() => window.location.href = `/candidates/${c._id}`}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar">{c.candidateName.charAt(0).toUpperCase()}</div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.candidateName}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{c.candidateEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 180, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.jobTitle}
                    </span>
                  </td>
                  <td><ScoreGauge score={c.score} size={40} stroke={4} /></td>
                  <td><StatusBadge tag={c.tag} score={c.score} size="sm" /></td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {c.timestamp ? new Date(c.timestamp).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td>
                    <Link href={`/candidates/${c._id}`} onClick={e => e.stopPropagation()}>
                      <ChevronRight size={14} color="var(--text-tertiary)" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
