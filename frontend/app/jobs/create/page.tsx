'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, User, Mail, AlignLeft, CheckCircle } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', hrName: '', hrEmail: '' });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobApplication: {
            title: form.title,
            descriptionHTML: `<p>${form.description.replace(/\n/g, '</p><p>')}</p>`,
          },
          hr: { id: '1', name: form.hrName, email: form.hrEmail },
        }),
      });
      const data = await res.json();
      if (data.success) { setSuccess(true); setTimeout(() => router.push('/jobs'), 1400); }
      else setError(JSON.stringify(data.detail || data));
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <AppShell title="Create Job">
        <div style={{ maxWidth: 440, margin: '80px auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={26} color="var(--success)" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Job created successfully</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Redirecting to jobs…</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Create Job" sub="Post a new position">
      <div style={{ maxWidth: 600 }}>
        <div className="card" style={{ padding: '32px 32px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26, paddingBottom: 22, borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-light)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
              <Briefcase size={18} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1 }}>New Job Posting</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>The AI uses this description to evaluate candidates</p>
            </div>
          </div>

          {error && (
            <div role="alert" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: 13, color: 'var(--error)', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label htmlFor="title" className="label">Job Title</label>
              <input id="title" type="text" required className="input" placeholder="e.g. Senior Python Developer" value={form.title} onChange={set('title')} />
            </div>

            <div>
              <label htmlFor="desc" className="label">Job Description</label>
              <textarea id="desc" required rows={7} className="input" style={{ minHeight: 160 }}
                placeholder={'Required skills and responsibilities...\n\n• 5+ years Python\n• FastAPI, LangChain, Docker'}
                value={form.description} onChange={set('description')} />
              <p className="field-hint">Be specific — the AI extracts required skills from this text.</p>
            </div>

            <div style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '18px 18px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>HR Contact</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label htmlFor="hrName" className="label">Name</label>
                  <input id="hrName" type="text" required className="input" placeholder="HR Manager" value={form.hrName} onChange={set('hrName')} />
                </div>
                <div>
                  <label htmlFor="hrEmail" className="label">Email</label>
                  <input id="hrEmail" type="email" required className="input" placeholder="hr@company.com" value={form.hrEmail} onChange={set('hrEmail')} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              {loading ? (
                <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Creating…</>
              ) : (
                <><Briefcase size={15} /> Create Job Posting</>
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AppShell>
  );
}
