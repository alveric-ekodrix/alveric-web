import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

// All authenticated admin pages require live Supabase auth — never statically prerender.
export const dynamic = 'force-dynamic';

export default function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
