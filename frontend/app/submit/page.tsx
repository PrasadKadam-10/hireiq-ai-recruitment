'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getJobs, submitApplication } from '@/lib/api';
import { Job } from '@/lib/types';
import Link from 'next/link';
import { Upload, FileText, CheckCircle, XCircle, Globe, ChevronDown, ChevronUp, Cpu, Search, BarChart3, Layers, X, Users, ArrowRight } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import ScoreGauge from '@/components/ui/ScoreGauge';
import StatusBadge from '@/components/ui/StatusBadge';
import SkillChips from '@/components/ui/SkillChips';

const STEPS = [
  { id: 'upload',   label: 'Reading CV',                 icon: <FileText size={13} /> },
  { id: 'extract',  label: 'Extracting skills',          icon: <Layers size={13} /> },
  { id: 'evaluate', label: 'AI evaluation · ASI1',       icon: <Cpu size={13} /> },
  { id: 'match',    label: 'Matching job requirements',  icon: <BarChart3 size={13} /> },
  { id: 'research', label: 'Web intelligence · Exa',     icon: <Search size={13} /> },
  { id: 'save',     label: 'Saving report',              icon: <CheckCircle size={13} /> },
];
const DURATIONS = [4000, 9000, 18000, 6000, 12000, 4000];

function ProcessingView({ name }: { name: string }) {
  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let acc = 0;
    const timers = DURATIONS.map((d, i) => {
      acc += d;
      return setTimeout(() => setStep(Math.min(i + 1, STEPS.length - 1)), acc);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AppShell title="Analyzing Resume" sub="AI pipeline running…">
      <div style={{ maxWidth: 480, margin: '48px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(59,110,245,0.35)',
        }}>
          <Cpu size={30} color="#fff" strokeWidth={1.5} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Analyzing {name || 'candidate'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Typically takes 30–60 seconds · {elapsed}s elapsed</p>
        </div>

        <div className="card" style={{ width: '100%', overflow: 'hidden' }}>
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 20px',
                borderBottom: i < STEPS.length - 1 ? '1px solid var(--border-light)' : 'none',
                background: active ? 'var(--accent-light)' : 'transparent',
                transition: 'background 200ms ease',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? '#f0fdf4' : active ? 'var(--accent-light)' : 'var(--bg-muted)',
                  color: done ? 'var(--success)' : active ? 'var(--accent)' : 'var(--text-tertiary)',
                  border: `1px solid ${done ? '#bbf7d0' : active ? 'var(--accent-border)' : 'var(--border)'}`,
                }}>
                  {done ? <CheckCircle size={13} /> : s.icon}
                </div>
                <span style={{ fontSize: 13, flex: 1, fontWeight: active ? 600 : 400, color: done ? 'var(--text-tertiary)' : active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                  {s.label}
                </span>
                {active && <div style={{ width: 14, height: 14, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />}
                {done && <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>Done</span>}
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AppShell>
  );
}

function ResultView({ result, onReset }: { result: any; onReset: () => void }) {
  const [showReasoning, setShowReasoning] = useState(false);
  const total = (result.skillsMatch?.strong?.length || 0) + (result.skillsMatch?.partial?.length || 0) + (result.skillsMatch?.missing?.length || 0);
  const pct = total > 0 ? ((result.skillsMatch?.strong?.length || 0) / total) : 0;

  return (
    <AppShell
      title="Analysis Complete"
      sub={`${result.candidateName} · ${result.jobTitle}`}
      actions={<button className="btn btn-secondary btn-sm" onClick={onReset}>Analyze Another</button>}
    >
      <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Header */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 4 }}>
                {result.candidateName}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--accent)' }}>{result.candidateEmail}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Job Title</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>{result.jobTitle}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Match Score</p>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Score/100</p>
            <ScoreGauge score={result.score} size={120} stroke={10} showLabel />
          </div>
          <div className="card" style={{ padding: 24 }}>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>AI Decision</p>
            {result.evaluation?.decision && (
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 10 }}>{result.evaluation.decision}</p>
            )}
            {result.evaluation?.reasoning && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {showReasoning ? result.evaluation.reasoning : result.evaluation.reasoning.slice(0, 280) + (result.evaluation.reasoning.length > 280 ? '…' : '')}
                </p>
                {result.evaluation.reasoning.length > 280 && (
                  <button onClick={() => setShowReasoning(!showReasoning)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 12, fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)' }}>
                    {showReasoning ? <><ChevronUp size={12} /> Hide</> : <><ChevronDown size={12} /> View AI reasoning</>}
                  </button>
                )}
              </div>
            )}
            <div style={{ marginTop: 12 }}><StatusBadge tag={result.tag} score={result.score} /></div>
          </div>
        </div>

        {/* Strengths + Gaps */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <CheckCircle size={14} color="var(--success)" />
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Key Strengths</p>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.evaluation?.strengths?.map((s: string, i: number) => (
                <li key={i} style={{ display: 'flex', gap: 7, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <CheckCircle size={13} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />{s}
                </li>
              ))}
              {!result.evaluation?.strengths?.length && <li style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>None identified</li>}
            </ul>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <XCircle size={14} color="var(--error)" />
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Gaps / Risks</p>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.evaluation?.gaps?.map((g: string, i: number) => (
                <li key={i} style={{ display: 'flex', gap: 7, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--error)', flexShrink: 0 }}>•</span>{g}
                </li>
              ))}
              {!result.evaluation?.gaps?.length && <li style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>None identified</li>}
            </ul>
          </div>
        </div>

        {/* Skills */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Candidate Skills Snapshot</p>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Skills Match Overall Score: {pct.toFixed(2)}</span>
          </div>
          <div style={{ height: 5, background: 'var(--bg-muted)', borderRadius: 99, overflow: 'hidden', marginBottom: 18 }}>
            <div style={{ height: '100%', width: `${pct * 100}%`, borderRadius: 99, background: pct >= 0.7 ? 'var(--success)' : pct >= 0.4 ? 'var(--warning)' : 'var(--error)', transition: 'width 0.9s ease' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Strong Match', variant: 'strong' as const, skills: result.skillsMatch?.strong },
              { label: 'Partial Match', variant: 'partial' as const, skills: result.skillsMatch?.partial },
              { label: 'Missing',      variant: 'missing' as const, skills: result.skillsMatch?.missing },
            ].filter(r => r.skills?.length > 0).map(r => (
              <div key={r.variant}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>{r.label}</p>
                <SkillChips skills={r.skills} variant={r.variant} />
              </div>
            ))}
          </div>
        </div>

        {/* Web Intelligence */}
        {result.webResearch?.summary && (
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <Globe size={14} color="var(--accent)" />
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Web Intelligence</p>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--accent-light)', borderRadius: 'var(--r-md)', padding: '10px 14px', border: '1px solid var(--accent-border)', marginBottom: 12 }}>
              {result.webResearch.summary}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {result.webResearch?.github?.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>GitHub</p>
                  {result.webResearch.github.map((g: any, i: number) => (
                    <a key={i} href={g.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 13, color: 'var(--accent)', textDecoration: 'none', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>↗ {g.title}</a>
                  ))}
                </div>
              )}
              {result.webResearch?.linkedin?.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>LinkedIn</p>
                  {result.webResearch.linkedin.map((l: any, i: number) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 13, color: 'var(--accent)', textDecoration: 'none', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>↗ {l.title}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/candidates" className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}>
            <Users size={15} /> View All Candidates
          </Link>
          <button className="btn btn-secondary btn-lg" onClick={onReset}>Analyze Another</button>
        </div>
      </div>
    </AppShell>
  );
}

function SubmitForm() {
  const searchParams = useSearchParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({ jobId: searchParams.get('jobId') || '', name: '', email: '', cv: null as File | null });

  useEffect(() => { getJobs().then(r => setJobs(r.jobs || [])); }, []);

  const setFile = (f: File | null) => {
    if (f && f.type !== 'application/pdf') { alert('PDF files only.'); return; }
    setForm(p => ({ ...p, cv: f }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cv) { alert('Please upload a PDF CV.'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('job_id', form.jobId);
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('cv_file', form.cv);
      const res = await submitApplication(fd);
      setResult(res);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ProcessingView name={form.name} />;
  if (result) return <ResultView result={result} onReset={() => setResult(null)} />;

  return (
    <AppShell title="Resume Analyzer" sub="Upload a CV for instant AI evaluation">
      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div className="card" style={{ padding: '28px 28px' }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div>
              <label htmlFor="jobSel" className="label">Job Position</label>
              <select id="jobSel" required value={form.jobId} onChange={e => setForm(p => ({ ...p, jobId: e.target.value }))} className="input" style={{ display: 'block' }}>
                <option value="">Select a position…</option>
                {jobs.map(j => <option key={j._id} value={j._id}>{j.jobApplication.title}</option>)}
              </select>
              {jobs.length === 0 && <p className="field-hint">No jobs yet. <Link href="/jobs/create" style={{ color: 'var(--accent)' }}>Create one</Link></p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label htmlFor="cName" className="label">Candidate Name</label>
                <input id="cName" type="text" required className="input" placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label htmlFor="cEmail" className="label">Email Address</label>
                <input id="cEmail" type="email" required className="input" placeholder="email@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="label">Resume (PDF only)</label>
              <div className={`upload-zone${dragOver ? ' drag-over' : ''}${form.cv ? ' has-file' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); setFile(e.dataTransfer.files[0] ?? null); }}
                role="button" tabIndex={0} aria-label="Upload PDF"
                onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
                {form.cv ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={26} color="var(--success)" />
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>{form.cv.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{(form.cv.size / 1024).toFixed(1)} KB</p>
                    <button type="button" onClick={e => { e.stopPropagation(); setForm(p => ({ ...p, cv: null })); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)' }}>
                      <X size={12} /> Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--r-xl)', background: 'var(--bg-muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                      <Upload size={20} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Drop PDF here or click to browse</p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>PDF files only · Max 10 MB</p>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg"
              disabled={!form.cv || !form.jobId || !form.name || !form.email}
              style={{ width: '100%', justifyContent: 'center' }}>
              <Cpu size={15} /> Analyze with AI
            </button>
          </form>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { icon: <Layers size={15} />, label: 'Skill Extraction', sub: 'ASI1 · Groq' },
            { icon: <BarChart3 size={15} />, label: 'Score 0–100', sub: 'AI evaluation' },
            { icon: <Search size={15} />, label: 'Web Research', sub: 'Exa search' },
          ].map(f => (
            <div key={f.label} className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ color: 'var(--accent)' }}>{f.icon}</span>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{f.label}</p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{f.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={
      <AppShell title="Resume Analyzer">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </AppShell>
    }>
      <SubmitForm />
    </Suspense>
  );
}
