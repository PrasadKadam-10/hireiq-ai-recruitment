'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs, getCandidates } from '@/lib/api';
import { Job, Candidate } from '@/lib/types';

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, candidatesRes] = await Promise.all([
          getJobs(),
          getCandidates()
        ]);
        setJobs(jobsRes.jobs || []);
        setCandidates(candidatesRes.candidates || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length)
    : 0;
  const strongFit = candidates.filter(c => c.score >= 75).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-gray-900">HR Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/jobs/create" className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900">
              <span>📋</span> Created Jobs
            </Link>
            <Link href="/candidates" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
              View Candidates Submissions
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Agentic AI HR Automation</h1>
          <p className="text-xl text-gray-500">Instant CV Intelligence — AI agent evaluates resumes in seconds</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: jobs.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Candidates', value: candidates.length, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Avg Score', value: `${avgScore}/100`, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Strong Fit', value: strongFit, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Candidates */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Candidates</h2>
            <Link href="/candidates" className="text-blue-600 text-sm hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : candidates.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 mb-3">No candidates evaluated yet</p>
              <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Submit First CV
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {candidates.slice(0, 5).map((c) => {
                const scoreColor = c.score >= 75 ? '#f59e0b' : c.score >= 50 ? '#eab308' : '#ef4444';
                const circumference = 2 * Math.PI * 40;
                return (
                  <Link key={c._id} href={`/candidates/${c._id}`}>
                    <div className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors">
                      <div className="flex items-center gap-4">
                        {/* Mini gauge */}
                        <div className="relative w-12 h-12 shrink-0">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="12"/>
                            <circle cx="50" cy="50" r="40" fill="none"
                              stroke={scoreColor} strokeWidth="12"
                              strokeDasharray={`${(c.score / 100) * circumference} ${circumference}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-900">{c.score}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{c.candidateName}</p>
                          <p className="text-sm text-gray-500">{c.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          c.score >= 75 ? 'bg-green-100 text-green-700' :
                          c.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{c.tag}</span>
                        <span className="text-gray-400 text-sm">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Jobs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Active Job Postings</h2>
            <Link href="/jobs/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              + Create Job
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 mb-3">No jobs posted yet</p>
              <Link href="/jobs/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Create First Job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <div key={job._id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{job.jobApplication.title}</p>
                    <p className="text-sm text-gray-400">{job.hr?.name} • {job.createdAt?.split('T')[0]}</p>
                  </div>
                  <Link href={`/submit?jobId=${job._id}`}
                    className="text-blue-600 text-sm font-medium hover:underline">
                    Submit CV →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}