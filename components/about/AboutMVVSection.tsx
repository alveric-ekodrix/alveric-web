import React from 'react';
import { Target, Compass, ShieldCheck, Award, HeartHandshake, Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react';

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
      {/* Mission & Vision */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            {/* Mission Card (Deep Navy with Gold Accents) */}
            <div className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-8 sm:p-10 lg:p-12 rounded-3xl border border-navy-800/90 shadow-2xl flex flex-col justify-between overflow-hidden group hover:border-gold-500/40 transition-all duration-300">
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-gold-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-13 h-13 rounded-2xl bg-gold-500/15 text-gold-400 border border-gold-500/35 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6 text-gold-400" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400 block mb-2">
                  {missionEyebrow || 'OUR PURPOSE'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 leading-tight">
                  Our Mission
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{mission}</p>
              </div>

              <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span className="text-slate-300">{missionSupportingText || 'Focused on Long-Term Client Value'}</span>
                <Target className="w-4 h-4 text-gold-400" />
              </div>
            </div>

            {/* Vision Card (Crisp Pearl White with Deep Navy Contrast) */}
            <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8 sm:p-10 lg:p-12 rounded-3xl border border-slate-200/90 shadow-lg flex flex-col justify-between overflow-hidden group hover:border-navy-900/30 hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-navy-900/5 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="w-13 h-13 rounded-2xl bg-navy-950 text-gold-400 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-600 block mb-2">
                  {visionEyebrow || 'OUR HORIZON'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight mb-4 leading-tight">
                  Our Vision
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{vision}</p>
              </div>

              <div className="relative z-10 mt-10 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="text-navy-900 font-bold">{visionSupportingText || 'Setting Regional Contracting Benchmarks'}</span>
                <Compass className="w-4 h-4 text-navy-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/40 border-b border-slate-200/90 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-600 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              <span>{valuesEyebrow || 'FOUNDATIONAL ETHICS'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight leading-tight">
              {valuesHeading || 'Our Guiding Values'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed max-w-xl mx-auto">
              {valuesSubtext || 'The non-negotiable principles that guide our interactions, job-site decisions, and craftsmanship.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueItems.map((val, idx) => {
              const title = typeof val === 'string' ? val : val.title;
              const desc = typeof val === 'string' ? null : val.description;

              // Assign contextual luxury icons based on common value themes
              const lowerTitle = title.toLowerCase();
              let IconComponent = ShieldCheck;
              if (lowerTitle.includes('quality') || lowerTitle.includes('excellence')) {
                IconComponent = Award;
              } else if (lowerTitle.includes('integrity') || lowerTitle.includes('trust') || lowerTitle.includes('ethic')) {
                IconComponent = HeartHandshake;
              } else if (lowerTitle.includes('innovation') || lowerTitle.includes('smart') || lowerTitle.includes('future')) {
                IconComponent = Lightbulb;
              } else if (lowerTitle.includes('safety') || lowerTitle.includes('care')) {
                IconComponent = ShieldCheck;
              } else {
                IconComponent = Sparkles;
              }

              return (
                <div
                  key={idx}
                  className="relative bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                >
                  {/* Top gold accent line on hover */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Header Row: Icon and Step Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-navy-950 text-gold-400 flex items-center justify-center shadow-md group-hover:bg-gold-500 group-hover:text-navy-950 group-hover:scale-110 transition-all duration-300">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black font-mono text-slate-300 tracking-wider group-hover:text-gold-500 transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-navy-950 mb-2.5 tracking-tight group-hover:text-gold-600 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                      {desc || 'Applied rigorously across planning, site operations, and client management.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-navy-950 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>Core Principle</span>
                  </div>
                </div>
              );
            })}
          </div>

          {valuesLinkText && (
            <div className="text-center mt-12">
              <a
                href="/why-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-950 hover:bg-navy-800 text-white text-xs font-bold transition shadow-sm"
              >
                <span>{valuesLinkText}</span>
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
