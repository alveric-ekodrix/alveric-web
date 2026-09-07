import React from 'react';
import { PublicLayoutWrapper } from '@/components/layout/PublicLayout';

// All public pages are database-driven — always render dynamically at request time.
export const dynamic = 'force-dynamic';

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayoutWrapper>{children}</PublicLayoutWrapper>;
}
