import React from 'react';
import { PublicLayoutWrapper } from '@/components/layout/PublicLayout';

// Enable ISR revalidation for instantaneous page delivery from edge cache
export const revalidate = 60;

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayoutWrapper>{children}</PublicLayoutWrapper>;
}
