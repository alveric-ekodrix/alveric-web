import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ServiceEditorForm } from '@/components/admin/ServiceEditorForm';
import { ArrowLeft } from 'lucide-react';

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServiceAdminPage({ params }: EditServicePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: service, error } = await supabase
    .from('services')
    .select('*, icon_media:media!services_icon_media_id_fkey(*), featured_image:media!services_featured_image_id_fkey(*)')
    .eq('id', id)
    .maybeSingle();

  if (error || !service) {
    notFound();
  }

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
        <h1 className="text-2xl font-black text-navy-900">Edit Service: {service.name}</h1>
        <p className="text-xs text-slate-500">
          Update service information, gallery images, benefits, and publication status.
        </p>
      </div>

      <ServiceEditorForm initialData={service} isEditing={true} />
    </div>
  );
}
