import React from 'react';
import {
  getHomepageSettings,
  getPublishedServices,
  getSiteStatistics,
  getPublishedProjects,
} from '@/lib/data/public';
import { HeroSection } from '@/components/hero/HeroSection';
import { ServicesQuickNav } from '@/components/services/ServicesQuickNav';
import { HomeAboutSection } from '@/components/about/HomeAboutSection';
import { HomeServicesSection } from '@/components/services/HomeServicesSection';
import { TrustBadgesSection } from '@/components/home/TrustBadgesSection';
import { HomeProjectsSection } from '@/components/projects/HomeProjectsSection';
import { HomeCtaSection } from '@/components/cta/HomeCtaSection';

// Pre-render and cache at edge, instantly revalidated on admin updates
export const revalidate = 60;

export default async function HomePage() {
  const [homepageSettings, services, statistics, projects] = await Promise.all([
    getHomepageSettings(),
    getPublishedServices(),
    getSiteStatistics('about'),
    getPublishedProjects(),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO */}
      <HeroSection settings={homepageSettings} />

      {/* 2. SERVICES QUICK NAVIGATION (OR SEPARATOR) */}
      {services && services.length > 0 ? (
        <ServicesQuickNav services={services} />
      ) : (
        <div className="w-full h-8 bg-slate-100 border-y border-slate-200" />
      )}

      {/* 3. ABOUT ALVERIC */}
      <HomeAboutSection settings={homepageSettings} statistics={statistics} />

      {/* 4. SERVICES */}
      <HomeServicesSection services={services} />

      {/* 4.5. TRUST BADGES */}
      <TrustBadgesSection />

      {/* 5. PROJECTS */}
      <HomeProjectsSection projects={projects} />

      {/* 6. CTA BANNER */}
      <HomeCtaSection settings={homepageSettings} />
    </div>
  );
}
