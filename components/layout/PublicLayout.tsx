import React from 'react';
import { getCompanySettings, getPublishedServices } from '@/lib/data/public';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export async function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [companySettings, services] = await Promise.all([
    getCompanySettings(),
    getPublishedServices(),
  ]);

  return (
    <>
      <Header companySettings={companySettings} services={services} />
      <main className="flex-1">{children}</main>
      <Footer companySettings={companySettings} services={services} />
    </>
  );
}
