'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs, getCandidates } from '@/lib/api';
import { Job, Candidate } from '@/lib/types';
import { Plus, Briefcase, Clock, Users, ChevronRight } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import EmptyState from '@/components/ui/EmptyState';
import { SkeletonRow } from '@/components/ui/SkeletonCard';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getJobs(), getCandidates()])
      .then(([j, c]) => { setJobs(j.jobs || []); setCandidates(c.candidates || []); })
      .finally(() => setLoading(false));
  }, []);

  const countForJob = (title: string) =>
    candidates.filter(c => c.jobTitle.toLowerCase() === title.toLowerCase()).length;

  return (
    <AppShell
      title="Jobs"
      sub="Manage open positions"
      actions={<Link href="/jobs/create" className="btn btn-primary btn-sm"><Plus size={13} /> New Job</Link>}
    >
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 180px 120px 120px 100px',
          padding: '10px 22px', borderBottom: '1px solid var(--border-light)',
          background: 'var(--bg-card-alt)', gap: 16,
        }}>
          {['Job Title', 'HR Contact', 'Created', 'Applicants', ''].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
        ) : jobs.length === 0 ? (
          <EmptyState icon={<Briefcase size={22} />} title="No jobs yet"
            desc="Create your first job posting to start screening candidates with AI."
            action={{ label: 'Create Job', href: '/jobs/create' }} />
        ) : (
          jobs.map((job, i) => {
            const count = countForJob(job.jobApplication.title);
            return (
              <div key={job._id} style={{
                display: 'grid', gridTemplateColumns: '1fr 180px 120px 120px 100px',
                padding: '14px 22px', gap: 16, alignItems: 'center',
                borderBottom: i < jobs.length - 1 ? '1px solid var(--border-light)' : 'none',
                transition: 'background 140ms ease',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{job.jobApplication.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{job.hr?.email}</p>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {job.hr?.name}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {job.createdAt?.split('T')[0] ?? '—'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Users size={12} color="var(--text-tertiary)" /> {count}
                </p>
                <Link href={`/submit?jobId=${job._id}`} className="btn btn-secondary btn-sm">
                  Submit CV
                </Link>
              </div>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
