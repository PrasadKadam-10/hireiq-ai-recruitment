'use client';
import { useState } from 'react';
import Link from 'next/link';
export default function CreateJob() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', hrName: '', hrEmail: '' });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobApplication: { title: form.title, descriptionHTML: `<p>${form.description}</p>` },
          hr: { id: '1', name: form.hrName, email: form.hrEmail }
        })
      });
      const data = await res.json();
      if (data.success) { window.location.href = '/'; }
      else { alert('Error: ' + JSON.stringify(data)); }
    } catch (err: any) {
      alert('Failed: ' + err.message);
    } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">HireIQ</span>
          <Link href="/" className="text-gray-600 text-sm">← Dashboard</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Create Job Posting</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input type="text" required value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 text-sm bg-gray-50"
                placeholder="Senior Python Developer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Description</label>
              <textarea required rows={5} value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 text-sm bg-gray-50"
                placeholder="Required skills, experience..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">HR Name</label>
                <input type="text" required value={form.hrName}
                  onChange={e => setForm({...form, hrName: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 text-sm bg-gray-50"
                  placeholder="HR Manager" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">HR Email</label>
                <input type="email" required value={form.hrEmail}
                  onChange={e => setForm({...form, hrEmail: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 text-sm bg-gray-50"
                  placeholder="hr@company.com" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Job →'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}