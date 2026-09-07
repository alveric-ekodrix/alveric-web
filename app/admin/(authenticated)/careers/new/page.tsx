import React from 'react';
import Link from 'next/link';
import { JobEditorForm } from '@/components/admin/JobEditorForm';
import { ArrowLeft } from 'lucide-react';

export default function NewJobAdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="space-y-1">
        <Link
          href="/admin/careers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Openings List</span>
        </Link>
        <h1 className="text-2xl font-black text-navy-900">Post New Career Opening</h1>
        <p className="text-xs text-slate-500">
          Enter position specifications, qualifications, and department details.
        </p>
      </div>

      <JobEditorForm isEditing={false} />
    </div>
  );
}
