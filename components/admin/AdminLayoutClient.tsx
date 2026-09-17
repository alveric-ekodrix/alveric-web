'use client';

import React from 'react';
import { AdminToastProvider } from '@/components/admin/AdminToastProvider';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return <AdminToastProvider>{children}</AdminToastProvider>;
}
