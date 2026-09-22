import React from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardList, Wrench, ShieldCheck, PackageCheck } from 'lucide-react';

const EXECUTION_STEPS = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Technical Consultation & Survey',
    description:
      'In-depth on-site technical inspection, architectural review, and feasibility analysis to formulate accurate scopes and budgets.',
  },
  {
    step: '02',
    icon: Wrench,
    title: 'Value Engineering & Planning',
    description:
      'Detailed method statements, authority code compliance checks, material approvals, and structured milestone scheduling.',
  },
  {
    step: '03',
    icon: ShieldCheck,
    title: 'Precision Execution & QA/QC',
    description:
      'Dedicated on-site supervision by certified technical specialists, with stage-by-stage quality assurance audits at every milestone.',
  },
  {
    step: '04',
    icon: PackageCheck,
    title: 'Testing, Commissioning & Handover',
    description:
      'Full electrical, HVAC, and mechanical load-testing, as-built documentation delivery, and comprehensive warranty commencement.',
  },
];

export function AboutProcessSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden border-b border-slate-200/80" style={{ background: 'linear-gradient(160deg,#0f172a 0%,#1e293b 100%)' }}>
      {/* Background mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      {/* Gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-gold-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              <span>OUR METHODOLOGY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
              How We Deliver{' '}
              <span className="text-gold-400">Every Project</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed">
              A structured four-phase execution model ensuring absolute technical precision, budget control, and timely milestone delivery.
            </p>
          </div>

          <Link
            href="/quote"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-black transition-all duration-200 shadow-lg shadow-gold-500/25 hover:-translate-y-0.5 self-start md:self-auto group flex-shrink-0"
          >
            <span>Initiate Project Consultation</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-gold-500/0 via-gold-500/40 to-gold-500/0 pointer-events-none z-0" />

          {EXECUTION_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-[1.5rem] overflow-hidden group hover:bg-white/10 hover:border-gold-500/30 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gold-500/10 flex flex-col"
              >
                {/* Corner glow */}
                <div className="absolute -top-8 -right-8 w-20 sm:w-24 h-20 sm:h-24 bg-gold-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

                <div className="relative z-10 p-3.5 sm:p-7 sm:p-8 flex flex-col flex-1">
                  {/* Step number connector dot */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gold-500/15 border border-gold-500/35 flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300 shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 group-hover:text-navy-950 transition-colors duration-300" strokeWidth={1.75} />
                    </div>
                    <span className="text-base sm:text-2xl font-black font-mono text-gold-500/50 group-hover:text-gold-400 transition-colors leading-none">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-base lg:text-lg font-black text-white mb-1.5 sm:mb-3 leading-snug group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-slate-400 leading-snug sm:leading-relaxed group-hover:text-slate-300 transition-colors flex-1">
                    {item.description}
                  </p>

                  {/* Animated bottom bar */}
                  <div className="mt-3 sm:mt-6 h-0.5 w-6 sm:w-8 rounded-full bg-gold-500/40 group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

