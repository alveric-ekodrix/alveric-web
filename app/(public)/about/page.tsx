import React from 'react';
import type { Metadata } from 'next';
import {
  getAboutSettings,
  getSiteStatistics,
  getCompanySettings,
} from '@/lib/data/public';
import { AboutHeroSection } from '@/components/about/AboutHeroSection';
import { AboutStatsStrip } from '@/components/about/AboutStatsStrip';
import { AboutStorySection } from '@/components/about/AboutStorySection';
import { AboutMVVSection } from '@/components/about/AboutMVVSection';
import { AboutPillarsSection } from '@/components/about/AboutPillarsSection';
import { AboutProcessSection } from '@/components/about/AboutProcessSection';
import { AboutCtaSection } from '@/components/about/AboutCtaSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About Us | Alveric Technical Contracting LLC',
  description:
    'Building A Better Tomorrow — Alveric Technical Contracting delivers reliable, innovative, and high-quality contracting solutions across the UAE.',
};

export default async function AboutPage() {
  const [aboutSettings, statistics, companySettings] = await Promise.all([
    getAboutSettings(),
    getSiteStatistics('about'),
    getCompanySettings(),
  ]);

  const heading = aboutSettings?.heading?.trim() || 'pioneering technical intelligence';
  const description =
    aboutSettings?.description?.trim() ||
    'Alveric Technical Contracting delivers reliable, innovative, and high-quality contracting solutions across commercial, residential, and industrial projects.';
  const story =
    aboutSettings?.story?.trim() ||
    'Alveric Technical Contracting was founded with a clear vision — to deliver high-quality technical contracting services that create lasting value. Over the years, we have grown through our commitment to excellence, integrity, and innovation, becoming a trusted partner for clients across the UAE.';
  const mission =
    aboutSettings?.mission?.trim() ||
    'To deliver safe, reliable, and innovative contracting solutions that enhance communities and create long-term value for our clients, people, and partners.';
  const vision =
    aboutSettings?.vision?.trim() ||
    'To be a regional leader in technical contracting, recognized for quality, integrity, and a commitment to building a better tomorrow.';

  const cleanWhatsapp =
    (companySettings?.whatsapp_number || companySettings?.phone_primary)?.replace(/\D/g, '') ||
    '971569919792';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        'Hello Alveric Team, I would like to learn more about your contracting services.'
      )}`
    : null;

  // Calculate years of experience from company founding or fallback to 5
  const rawFoundingYear = (companySettings as any)?.founding_year;
  const foundingYear = rawFoundingYear ? parseInt(String(rawFoundingYear), 10) : 2019;
  const currentYear = new Date().getFullYear();
  const calculatedYears = Math.max(5, currentYear - foundingYear);

  // Dynamic values parsed from database (JSONB array or pipe-delimited string)
  let parsedValues: (string | { title: string; description?: string })[] = [
    { title: 'Integrity', description: "We do what's right, always." },
    { title: 'Quality', description: 'We never compromise on standards.' },
    { title: 'Safety', description: 'People and safety come first.' },
    { title: 'Innovation', description: 'We embrace smarter solutions.' },
  ];

  if (Array.isArray(aboutSettings?.values_items) && aboutSettings.values_items.length > 0) {
    parsedValues = (aboutSettings.values_items as any[]).map((v) =>
      typeof v === 'string'
        ? v
        : {
            title: v?.title || '',
            description: v?.description || undefined,
          }
    );
  } else if (aboutSettings?.values) {
    const split = aboutSettings.values.split('|').map((v) => v.trim()).filter(Boolean);
    if (split.length > 0) {
      parsedValues = split.map((v) => {
        const [title, ...rest] = v.split(':');
        return {
          title: title?.trim() || v,
          description: rest.join(':').trim() || undefined,
        };
      });
    }
  }

  const bannerImageUrl =
    aboutSettings?.banner_image?.secure_url ||
    'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1920&q=80';
  const bannerMobileImageUrl = aboutSettings?.banner_mobile_image?.secure_url || null;

  return (
    <div className="w-full bg-white text-slate-800">
      {/* 1. HERO SECTION */}
      <AboutHeroSection
        heading={heading}
        description={description}
        bannerImageUrl={bannerImageUrl}
        bannerMobileImageUrl={bannerMobileImageUrl}
        calculatedYears={calculatedYears}
        eyebrow={aboutSettings?.hero_eyebrow}
        feature1Title={aboutSettings?.hero_feature_1_title}
        feature2Title={aboutSettings?.hero_feature_2_title}
        feature3Title={aboutSettings?.hero_feature_3_title}
        primaryButtonText={aboutSettings?.hero_primary_button}
        secondaryButtonText={aboutSettings?.hero_secondary_button}
        overlayLabel={aboutSettings?.hero_overlay_label}
        overlayTitle={aboutSettings?.hero_overlay_title}
      />

      {/* 2. STATS STRIP */}
      <AboutStatsStrip
        statistics={statistics || []}
        calculatedYears={calculatedYears}
      />

      {/* 3. OUR STORY SECTION */}
      <AboutStorySection
        story={story}
        eyebrow={aboutSettings?.story_eyebrow}
        heading={aboutSettings?.story_heading}
        buttonText={aboutSettings?.story_button}
        storyImageUrl={
          aboutSettings?.story_image?.secure_url ||
          (typeof aboutSettings?.story_image === 'string' ? aboutSettings.story_image : null) ||
          (aboutSettings as any)?.story_image_url ||
          null
        }
        storyImageOverlayTitle={aboutSettings?.story_image_overlay_title}
        benefits={
          Array.isArray(aboutSettings?.why_choose_benefits)
            ? (aboutSettings.why_choose_benefits as unknown as string[])
            : null
        }
      />

      {/* 4. MISSION & VISION & VALUES */}
      <AboutMVVSection
        mission={mission}
        vision={vision}
        valueItems={parsedValues}
        missionEyebrow={aboutSettings?.mission_eyebrow}
        missionSupportingText={aboutSettings?.mission_supporting_text}
        visionEyebrow={aboutSettings?.vision_eyebrow}
        visionSupportingText={aboutSettings?.vision_supporting_text}
        valuesLinkText={aboutSettings?.values_link_text}
      />

      {/* 5. STANDARDS & PILLARS (WHY CHOOSE) */}
      <AboutPillarsSection
        eyebrow={aboutSettings?.why_choose_eyebrow}
        heading={aboutSettings?.why_choose_heading}
        description={aboutSettings?.why_choose_description}
      />

      {/* 6. METHODOLOGY & PROCESS */}
      <AboutProcessSection />

      {/* 7. BOTTOM CTA SECTION */}
      <AboutCtaSection
        eyebrow={aboutSettings?.cta_eyebrow}
        heading={aboutSettings?.cta_heading}
        description={aboutSettings?.cta_description}
        primaryButtonText={aboutSettings?.cta_primary_button}
        secondaryButtonText={aboutSettings?.cta_secondary_button}
        whatsappUrl={whatsappUrl}
        backgroundImageUrl={
          aboutSettings?.cta_image?.secure_url ||
          (typeof aboutSettings?.cta_image === 'string' ? aboutSettings.cta_image : null) ||
          (aboutSettings as any)?.cta_image_url ||
          null
        }
      />
    </div>
  );
}
