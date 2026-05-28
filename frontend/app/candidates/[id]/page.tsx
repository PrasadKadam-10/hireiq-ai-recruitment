'use client';

import { useEffect, useState } from 'react';
import { getCandidate } from '@/lib/api';
import { Candidate } from '@/lib/types';
import Link from 'next/link';
import { use } from 'react';

export default function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidate(id)
      .then(res => setCandidate(res.candidate))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading candidate report...</p>
      </div>
    </div>
  );

  if (!candidate) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Candidate not found</p>
    </div>
  );

  const scoreColor = candidate.score >= 75 ? '#f59e0b' : candidate.score >= 50 ? '#eab308' : '#ef4444';
  const scoreBg = candidate.score >= 75 ? 'bg-green-100 text-green-700' : candidate.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = `${(candidate.score / 100) * circumference} ${circumference}`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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
            <Link href="/candidates" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
              View Candidates Submissions
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Candidate Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">Candidate's Job Submission Report</p>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">{candidate.candidateName}</h1>
              <p className="text-blue-500 text-sm mt-1">{candidate.candidateEmail}</p>
              <p className="text-gray-400 text-sm">Location not provided</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Job Title</p>
              <p className="text-gray-700 font-medium">{candidate.jobTitle}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Evaluated on {candidate.timestamp}</p>
            <Link href="#" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium">View CV</Link>
          </div>
        </div>

        {/* Score + Decision Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-8">
            {/* Circular Gauge */}
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500 mb-1">AI Match Score</p>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs text-gray-400">Score/100</p>
              </div>
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10"/>
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={scoreColor}
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{candidate.score}</span>
                  <span className="text-xs text-gray-400">Match Score</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-green-500 text-xs">●</span>
                <span className="text-xs text-gray-500">
                  {candidate.score >= 75 ? 'Strong' : candidate.score >= 50 ? 'Moderate' : 'Weak'}
                </span>
              </div>
            </div>

            {/* AI Decision */}
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">AI Decision</p>
              <p className={`text-lg font-semibold mb-3 ${
                candidate.score >= 75 ? 'text-green-600' :
                candidate.score >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>{candidate.evaluation?.decision}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {candidate.evaluation?.reasoning}
              </p>
              <button className="text-blue-500 text-xs mt-3 hover:underline">View AI reasoning</button>
            </div>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Key Strengths</h3>
            <ul className="space-y-2">
              {candidate.evaluation?.strengths?.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
              {(!candidate.evaluation?.strengths || candidate.evaluation.strengths.length === 0) && (
                <li className="text-gray-400 text-sm">No strengths identified</li>
              )}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Gaps / Risks</h3>
            <ul className="space-y-2">
              {candidate.evaluation?.gaps?.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-400 mt-0.5 shrink-0">-</span>
                  <span>{g}</span>
                </li>
              ))}
              {(!candidate.evaluation?.gaps || candidate.evaluation.gaps.length === 0) && (
                <li className="text-gray-400 text-sm">No gaps identified</li>
              )}
            </ul>
          </div>
        </div>

        {/* Skills Snapshot */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-5">Candidate Skills Snapshot</h3>

          {/* Strong Match */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Strong Match</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.skillsMatch?.strong?.map((s, i) => (
                <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                  {s}
                </span>
              ))}
              {(!candidate.skillsMatch?.strong || candidate.skillsMatch.strong.length === 0) && (
                <span className="text-gray-400 text-sm">None found</span>
              )}
            </div>
          </div>

          {/* Missing */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Missing</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.skillsMatch?.missing?.map((s, i) => (
                <span key={i} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium border border-yellow-200">
                  {s}
                </span>
              ))}
              {(!candidate.skillsMatch?.missing || candidate.skillsMatch.missing.length === 0) && (
                <span className="text-gray-400 text-sm">None missing</span>
              )}
            </div>
          </div>

          {/* Partial */}
          {candidate.skillsMatch?.partial && candidate.skillsMatch.partial.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Partial Match</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skillsMatch.partial.map((s, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Overall Score */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Skills Match Overall Score: <span className="font-semibold text-gray-900">
                {((candidate.skillsMatch?.strong?.length || 0) /
                  Math.max(
                    (candidate.skillsMatch?.strong?.length || 0) +
                    (candidate.skillsMatch?.missing?.length || 0) +
                    (candidate.skillsMatch?.partial?.length || 0), 1
                  )).toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">AI Summary</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{candidate.summary}</p>
        </div>

        {/* Web Intelligence */}
        {candidate.webResearch && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">🌐 Web Intelligence</h3>
            <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 mb-4">
              {candidate.webResearch.summary || 'No web presence found'}
            </p>
            {candidate.webResearch?.github?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">GitHub</p>
                {candidate.webResearch.github.map((g: any, i: number) => (
                  <a key={i} href={g.url} target="_blank" rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline mb-1 truncate">
                    {g.title}
                  </a>
                ))}
              </div>
            )}
            {candidate.webResearch?.linkedin?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">LinkedIn</p>
                {candidate.webResearch.linkedin.map((l: any, i: number) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline mb-1 truncate">
                    {l.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <Link href="/candidates"
          className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
          ← Back to Candidates
        </Link>
      </main>
    </div>
  );
}