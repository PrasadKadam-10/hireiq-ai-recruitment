'use client';

import { useEffect, useState } from 'react';
import { getCandidates } from '@/lib/api';
import { Candidate } from '@/lib/types';
import Link from 'next/link';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidates()
      .then(res => setCandidates(res.candidates || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
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
            <Link href="/candidates" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
              View Candidates Submissions
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Candidates</h2>
          <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Submit CV
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <p className="text-gray-400 text-lg mb-4">No candidates evaluated yet</p>
            <Link href="/submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
              Submit First CV
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {candidates.map(c => {
              const scoreColor = c.score >= 75 ? '#f59e0b' : c.score >= 50 ? '#eab308' : '#ef4444';
              const circumference = 2 * Math.PI * 40;
              return (
                <Link key={c._id} href={`/candidates/${c._id}`}>
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        {/* Score Gauge */}
                        <div className="relative w-16 h-16 shrink-0">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="12"/>
                            <circle cx="50" cy="50" r="40" fill="none"
                              stroke={scoreColor} strokeWidth="12"
                              strokeDasharray={`${(c.score / 100) * circumference} ${circumference}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-900">{c.score}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{c.candidateName}</h3>
                          <p className="text-sm text-gray-500">{c.candidateEmail}</p>
                          <p className="text-sm text-gray-400">{c.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          c.score >= 75 ? 'bg-green-100 text-green-700' :
                          c.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{c.tag}</span>
                        <span className="text-gray-300 text-lg">→</span>
                      </div>
                    </div>
                    {/* Summary preview */}
                    {c.summary && (
                      <p className="text-sm text-gray-500 mt-3 line-clamp-2 pl-21">{c.summary}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}