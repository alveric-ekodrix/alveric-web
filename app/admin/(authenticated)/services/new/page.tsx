import React from 'react';
import Link from 'next/link';
import { ServiceEditorForm } from '@/components/admin/ServiceEditorForm';
import { ArrowLeft } from 'lucide-react';

export default function NewServiceAdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="space-y-1">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Services List</span>
        </Link>
        <h1 className="text-2xl font-black text-navy-900">Add New Service</h1>
        <p className="text-xs text-slate-500">
          Enter service specifications, icon, featured imagery, benefits, and execution steps.
        </p>
      </div>

      <ServiceEditorForm isEditing={false} />
    </div>
  );
}
