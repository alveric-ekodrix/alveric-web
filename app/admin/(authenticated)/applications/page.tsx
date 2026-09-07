'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { JobApplication } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Users, Mail, Phone, Calendar, Search, Loader2 } from 'lucide-react';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const supabase = createClient();

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*, job:jobs(title)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setApplications(data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: JobApplication['status']) {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    await supabase.from('job_applications').update({ status: newStatus }).eq('id', id);
  }

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.job?.title && app.job.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: JobApplication['status'][] = [
    'new',
    'reviewing',
    'shortlisted',
    'interview',
    'selected',
    'rejected',
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-navy-900">Career Applications</h1>
        <p className="text-xs text-slate-500">
          Review candidates, applicant resumes, cover notes, and manage hiring pipeline stages.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applicants by name, email, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-gold-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-semibold text-navy-900 w-full sm:w-auto"
        >
          <option value="all">All Pipeline Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-navy-900 mr-2" />
          <span>Loading applicants...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-navy-900">No Applications Found</h2>
          <p className="text-xs text-slate-500">
            When visitors submit applications through career job listings, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-navy-900 block">{app.full_name}</span>
                      {app.cover_message && (
                        <span className="text-[11px] text-slate-500 line-clamp-1 italic max-w-xs block">
                          "{app.cover_message}"
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy-900">
                      {app.job?.title || <span className="text-slate-400">General Candidate</span>}
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3 h-3 text-gold-500" />
                        <a href={`mailto:${app.email}`} className="hover:underline">
                          {app.email}
                        </a>
                      </div>
                      {app.phone && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3 h-3 text-gold-500" />
                          <a href={`tel:${app.phone.replace(/\s+/g, '')}`} className="hover:underline">
                            {app.phone}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                        className={`px-2 py-1 rounded text-[11px] font-bold uppercase border border-slate-200 cursor-pointer ${
                          app.status === 'selected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'rejected'
                            ? 'bg-red-50 text-red-700'
                            : app.status === 'interview'
                            ? 'bg-purple-100 text-purple-800'
                            : app.status === 'shortlisted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
