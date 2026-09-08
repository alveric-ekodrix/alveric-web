import React from 'react';
import { getAboutSettings, getSiteStatistics } from '@/lib/data/public';
import { AboutHeroSection } from '@/components/about/AboutHeroSection';
import { AboutStorySection } from '@/components/about/AboutStorySection';
import { AboutMVVSection } from '@/components/about/AboutMVVSection';
import { AboutStatsStrip } from '@/components/about/AboutStatsStrip';
import { AboutCtaSection } from '@/components/about/AboutCtaSection';

export const revalidate = 60;

export const metadata = {
  title: 'About Us | Alveric Technical Contracting LLC',
  description:
    'Learn about Alveric Technical Contracting LLC — our mission, vision, engineering values, and the team behind every precision project we deliver.',
};

export default async function AboutPage() {
  const [aboutSettings, statistics] = await Promise.all([
    getAboutSettings(),
    getSiteStatistics('about'),
  ]);

  const heading = aboutSettings?.heading?.trim() || 'About Alveric Technical Contracting LLC';
  const description = aboutSettings?.description?.trim() || '';
  const story = aboutSettings?.story?.trim() || '';
  const mission = aboutSettings?.mission?.trim() || '';
  const vision = aboutSettings?.vision?.trim() || '';
  const values = aboutSettings?.values?.trim() || '';
  const bannerImageUrl = aboutSettings?.banner_image?.secure_url || null;

  // Split values string into bullet items (comma, pipe, bullet, or newline separated)
  const valueItems = values
    ? values
        .split(/[,|•\n]/)
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
    : [];

  // Dynamic experience calculation (5+ years in 2026, increments yearly)
  const currentYear = new Date().getFullYear();
  const calculatedYears = Math.max(5, 5 + (currentYear - 2026));

  return (
    <div className="w-full flex flex-col bg-white">
      <AboutHeroSection
        heading={heading}
        description={description}
        bannerImageUrl={bannerImageUrl}
        calculatedYears={calculatedYears}
      />
      {story && <AboutStorySection story={story} />}
      {(mission || vision || valueItems.length > 0) && (
        <AboutMVVSection mission={mission} vision={vision} valueItems={valueItems} />
      )}
      {statistics && statistics.length > 0 && (
        <AboutStatsStrip statistics={statistics} calculatedYears={calculatedYears} />
      )}
      <AboutCtaSection />
    </div>
  );
}
