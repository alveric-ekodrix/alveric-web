import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Wrench, CheckCircle2, Sparkles } from 'lucide-react';

interface AboutHeroSectionProps {
  heading: string;
  description: string;
  bannerImageUrl?: string | null;
  bannerMobileImageUrl?: string | null;
  calculatedYears: number;
  eyebrow?: string | null;
  feature1Title?: string | null;
  feature2Title?: string | null;
  feature3Title?: string | null;
  primaryButtonText?: string | null;
  secondaryButtonText?: string | null;
  overlayLabel?: string | null;
  overlayTitle?: string | null;
}

export function AboutHeroSection({
  heading,
  description,
  bannerImageUrl,
  bannerMobileImageUrl,
  calculatedYears,
  eyebrow,
  feature1Title,
  feature2Title,
  feature3Title,
  primaryButtonText,
  secondaryButtonText,
  overlayLabel,
  overlayTitle,
}: AboutHeroSectionProps) {
  const imageUrl =
    bannerImageUrl ||
    'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1920&q=80';

  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[560px] xl:min-h-[620px] lg:max-h-[720px] flex items-center overflow-hidden bg-navy-950 text-white border-b border-navy-800">
      {/* 1. Full-Width Background Image (Responsive: Desktop + Mobile View Banner) */}
      {bannerMobileImageUrl ? (
        <>
          <div className="md:hidden absolute inset-0 z-0">
            <Image
              src={bannerMobileImageUrl}
              alt={heading || 'Alveric Technical Contracting'}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="hidden md:block absolute inset-0 z-0">
            <Image
              src={imageUrl}
              alt={heading || 'Alveric Technical Contracting'}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </>
      ) : imageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={heading || 'Alveric Technical Contracting'}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ) : null}

      {/* 2. Deep Multi-Layer Gradients for High Readability on All Viewports */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/85 to-navy-950/40 lg:to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-transparent to-transparent z-0 pointer-events-none" />

      {/* Subtle tech grid & lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-5 pointer-events-none z-0" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-18">
        <div className="max-w-3xl space-y-4 sm:space-y-5">
          {/* Eyebrow & Experience Badge Row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/35 text-gold-400 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>{eyebrow || 'ABOUT ALVERIC TECHNICAL CONTRACTING'}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-900/80 border border-gold-500/30 backdrop-blur-md text-xs font-bold text-slate-200 shadow-sm">
              <span className="text-gold-400 font-black">{calculatedYears}+ Years</span>
              <span className="text-slate-300">Experience</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-md">
            {heading}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl drop-shadow-sm font-normal">
              {description}
            </p>
          )}

          {/* Quick Trust Highlights (Mobile Stack, Tablet/Desktop 3-Cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5 max-w-3xl">
            <div className="flex items-center gap-2 p-2 sm:py-2 sm:px-2.5 rounded-lg bg-navy-900/85 backdrop-blur-md border border-navy-700/70 text-[11px] sm:text-xs text-slate-100 shadow-sm">
              <div className="w-5 h-5 rounded-md bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3 h-3 text-gold-400" />
              </div>
              <span className="font-bold">{feature1Title || 'Licensed Contractor'}</span>
            </div>
            <div className="flex items-center gap-2 p-2 sm:py-2 sm:px-2.5 rounded-lg bg-navy-900/85 backdrop-blur-md border border-navy-700/70 text-[11px] sm:text-xs text-slate-100 shadow-sm">
              <div className="w-5 h-5 rounded-md bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                <Wrench className="w-3 h-3 text-gold-400" />
              </div>
              <span className="font-bold">{feature2Title || 'Full-Scope MEP & Civil'}</span>
            </div>
            <div className="flex items-center gap-2 p-2 sm:py-2 sm:px-2.5 rounded-lg bg-navy-900/85 backdrop-blur-md border border-navy-700/70 text-[11px] sm:text-xs text-slate-100 shadow-sm">
              <div className="w-5 h-5 rounded-md bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3 text-gold-400" />
              </div>
              <span className="font-bold">{feature3Title || 'ISO Quality Standards'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {(primaryButtonText || secondaryButtonText) && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {primaryButtonText && (
                <a
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-gold-500/25 transition-all duration-200 text-center"
                >
                  <span>{primaryButtonText}</span>
                </a>
              )}
              {secondaryButtonText && (
                <a
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/25 backdrop-blur-md transition-all duration-200 shadow-md text-center"
                >
                  <span>{secondaryButtonText}</span>
                </a>
              )}
            </div>
          )}

          {/* Optional Overlay Title Card */}
          {(overlayLabel || overlayTitle) && (
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
              {overlayLabel && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30">
                  {overlayLabel}
                </span>
              )}
              {overlayTitle && (
                <span className="text-xs text-slate-200 font-medium">
                  {overlayTitle}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
