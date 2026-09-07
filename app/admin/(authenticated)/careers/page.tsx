import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Plus, Edit, Eye, Briefcase, MapPin } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCareersPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, job_applications(count)')
    .order('display_order', { ascending: true });

  const jobList = jobs || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Career Openings Management</h1>
          <p className="text-xs text-slate-500">
            Publish technical job vacancies, requirements, responsibilities, and review applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-navy-900 text-xs font-bold hover:bg-slate-50 transition shadow-sm"
          >
            <span>View All Applications</span>
          </Link>
          <Link
            href="/admin/careers/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {jobList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-navy-900">No Job Openings</h2>
          <p className="text-xs text-slate-500">
            Post an engineering, contracting, or administrative opening to receive applications.
          </p>
          <Link
            href="/admin/careers/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-500 text-navy-950 rounded-lg text-xs font-bold hover:bg-gold-400 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Post First Opening</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Position Title & Slug</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Applicants</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobList.map((job) => {
                  const applicantCount = job.job_applications?.[0]?.count || 0;
                  return (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-navy-900 block">{job.title}</span>
                        <span className="font-mono text-[11px] text-slate-400">/{job.slug}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {job.department || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {job.location || '—'}
                      </td>
                      <td className="py-3 px-4 font-bold text-navy-900">
                        {applicantCount}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            job.is_published
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {job.is_published ? 'Active' : 'Closed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/careers/${job.slug}`}
                          target="_blank"
                          className="inline-block p-1 text-slate-400 hover:text-navy-900 transition"
                          title="View Live Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/careers/${job.id}/edit`}
                          className="inline-block p-1 text-slate-400 hover:text-navy-900 transition"
                          title="Edit Opening"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
