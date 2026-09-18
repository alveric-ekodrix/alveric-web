import React from 'react';
import { HardHat, Award, Clock, Layers } from 'lucide-react';

const CORE_PILLARS = [
  {
    icon: HardHat,
    title: 'Uncompromising Safety',
    description:
      'Zero-harm philosophy enforced across every job site with strict adherence to regional environmental and occupational safety protocols.',
    color: 'text-gold-500 bg-gold-50 border-gold-200',
  },
  {
    icon: Award,
    title: 'Certified Engineering Quality',
    description:
      'ISO-aligned methodologies, high-grade certified materials, and meticulous workmanship verified through structured QA checklists.',
    color: 'text-navy-900 bg-navy-50 border-navy-200',
  },
  {
    icon: Clock,
    title: 'Milestone-Driven Delivery',
    description:
      'Disciplined critical-path scheduling, rapid mobilization of technical teams, and on-time completion with transparent status reporting.',
    color: 'text-gold-500 bg-gold-50 border-gold-200',
  },
  {
    icon: Layers,
    title: 'Turnkey Multi-Disciplinary Scope',
    description:
      'Comprehensive capabilities spanning electrical systems, HVAC ventilation, plumbing, fit-out, and preventative facility maintenance.',
    color: 'text-navy-900 bg-navy-50 border-navy-200',
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
    <section className="py-20 lg:py-24 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-600 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
            <span>{eyebrow || 'STANDARDS & DISCIPLINE'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight">
            {heading || 'The Four Pillars Behind Every Project We Deliver'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed">
            {description || 'Our systematic approach ensures that every contract is executed safely, reliably, and on schedule.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 hover:bg-white p-7 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border shadow-xs group-hover:scale-110 transition-transform ${pillar.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
