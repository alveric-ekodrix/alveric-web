import React from 'react';
import { HardHat, Award, Clock, Layers } from 'lucide-react';

const CORE_PILLARS = [
  {
    icon: HardHat,
    number: '01',
    title: 'Uncompromising Safety',
    description:
      'Zero-harm philosophy enforced across every job site with strict adherence to regional environmental and occupational safety protocols.',
  },
  {
    icon: Award,
    number: '02',
    title: 'Certified Engineering Quality',
    description:
      'ISO-aligned methodologies, high-grade certified materials, and meticulous workmanship verified through structured QA checklists.',
  },
  {
    icon: Clock,
    number: '03',
    title: 'Milestone-Driven Delivery',
    description:
      'Disciplined critical-path scheduling, rapid mobilisation of technical teams, and on-time completion with transparent status reporting.',
  },
  {
    icon: Layers,
    number: '04',
    title: 'Turnkey Multi-Disciplinary Scope',
    description:
      'Comprehensive capabilities spanning electrical systems, HVAC ventilation, plumbing, fit-out, and preventative facility maintenance.',
  },
];

interface AboutPillarsSectionProps {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
}

export function AboutPillarsSection({
  eyebrow,
  heading,
  description,
}: AboutPillarsSectionProps = {}) {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-200/80 relative overflow-hidden">
      {/* Subtle top-right accent */}
      <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-gold-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-600 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
            <span className="w-2 h-2 rounded-full bg-gold-500" />
            <span>{eyebrow || 'STANDARDS & DISCIPLINE'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 tracking-tight leading-tight mb-4">
            {heading || 'The Four Pillars Behind Every Project We Deliver'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            {description || 'Our systematic approach ensures that every contract is executed safely, reliably, and on schedule.'}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {CORE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl sm:rounded-[1.5rem] bg-white text-navy-950 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-gold-500/40 overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* Decorative corner glow */}
                <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-2xl pointer-events-none bg-gold-500/8 transition-transform duration-700 group-hover:scale-125" />

                {/* Number badge */}
                <div className="absolute top-3 sm:top-5 right-3 sm:right-5 text-lg sm:text-3xl font-black font-mono leading-none text-slate-200 group-hover:text-gold-500/30 transition-colors">
                  {pillar.number}
                </div>

                <div className="relative z-10 p-3.5 sm:p-7 lg:p-8 flex flex-col flex-1">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-navy-950 flex items-center justify-center mb-3 sm:mb-6 transition-all duration-300 group-hover:scale-105 shadow-md">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" strokeWidth={1.75} />
                  </div>

                  <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-slate-400 mb-1 sm:mb-2">
                    PILLAR {pillar.number}
                  </div>
                  <h3 className="text-xs sm:text-lg font-black mb-1.5 sm:mb-3 leading-snug text-navy-900 group-hover:text-gold-600 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm leading-snug sm:leading-relaxed text-slate-500 flex-1">
                    {pillar.description}
                  </p>

                  {/* Bottom rule */}
                  <div className="mt-3 sm:mt-6 h-0.5 w-6 sm:w-8 rounded-full bg-gold-400 transition-all duration-300 group-hover:w-12 sm:group-hover:w-16" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

