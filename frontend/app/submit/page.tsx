'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getJobs, submitApplication } from '@/lib/api';
import { Job } from '@/lib/types';
import Link from 'next/link';

function SubmitForm() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    jobId: searchParams.get('jobId') || '',
    name: '',
    email: '',
    cv: null as File | null
  });

  useEffect(() => {
    getJobs().then(res => setJobs(res.jobs || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cv) return alert('Please upload a CV');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('job_id', form.jobId);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('cv_file', form.cv);
      const res = await submitApplication(formData);
      setResult(res);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium text-lg">🤖 AI Analyzing CV...</p>
        <p className="text-gray-400 text-sm mt-2">This may take 30-60 seconds</p>
        <p className="text-gray-400 text-xs mt-1">Extracting skills • Evaluating • Searching web</p>
      </div>
    </div>
  );

  if (result) return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-gray-900">HR Dashboard</span>
          </div>
          <Link href="/" className="text-gray-600 text-sm hover:text-gray-900">← Dashboard</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Result Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">Candidate's Job Submission Report</p>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 uppercase">{result.candidateName}</h2>
              <p className="text-blue-500 text-sm">{result.candidateEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Job Title</p>
              <p className="text-gray-700 font-medium">{result.jobTitle}</p>
            </div>
          </div>

          {/* Score + Decision */}
          <div className="flex gap-8 mt-4">
            <div className="shrink-0">
              <p className="text-xs text-gray-500 mb-2">AI Match Score</p>
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10"/>
                  <circle cx="50" cy="50" r="40" fill="none"
                    stroke={result.score >= 75 ? '#f59e0b' : result.score >= 50 ? '#eab308' : '#ef4444'}
                    strokeWidth="10"
                    strokeDasharray={`${(result.score / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{result.score}</span>
                  <span className="text-xs text-gray-400">Match Score</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-green-500 text-xs">●</span>
                <span className="text-xs text-gray-500">
                  {result.score >= 75 ? 'Strong' : result.score >= 50 ? 'Moderate' : 'Weak'}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">AI Decision</p>
              <p className={`text-lg font-semibold mb-2 ${
                result.score >= 75 ? 'text-green-600' :
                result.score >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>{result.evaluation?.decision}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{result.evaluation?.reasoning}</p>
            </div>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Key Strengths</h3>
            <ul className="space-y-2">
              {result.evaluation?.strengths?.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 shrink-0">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Gaps / Risks</h3>
            <ul className="space-y-2">
              {result.evaluation?.gaps?.map((g: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-400 shrink-0">-</span> {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Candidate Skills Snapshot</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 uppercase mb-2">Strong Match</p>
              <div className="flex flex-wrap gap-2">
                {result.skillsMatch?.strong?.map((s: string, i: number) => (
                  <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase mb-2">Missing</p>
              <div className="flex flex-wrap gap-2">
                {result.skillsMatch?.missing?.map((s: string, i: number) => (
                  <span key={i} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Web Research */}
        {result.webResearch?.summary && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">🌐 Web Intelligence</h3>
            <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">{result.webResearch.summary}</p>
          </div>
        )}

        <Link href="/candidates" className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800">
          View All Candidates →
        </Link>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-gray-900">HR Dashboard</span>
          </div>
          <Link href="/" className="text-gray-600 text-sm hover:text-gray-900">← Dashboard</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Candidate CV</h2>
          <p className="text-gray-400 text-sm mb-6">AI will analyze the resume and generate a complete evaluation report</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Position</label>
              <select
                required
                value={form.jobId}
                onChange={e => setForm({...form, jobId: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="">Select a job position...</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>{job.jobApplication.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="candidate@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF only)</label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={e => setForm({...form, cv: e.target.files?.[0] || null})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Submit & Analyze with AI →
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <SubmitForm />
    </Suspense>
  );
}