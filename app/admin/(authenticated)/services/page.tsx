import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { ApplyStandardContentButton } from '@/components/admin/ApplyStandardContentButton';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';

export const revalidate = 0;

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data: services, error } = await supabase
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

      {serviceList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-navy-900">No Services in Database</h2>
          <p className="text-xs text-slate-500">
            Get started by creating your first technical service entry.
          </p>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-500 text-navy-950 rounded-lg text-xs font-bold hover:bg-gold-400 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Service</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Icon</th>
                  <th className="py-3 px-4">Service Name & Slug</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {serviceList.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-1.5">
                        <ServiceIcon
                          iconUrl={service.icon_media?.secure_url}
                          slug={service.slug}
                          name={service.name}
                          className="w-6 h-6"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-navy-900 block">{service.name}</span>
                      <span className="font-mono text-[11px] text-slate-400">/{service.slug}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                      {service.display_order}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          service.is_published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {service.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {service.is_featured ? (
                        <span className="text-[11px] font-bold text-gold-600">★ Yes</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="inline-block p-1 text-slate-400 hover:text-navy-900 transition"
                        title="Edit Service"
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
