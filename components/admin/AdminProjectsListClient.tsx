'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Project } from '@/types/database';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToastProvider';
import { Edit, Trash2, FolderKanban, Plus } from 'lucide-react';

interface AdminProjectsListClientProps {
  initialProjects: (Project & { category?: { name: string } | null })[];
}

export function AdminProjectsListClient({ initialProjects }: AdminProjectsListClientProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [projectToDelete, setProjectToDelete] = useState<(Project & { category?: { name: string } | null }) | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();
  const { showToast } = useAdminToast();

  async function handleDeleteConfirm() {
    if (!projectToDelete) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id);

      if (error) {
        throw error;
      }

      // Revalidate public caches
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paths: ['/', '/projects', `/projects/${projectToDelete.slug}`],
          }),
        });
      } catch (revErr) {
        console.warn('Revalidation notice:', revErr);
      }

      // Remove from state immediately
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      showToast(`Project "${projectToDelete.title}" deleted successfully.`, 'success');
      setProjectToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      showToast(err?.message || 'Failed to delete project. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  if (projects.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Project Title &amp; Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((project) => (
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
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProjectToDelete(project)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!projectToDelete}
        title="Delete Project"
        message={
          <>
            Are you sure you want to delete <span className="font-bold text-navy-900">&quot;{projectToDelete?.title}&quot;</span>?
            This will permanently remove the case study from the public portfolio and home page showcase.
          </>
        }
        confirmText="Delete Project"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          if (!isDeleting) setProjectToDelete(null);
        }}
      />
    </>
  );
}
