import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ApplyStandardContentButton } from '@/components/admin/ApplyStandardContentButton';
import { AdminServicesListClient } from '@/components/admin/AdminServicesListClient';
import { Plus } from 'lucide-react';

export const revalidate = 0;

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from('services')
    .select('*, icon_media:media!services_icon_media_id_fkey(*)')
    .order('display_order', { ascending: true });

  const serviceList = services || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Services Management</h1>
          <p className="text-xs text-slate-500">
            Add, edit, reorder, feature, and publish your corporate technical services catalogue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ApplyStandardContentButton />
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </Link>
        </div>
      </div>

      <AdminServicesListClient initialServices={serviceList} />
    </div>
  );
}
