import React from 'react';
import Link from 'next/link';
import { HomepageSettings } from '@/types/database';
import { ArrowRight, Star } from 'lucide-react';

interface HeroSectionProps {
  settings?: HomepageSettings | null;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const eyebrow = settings?.hero_eyebrow || 'BUILDING SOLUTIONS.';
  const heading = settings?.hero_heading || 'DELIVERING\nEXCELLENCE.';
  const description =
    settings?.hero_description ||
    'Alveric Technical Contracting LLC delivers expert engineering and contracting solutions with an uncompromising commitment to quality, safety, and excellence across commercial, residential, and industrial sectors.';
  const primaryText = settings?.primary_cta_text || 'Our Services';
  const primaryUrl = settings?.primary_cta_url || '/services';
  const secondaryText = settings?.secondary_cta_text || 'Get a Quote';
  const secondaryUrl = settings?.secondary_cta_url || '/quote';
  const defaultHeroImage =
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=2070&auto=format&fit=crop';
  const heroImageUrl = settings?.hero_image?.secure_url || defaultHeroImage;
  const heroMobileImageUrl = settings?.hero_mobile_image?.secure_url || null;

  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[560px] xl:min-h-[620px] lg:max-h-[720px] flex items-center overflow-hidden bg-navy-950 text-white">
      {/* 1. FULL-WIDTH BACKGROUND IMAGE (DESKTOP + OPTIONAL MOBILE VIEW BANNER) */}
      <div className="absolute inset-0 z-0">
        {heroMobileImageUrl ? (
          <picture>
            <source media="(max-width: 767px)" srcSet={heroMobileImageUrl} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageUrl}
              alt="Alveric Technical Contracting Hero"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </picture>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroImageUrl}
            alt="Alveric Technical Contracting Hero"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        )}

        {/* 2. CINEMATIC GRADIENT OVERLAYS FOR OPTIMAL READABILITY */}
        {/* Horizontal vignette: darker on text side, opens up for photo on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/30 lg:to-transparent" />
        {/* Subtle top shade only for navbar contrast, NO bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-transparent to-transparent pointer-events-none" />
        {/* Subtle architectural tech grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-5 pointer-events-none" />
      </div>

      {/* 3. HERO FOREGROUND CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-18">
        <div className="max-w-3xl space-y-4 sm:space-y-5">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-gold-400">
              {eyebrow}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.06] uppercase drop-shadow-md">
            {heading.split('\n').map((line, index) => (
              <span key={index} className="block">
                {line}
                {index === heading.split('\n').length - 1 && (
                  <span className="text-gold-400 inline-block ml-1">.</span>
                )}
              </span>
            ))}
          </h1>

          {/* Supporting Description */}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1 sm:pt-2">
            <Link
              href={primaryUrl}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-gold-500/20 hover:scale-[1.02] transition-all duration-200 group"
            >
              <span>{primaryText}</span>
              <ArrowRight className="w-4 h-4 text-navy-950 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={secondaryUrl}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md backdrop-blur-md hover:scale-[1.02] transition-all duration-200 group"
            >
              <span>{secondaryText}</span>
              <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Badge & Social Proof */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3.5 border-t border-white/15">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-navy-950 bg-navy-800 flex items-center justify-center text-[9px] text-white font-bold">
                AT
              </div>
              <div className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-navy-950 bg-slate-700 flex items-center justify-center text-[9px] text-white font-bold">
                LC
              </div>
              <div className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-navy-950 bg-gold-600 flex items-center justify-center text-[9px] text-white font-bold">
                ENG
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center px-2 py-0.5 rounded-md bg-gold-500 text-navy-950 text-[11px] font-black shadow-xs">
                <Star className="w-3 h-3 fill-current mr-1" />
                <span>4.9 / 5.0</span>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-200">
                Trusted by 200+ Commercial & Technical Clients
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean crisp bottom gold accent border to cleanly separate from following section */}
      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 shadow-sm" />
    </section>
  );
}
