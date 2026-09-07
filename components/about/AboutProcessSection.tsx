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
    <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-500">
              OUR METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight mt-2">
              How We Deliver Every Project
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg">
              A structured four-phase execution model ensuring absolute technical precision, budget control, and timely milestone delivery.
            </p>
          </div>

          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-navy-900 text-xs font-bold hover:border-navy-900 transition shadow-xs self-start md:self-auto"
          >
            <span>Initiate Project Consultation</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {EXECUTION_STEPS.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-slate-50/70 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between group hover:bg-white hover:shadow-md hover:border-navy-900/30 transition-all duration-300"
            >
              <div>
                <span className="text-3xl font-black text-gold-500/80 block mb-4 font-mono">
                  {item.step}
                </span>
                <h3 className="text-sm font-bold text-navy-900 mb-2 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
