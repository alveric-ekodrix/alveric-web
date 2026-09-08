import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Wrench, CheckCircle2, Sparkles } from 'lucide-react';

interface AboutHeroSectionProps {
  heading: string;
  description: string;
  bannerImageUrl?: string | null;
  calculatedYears: number;
}

export function AboutHeroSection({
  heading,
  description,
  bannerImageUrl,
  calculatedYears,
}: AboutHeroSectionProps) {
  const imageUrl = bannerImageUrl || null;

  return (
    <section className="relative bg-navy-950 text-white py-20 lg:py-28 overflow-hidden border-b border-navy-800">
      {/* Background Pattern & Ambient Lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B2239_1px,transparent_1px),linear-gradient(to_bottom,#0B2239_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left: Headline & Introduction */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-[0.18em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT ALVERIC TECHNICAL CONTRACTING</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              {heading}
            </h1>

            {description && (
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {description}
              </p>
            )}

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-900/80 border border-navy-800 text-xs text-slate-200">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-semibold">Licensed Contractor</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-900/80 border border-navy-800 text-xs text-slate-200">
                <Wrench className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-semibold">Full-Scope MEP &amp; Civil</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-900/80 border border-navy-800 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-semibold">ISO Quality Standards</span>
              </div>
            </div>
          </div>

          {/* Right: Showcase Image & Experience Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Hero Photo */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-navy-800/80 bg-navy-900 group">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Alveric Technical Contracting Engineering Site"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-3 shadow-inner">
                      <ShieldCheck className="w-8 h-8 text-gold-400" />
                    </div>
                    <span className="text-sm font-bold text-white mb-1">
                      ALVERIC Technical Contracting
                    </span>
                    <span className="text-[11px] text-slate-400 max-w-xs">
                      Building Solutions. Delivering Excellence.
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 block">
                    ENGINEERED INFRASTRUCTURE
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-100">
                    Delivering excellence across modern commercial &amp; residential developments
                  </span>
                </div>
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute -bottom-6 -left-6 z-20 p-4 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 text-navy-950 shadow-2xl border-2 border-white/40 flex items-center gap-3.5">
                <div className="text-3xl font-black leading-none">{calculatedYears}+</div>
                <div className="text-[11px] font-black uppercase tracking-wider leading-tight text-navy-950">
                  Years of<br />Technical<br />Excellence
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
