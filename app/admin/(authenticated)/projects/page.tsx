import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Plus, Edit, Eye, FolderKanban, MapPin } from 'lucide-react';

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*, category:project_categories(name)')
    .order('display_order', { ascending: true });

  const projectList = projects || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Projects Portfolio Management</h1>
          <p className="text-xs text-slate-500">
            Publish and manage contracting case studies, engineering completions, and category assignments.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </Link>
      </div>

      {projectList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-navy-900">No Projects in Portfolio</h2>
          <p className="text-xs text-slate-500">
            Add completed engineering or technical contracting case studies.
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-500 text-navy-950 rounded-lg text-xs font-bold hover:bg-gold-400 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Project</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Project Title & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectList.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-navy-900 block">{project.title}</span>
                      <span className="font-mono text-[11px] text-slate-400">/{project.slug}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {project.category?.name || <span className="text-slate-400">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {project.location || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                      {project.display_order}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          project.is_published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {project.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {project.is_featured ? (
                        <span className="text-[11px] font-bold text-gold-600">★ Yes</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="inline-block p-1 text-slate-400 hover:text-navy-900 transition"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="inline-block p-1 text-slate-400 hover:text-navy-900 transition"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
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
