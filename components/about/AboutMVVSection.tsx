import React from 'react';
import { Target, Compass, ShieldCheck, Award, HeartHandshake, Lightbulb, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface AboutMVVSectionProps {
  mission: string;
  vision: string;
  valueItems: (string | { title: string; description?: string })[];
  missionEyebrow?: string | null;
  missionSupportingText?: string | null;
  visionEyebrow?: string | null;
  visionSupportingText?: string | null;
  valuesEyebrow?: string | null;
  valuesHeading?: string | null;
  valuesSubtext?: string | null;
  valuesLinkText?: string | null;
}

export function AboutMVVSection({
  mission,
  vision,
  valueItems,
  missionEyebrow,
  missionSupportingText,
  visionEyebrow,
  visionSupportingText,
  valuesEyebrow,
  valuesHeading,
  valuesSubtext,
  valuesLinkText,
}: AboutMVVSectionProps) {
  return (
    <>
      {/* ── Mission & Vision ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-gold-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-navy-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8 items-stretch">

            {/* Mission Card — deep navy */}
            <div className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-[#0a1628] text-white rounded-2xl sm:rounded-[2rem] border border-navy-800/60 shadow-xl sm:shadow-2xl flex flex-col overflow-hidden group hover:shadow-gold-500/10 transition-all duration-500">
              {/* Mesh grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              {/* Gold radial glow */}
              <div className="absolute -top-20 -right-20 w-48 sm:w-72 h-48 sm:h-72 bg-gold-500/12 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-gold-500/0 via-gold-500 to-gold-500/0 opacity-70 flex-shrink-0" />

              <div className="flex flex-col flex-1 p-3.5 sm:p-8 lg:p-12 relative z-10">
                <div className="flex items-start justify-between mb-3 sm:mb-8">
                  <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-500/25 to-gold-600/10 border border-gold-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Target className="w-4 h-4 sm:w-7 sm:h-7 text-gold-400" strokeWidth={1.75} />
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.22em] text-gold-500/70 pt-0.5 sm:pt-1">
                    {missionEyebrow || 'OUR PURPOSE'}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-sm sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight sm:leading-[1.1] mb-2 sm:mb-5">
                    Our <span className="text-gold-400">Mission</span>
                  </h2>
                  <p className="text-slate-300 text-[11px] sm:text-sm lg:text-base leading-relaxed sm:leading-[1.8]">{mission}</p>
                </div>

                <div className="mt-4 sm:mt-10 pt-2.5 sm:pt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-400 line-clamp-1">
                    {missionSupportingText || 'Focused on Long-Term Client Value'}
                  </span>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0 ml-2">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Card — pearl white */}
            <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50/60 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-lg sm:shadow-xl flex flex-col overflow-hidden group hover:shadow-2xl hover:border-navy-200 transition-all duration-500">
              {/* Navy glow */}
              <div className="absolute -top-20 -right-20 w-48 sm:w-72 h-48 sm:h-72 bg-navy-900/6 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-navy-900/0 via-navy-900 to-navy-900/0 opacity-25 flex-shrink-0" />

              <div className="flex flex-col flex-1 p-3.5 sm:p-8 lg:p-12 relative z-10">
                <div className="flex items-start justify-between mb-3 sm:mb-8">
                  <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-navy-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Compass className="w-4 h-4 sm:w-7 sm:h-7 text-gold-400" strokeWidth={1.75} />
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.22em] text-gold-600/70 pt-0.5 sm:pt-1">
                    {visionEyebrow || 'OUR HORIZON'}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-sm sm:text-3xl lg:text-4xl font-black text-navy-950 tracking-tight leading-tight sm:leading-[1.1] mb-2 sm:mb-5">
                    Our <span className="text-gold-600">Vision</span>
                  </h2>
                  <p className="text-slate-600 text-[11px] sm:text-sm lg:text-base leading-relaxed sm:leading-[1.8]">{vision}</p>
                </div>

                <div className="mt-4 sm:mt-10 pt-2.5 sm:pt-5 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-semibold text-navy-900 line-clamp-1">
                    {visionSupportingText || 'Setting Regional Benchmarks'}
                  </span>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-navy-950 flex items-center justify-center shrink-0 ml-2">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 relative overflow-hidden border-b border-slate-200/80" style={{ background: 'linear-gradient(160deg,#f8fafc 0%,#f1f5f9 40%,#fefefe 100%)' }}>
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[56rem] h-[56rem] bg-gold-500/4 rounded-full blur-3xl pointer-events-none" />
        {/* Dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gold-500/30 shadow-sm text-gold-600 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              <span>{valuesEyebrow || 'FOUNDATIONAL ETHICS'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight leading-tight mb-4">
              {valuesHeading || 'Our Guiding Values'}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
              {valuesSubtext || 'The non-negotiable principles that guide our interactions, job-site decisions, and craftsmanship.'}
            </p>
          </div>

          {/* Values grid — uniform clean luxury cards, 2-cols on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {valueItems.map((val, idx) => {
              const title = typeof val === 'string' ? val : val.title;
              const desc = typeof val === 'string' ? null : val.description;

              const lowerTitle = title.toLowerCase();
              let IconComponent = ShieldCheck;
              if (lowerTitle.includes('quality') || lowerTitle.includes('excellence')) IconComponent = Award;
              else if (lowerTitle.includes('integrity') || lowerTitle.includes('trust') || lowerTitle.includes('ethic')) IconComponent = HeartHandshake;
              else if (lowerTitle.includes('innovation') || lowerTitle.includes('smart') || lowerTitle.includes('future')) IconComponent = Lightbulb;
              else if (lowerTitle.includes('safety') || lowerTitle.includes('care')) IconComponent = ShieldCheck;
              else IconComponent = Sparkles;

              return (
                <div
                  key={idx}
                  className="relative rounded-2xl sm:rounded-[1.5rem] bg-white text-navy-950 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-gold-500/40 overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1.5"
                >
                  {/* Glow blob */}
                  <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-2xl pointer-events-none bg-gold-500/8 transition-transform duration-700 group-hover:scale-125" />
                  {/* Number badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-5 text-[10px] sm:text-[11px] font-black font-mono tracking-widest text-slate-300 group-hover:text-gold-500 transition-colors">
                    0{idx + 1}
                  </div>

                  <div className="relative z-10 p-3.5 sm:p-7 flex flex-col flex-1">
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center mb-3 sm:mb-6 transition-all duration-300 group-hover:scale-105 shadow-md">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" strokeWidth={1.75} />
                    </div>

                    <h3 className="text-xs sm:text-xl font-black tracking-tight mb-1 sm:mb-3 text-navy-950 group-hover:text-gold-600 transition-colors">
                      {title}
                    </h3>
                    <p className="text-[11px] sm:text-sm leading-snug sm:leading-relaxed text-slate-500 flex-1">
                      {desc || 'Applied rigorously across planning, site operations, and client management.'}
                    </p>

                    <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t border-slate-100 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-bold text-slate-400 group-hover:text-navy-800 transition-colors">
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-500 shrink-0" />
                      <span>Core Principle</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA link */}
          {valuesLinkText && (
            <div className="text-center mt-14">
              <a
                href="/why-us"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-navy-950 hover:bg-navy-800 text-white text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
              >
                <span>{valuesLinkText}</span>
                <ArrowUpRight className="w-4 h-4 text-gold-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
