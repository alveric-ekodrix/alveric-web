import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Wrench, CheckCircle2, Sparkles } from 'lucide-react';

interface AboutHeroSectionProps {
  heading: string;
  description: string;
  bannerImageUrl?: string | null;
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
    <section className="relative bg-navy-950 text-white py-20 sm:py-28 lg:py-36 overflow-hidden border-b border-navy-800 min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* 1. Full-Width Wide Background Image */}
      {imageUrl && (
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
      )}

      {/* 2. Deep Multi-Layer Gradients for High Readability on All Viewports */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/90 to-navy-950/65 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/80 z-0 pointer-events-none" />

      {/* Subtle tech grid & lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B2239_1px,transparent_1px),linear-gradient(to_bottom,#0B2239_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none z-0" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="max-w-3xl space-y-6">
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] drop-shadow-md">
            {heading}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl drop-shadow-sm font-normal">
              {description}
            </p>
          )}

          {/* Quick Trust Highlights (Mobile Stack, Tablet/Desktop 3-Cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-3xl">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/85 backdrop-blur-md border border-navy-700/70 text-xs sm:text-sm text-slate-100 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
              </div>
              <span className="font-bold">{feature1Title || 'Licensed Contractor'}</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/85 backdrop-blur-md border border-navy-700/70 text-xs sm:text-sm text-slate-100 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 text-gold-400" />
              </div>
              <span className="font-bold">{feature2Title || 'Full-Scope MEP & Civil'}</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/85 backdrop-blur-md border border-navy-700/70 text-xs sm:text-sm text-slate-100 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
              </div>
              <span className="font-bold">{feature3Title || 'ISO Quality Standards'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {(primaryButtonText || secondaryButtonText) && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
              {primaryButtonText && (
                <a
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-gold-500/25 transition-all duration-200 text-center"
                >
                  <span>{primaryButtonText}</span>
                </a>
              )}
              {secondaryButtonText && (
                <a
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-navy-900/85 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all duration-200 shadow-md text-center"
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
