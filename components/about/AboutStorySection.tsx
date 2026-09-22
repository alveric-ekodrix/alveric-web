import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutStorySectionProps {
  story: string;
  eyebrow?: string | null;
  heading?: string | null;
  buttonText?: string | null;
  storyImageUrl?: string | null;
  storyImageOverlayTitle?: string | null;
  benefits?: string[] | null;
}

export function AboutStorySection({
  story,
  eyebrow,
  heading,
  buttonText,
  storyImageUrl,
  storyImageOverlayTitle,
  benefits,
}: AboutStorySectionProps) {
  const defaultCommitments = [
    {
      title: 'Certified Engineering Specialists',
      desc: 'Dedicated supervisors, certified electricians, and HVAC engineers on every project.',
    },
    {
      title: 'Regulatory & Code Compliance',
      desc: 'Strict adherence to regional civil defense, municipality, and environmental health regulations.',
    },
    {
      title: 'Transparent Pricing & Accountability',
      desc: 'Clear bills of quantities, defined milestone schedules, and complete cost transparency.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200/80 relative overflow-hidden">
      {/* Subtle decorative background blur */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Journey Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-600 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                <span>{eyebrow || 'OUR JOURNEY & EXPERTISE'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight leading-tight">
                {heading || 'Built on Foundations of Trust, Technical Rigor, and Integrity'}
              </h2>
            </div>

            {/* Story Paragraphs Styled Elegantly */}
            <div className="relative pl-5 border-l-2 border-gold-500/60 py-1 space-y-4">
              <p className="text-base sm:text-lg font-medium text-navy-950 leading-relaxed tracking-tight">
                {story}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                <span>Excellence in Engineering &amp; Technical Contracting</span>
              </div>
            </div>

            {/* Core Commitments / Benefits Points - Responsive Grid */}
            <div className="pt-2">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400 mb-3 block">
                CORE COMMITMENTS &amp; STANDARDS
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
                {benefits && benefits.length > 0
                  ? benefits.map((b, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-gold-500/50 hover:-translate-y-0.5 transition-all duration-200 group"
                      >
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-600 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] sm:text-sm font-bold text-navy-900 group-hover:text-navy-950 leading-snug">
                            {b}
                          </h4>
                        </div>
                      </div>
                    ))
                  : defaultCommitments.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-gold-500/50 hover:-translate-y-0.5 transition-all duration-200 group"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-600 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] sm:text-sm font-bold text-navy-900 group-hover:text-gold-600 transition-colors leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-tight sm:leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <span>{buttonText || 'Explore Our Capabilities'}</span>
                <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all duration-200 text-center"
              >
                <span>Request Quotation</span>
              </Link>
            </div>
          </div>

          {/* Right: Story Showcase Image from Admin with Mobile Optimization */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-navy-950 group ring-1 ring-slate-200/80">
              {storyImageUrl ? (
                <Image
                  src={storyImageUrl}
                  alt={heading || 'Alveric Contracting Story'}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-center text-white">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-3 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-base font-black text-white mb-1">Our Story &amp; Journey</span>
                  <span className="text-xs text-slate-300 max-w-xs leading-relaxed">
                    Building Solutions. Delivering Excellence across the UAE.
                  </span>
                </div>
              )}

              {/* Bottom Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent pointer-events-none" />

              {/* Floating Glassmorphism Badge */}
              <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 z-10 p-3.5 sm:p-4 rounded-2xl bg-navy-950/85 backdrop-blur-md border border-white/20 text-white shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-400 block mb-0.5">
                      ALVERIC COMMITMENT
                    </span>
                    <span className="text-xs sm:text-sm font-bold leading-snug text-white block truncate">
                      {storyImageOverlayTitle || 'Creating Smarter Spaces for Better Lives'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-500/35 flex items-center justify-center text-gold-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gold-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
