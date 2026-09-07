import React from 'react';
import { getAboutSettings, getSiteStatistics } from '@/lib/data/public';
import { AboutHeroSection } from '@/components/about/AboutHeroSection';
import { AboutStorySection } from '@/components/about/AboutStorySection';
import { AboutPillarsSection } from '@/components/about/AboutPillarsSection';
import { AboutMVVSection } from '@/components/about/AboutMVVSection';
import { AboutProcessSection } from '@/components/about/AboutProcessSection';
import { AboutStatsStrip } from '@/components/about/AboutStatsStrip';
import { AboutCtaSection } from '@/components/about/AboutCtaSection';

export const revalidate = 60;

export const metadata = {
  title: 'About Us | Alveric Technical Contracting LLC',
  description:
    'Learn about Alveric Technical Contracting LLC — our mission, vision, engineering values, and the team behind every precision project we deliver.',
};

const DEFAULT_ABOUT = {
  heading: 'Pioneering Technical Excellence in Modern Contracting',
  description:
    'Alveric Technical Contracting LLC delivers end-to-end engineering, electro-mechanical, and specialized building contracting solutions engineered to the highest standards of safety, quality, and durability.',
  story:
    'Founded with a commitment to bridge the gap between engineering precision and contracting efficiency, Alveric Technical Contracting LLC has grown into a trusted partner for commercial developers, facility managers, and residential property owners. Our multi-disciplinary team brings deep expertise across MEP installations, building refurbishment, HVAC systems, and technical maintenance—delivering robust infrastructure solutions that stand the test of time.',
  mission:
    'To deliver premier contracting and technical engineering solutions that enhance structural performance, operational safety, and client value through disciplined craftsmanship, rigorous quality control, and ethical business practices.',
  vision:
    'To be recognized as the premier technical contracting firm of choice in the region, celebrated for engineering innovation, sustainable contracting standards, and unwavering project delivery.',
  values:
    'Integrity & Transparency, Safety First, Engineering Precision, Client-Centric Collaboration, and Uncompromising Quality in every project detail.',
};

export default async function AboutPage() {
  const [aboutSettings, statistics] = await Promise.all([
    getAboutSettings(),
    getSiteStatistics('about'),
  ]);

  const heading = aboutSettings?.heading?.trim() || DEFAULT_ABOUT.heading;
  const description = aboutSettings?.description?.trim() || DEFAULT_ABOUT.description;
  const story = aboutSettings?.story?.trim() || DEFAULT_ABOUT.story;
  const mission = aboutSettings?.mission?.trim() || DEFAULT_ABOUT.mission;
  const vision = aboutSettings?.vision?.trim() || DEFAULT_ABOUT.vision;
  const values = aboutSettings?.values?.trim() || DEFAULT_ABOUT.values;
  const bannerImageUrl = aboutSettings?.banner_image?.secure_url || null;

  // Split values string into bullet items (comma, pipe, bullet, or newline separated)
  const valueItems = values
    .split(/[,|•\n]/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

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
      <AboutStorySection story={story} />
      <AboutPillarsSection />
      <AboutMVVSection mission={mission} vision={vision} valueItems={valueItems} />
      <AboutProcessSection />
      <AboutStatsStrip statistics={statistics ?? []} calculatedYears={calculatedYears} />
      <AboutCtaSection />
    </div>
  );
}
