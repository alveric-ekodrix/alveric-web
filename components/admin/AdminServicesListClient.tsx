'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Service } from '@/types/database';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { useAdminToast } from '@/components/admin/AdminToastProvider';
import { Edit, Trash2, Wrench, Plus } from 'lucide-react';

interface AdminServicesListClientProps {
  initialServices: Service[];
}

export function AdminServicesListClient({ initialServices }: AdminServicesListClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();
  const { showToast } = useAdminToast();

  async function handleDeleteConfirm() {
    if (!serviceToDelete) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceToDelete.id);

      if (error) {
        throw error;
      }

      // Revalidate public caches
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paths: ['/', '/services', `/services/${serviceToDelete.slug}`],
          }),
        });
      } catch (revErr) {
        console.warn('Revalidation notice:', revErr);
      }

      // Remove from state immediately
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      showToast(`Service "${serviceToDelete.name}" deleted successfully.`, 'success');
      setServiceToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete service:', err);
      showToast(err?.message || 'Failed to delete service. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  if (services.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Icon</th>
                <th className="py-3 px-4">Service Name &amp; Slug</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service) => (
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
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setServiceToDelete(service)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Service"
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
        isOpen={!!serviceToDelete}
        title="Delete Service"
        message={
          <>
            Are you sure you want to delete <span className="font-bold text-navy-900">&quot;{serviceToDelete?.name}&quot;</span>?
            This will remove the service from your catalogue, homepage carousel, and public navigation.
          </>
        }
        confirmText="Delete Service"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          if (!isDeleting) setServiceToDelete(null);
        }}
      />
    </>
  );
}
