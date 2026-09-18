import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AdminProjectsListClient } from '@/components/admin/AdminProjectsListClient';
import { Plus } from 'lucide-react';

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

      <AdminProjectsListClient initialProjects={projectList} />
    </div>
  );
}
