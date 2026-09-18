import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const EXECUTION_STEPS = [
  {
    step: '01',
    title: 'Technical Consultation & Survey',
    description:
      'In-depth on-site technical inspection, architectural review, and feasibility analysis to formulate accurate scopes and budgets.',
  },
  {
    step: '02',
    title: 'Value Engineering & Planning',
    description:
      'Detailed method statements, authority code compliance checks, material approvals, and structured milestone scheduling.',
  },
  {
    step: '03',
    title: 'Precision Execution & QA/QC',
    description:
      'Dedicated on-site supervision by certified technical specialists, with stage-by-stage quality assurance audits at every milestone.',
  },
  {
    step: '04',
    title: 'Testing, Commissioning & Handover',
    description:
      'Full electrical, HVAC, and mechanical load-testing, as-built documentation delivery, and comprehensive warranty commencement.',
  },
];

export function AboutProcessSection() {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-600 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              <span>OUR METHODOLOGY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight">
              How We Deliver Every Project
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-lg leading-relaxed">
              A structured four-phase execution model ensuring absolute technical precision, budget control, and timely milestone delivery.
            </p>
          </div>

          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-navy-900 bg-navy-900 text-white text-xs sm:text-sm font-bold hover:bg-navy-800 transition-all duration-200 shadow-md self-start md:self-auto group"
          >
            <span>Initiate Project Consultation</span>
            <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {EXECUTION_STEPS.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white p-7 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 hover:border-gold-500/40 flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl sm:text-3xl font-black text-gold-500 font-mono tracking-wider">
                    {item.step}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-gold-400 group-hover:scale-150 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-navy-900 mb-2 leading-snug group-hover:text-gold-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
