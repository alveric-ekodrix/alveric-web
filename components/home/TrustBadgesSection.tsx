import React from 'react';
import {
  ShieldCheck,
  Award,
  HardHat,
  Clock,
  CheckCircle2,
  Building2,
  FileCheck,
  Star,
} from 'lucide-react';

interface TrustBadgeItem {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge: string;
}

const trustBadges: TrustBadgeItem[] = [
  {
    icon: ShieldCheck,
    title: 'Licensed & Registered',
    subtitle: 'Compliant with UAE Municipality & Civil Defense technical standards',
    badge: 'Official Approval',
  },
  {
    icon: Award,
    title: 'ISO Quality Standards',
    subtitle: 'ISO 9001 certified execution, premium grade materials & inspection',
    badge: 'ISO Certified',
  },
  {
    icon: HardHat,
    title: 'HSE & Safety First',
    subtitle: 'Zero-harm incident policy with certified site supervisors & engineers',
    badge: '100% HSE Compliant',
  },
  {
    icon: Clock,
    title: 'On-Time Project Delivery',
    subtitle: 'Strict milestone tracking and prompt handover on every commercial scope',
    badge: 'Milestone Guaranteed',
  },
  {
    icon: CheckCircle2,
    title: 'Turnkey MEP & Contracting',
    subtitle: 'End-to-end electrical, mechanical, civil, and specialized fit-out',
    badge: 'Full-Scope',
  },
];

export function TrustBadgesSection() {
  return (
    <section className="relative bg-navy-950 text-white py-14 sm:py-16 border-y-2 border-gold-500/30 overflow-hidden shadow-inner">
      {/* Subtle background glow accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Eyebrow & Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] font-extrabold uppercase tracking-widest mb-3">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span>Proven Reliability & Accreditation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Built on Trust, Precision & Industry Standards
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            From specialized MEP installations to large-scale commercial fit-outs, Alveric Technical Contracting operates under rigorous technical compliance and safety benchmarks.
          </p>
        </div>

        {/* 5-Column Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="group relative bg-navy-900/90 hover:bg-navy-900 border border-navy-800 hover:border-gold-500/50 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-gold-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all duration-300">
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-800 text-gold-300/90 border border-navy-700 whitespace-nowrap">
                      {badge.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-gold-300 transition-colors">
                    {badge.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {badge.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-gold-400/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credibility Metric Bar */}
        <div className="mt-10 sm:mt-12 pt-8 border-t border-navy-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-gold-400 tracking-tight">100%</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Safety & HSE Compliance
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">200+</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Delivered Projects
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-gold-400 tracking-tight">99%</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              On-Time Handover
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">10+</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Years Technical Expertise
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
