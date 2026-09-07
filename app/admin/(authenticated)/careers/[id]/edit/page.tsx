import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { JobEditorForm } from '@/components/admin/JobEditorForm';
import { ArrowLeft } from 'lucide-react';

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobAdminPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !job) {
    notFound();
  }

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
        <h1 className="text-2xl font-black text-navy-900">Edit Opening: {job.title}</h1>
        <p className="text-xs text-slate-500">
          Modify position requirements, responsibilities, and visibility.
        </p>
      </div>

      <JobEditorForm initialData={job} isEditing={true} />
    </div>
  );
}
