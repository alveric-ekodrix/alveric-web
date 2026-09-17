import React from 'react';
import { Target, Compass } from 'lucide-react';

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
      <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Mission Card (Deep Navy) */}
            <div className="relative bg-navy-950 text-white p-8 sm:p-10 rounded-3xl border border-navy-800 shadow-xl flex flex-col justify-between overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400 block mb-2">
                  {missionEyebrow || 'OUR PURPOSE'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
                  Our Mission
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{mission}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>{missionSupportingText || 'Focused on Long-Term Client Value'}</span>
                <Target className="w-4 h-4 text-gold-400" />
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative bg-slate-50/80 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center mb-6 shadow-sm">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-600 block mb-2">
                  {visionEyebrow || 'OUR HORIZON'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight mb-4">
                  Our Vision
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{vision}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>{visionSupportingText || 'Setting Regional Contracting Benchmarks'}</span>
                <Compass className="w-4 h-4 text-navy-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-500">
              {valuesEyebrow || 'FOUNDATIONAL ETHICS'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight mt-2">
              {valuesHeading || 'Our Guiding Values'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {valuesSubtext || 'The non-negotiable principles that guide our interactions, job-site decisions, and craftsmanship.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueItems.map((val, idx) => {
              const title = typeof val === 'string' ? val : val.title;
              const desc = typeof val === 'string' ? 'Applied rigorously across planning, site operations, and client management.' : val.description || 'Applied rigorously across planning, site operations, and client management.';
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4 hover:border-navy-900/40 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900 leading-snug">{title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {valuesLinkText && (
            <div className="text-center mt-10">
              <a
                href="/why-us"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-navy-900 hover:text-gold-600 transition"
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
