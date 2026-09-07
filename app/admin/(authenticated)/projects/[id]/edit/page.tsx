import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProjectEditorForm } from '@/components/admin/ProjectEditorForm';
import { ArrowLeft } from 'lucide-react';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectAdminPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from('projects')
    .select('*, thumbnail_media:media!projects_thumbnail_media_id_fkey(*), featured_image:media!projects_featured_image_id_fkey(*)')
    .eq('id', id)
    .maybeSingle();

  if (error || !project) {
    notFound();
  }

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
        <h1 className="text-2xl font-black text-navy-900">Edit Project: {project.title}</h1>
        <p className="text-xs text-slate-500">
          Update case study data, category, project results, and imagery.
        </p>
      </div>

      <ProjectEditorForm initialData={project} isEditing={true} />
    </div>
  );
}
