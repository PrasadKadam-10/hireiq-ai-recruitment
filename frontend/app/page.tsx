'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJobs, getCandidates } from '@/lib/api';
import { Job, Candidate } from '@/lib/types';
import { Users, Briefcase, TrendingUp, Plus } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">HireIQ</h1>
            <span className="text-sm text-gray-500">AI Recruitment Intelligence</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 font-medium text-sm">Dashboard</Link>
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900 text-sm">Jobs</Link>
            <Link href="/candidates" className="text-gray-600 hover:text-gray-900 text-sm">Candidates</Link>
            <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              + Submit CV
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">HR Dashboard</h2>
          <p className="text-gray-500 mt-1">AI-powered candidate intelligence</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">Total Jobs</span>
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">Candidates</span>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{candidates.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">Avg Score</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgScore}/100</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">Strong Fit</span>
              <span className="text-green-600 text-lg">✅</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{strongFit}</p>
          </div>
        </div>

        {/* Recent Candidates */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Candidates</h3>
            <Link href="/candidates" className="text-blue-600 text-sm">View all</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : candidates.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No candidates yet.
              <Link href="/submit" className="text-blue-600 ml-1">Submit a CV</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {candidates.slice(0, 5).map((c) => (
                <Link key={c._id} href={`/candidates/${c._id}`}>
                  <div className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">{c.candidateName}</p>
                      <p className="text-sm text-gray-500">{c.jobTitle}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                        c.score >= 75 ? 'bg-green-100 text-green-700' :
                        c.score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {c.score}/100
                      </span>
                      <span className="text-sm text-gray-500">{c.tag}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Jobs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Active Jobs</h3>
            <Link href="/jobs/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Job
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No jobs yet.
              <Link href="/jobs/create" className="text-blue-600 ml-1">Create one</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <div key={job._id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{job.jobApplication.title}</p>
                    <p className="text-sm text-gray-500">{job.hr.name} • {job.createdAt?.split('T')[0]}</p>
                  </div>
                  <Link href={`/submit?jobId=${job._id}`}
                    className="text-blue-600 text-sm hover:underline">
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