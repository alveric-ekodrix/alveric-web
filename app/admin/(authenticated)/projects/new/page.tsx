import React from 'react';
import Link from 'next/link';
import { ProjectEditorForm } from '@/components/admin/ProjectEditorForm';
import { ArrowLeft } from 'lucide-react';

export default function NewProjectAdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="space-y-1">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects List</span>
        </Link>
        <h1 className="text-2xl font-black text-navy-900">Add New Project</h1>
        <p className="text-xs text-slate-500">
          Publish a technical contracting case study with client, category, challenge, solution, and images.
        </p>
      </div>

      <ProjectEditorForm isEditing={false} />
    </div>
  );
}
