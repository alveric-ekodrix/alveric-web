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
    <section className="relative bg-navy-950 text-white py-12 sm:py-16 lg:py-20 border-y-2 border-gold-500/30 overflow-hidden shadow-inner">
      {/* Subtle background glow accents */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Eyebrow & Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/35 text-gold-400 text-[11px] sm:text-xs font-extrabold uppercase tracking-widest mb-3 backdrop-blur-sm shadow-sm">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400 shrink-0" />
            <span>Proven Reliability &amp; Accreditation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight px-2">
            Built on Trust, Precision &amp; Industry Standards
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto px-2">
            From specialized MEP installations to large-scale commercial fit-outs, Alveric Technical Contracting operates under rigorous technical compliance and safety benchmarks.
          </p>
        </div>

        {/* 4 Cards Next to Each Other (2x2 on Mobile, 4 in a row on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {trustBadges.slice(0, 4).map((badge, idx) => (
            <TrustCard key={idx} badge={badge} />
          ))}
        </div>

        {/* 5th (Last) Card at the Bottom Centered */}
        <div className="mt-3 sm:mt-4 lg:mt-5 flex justify-center">
          <div className="w-full max-w-[calc(50%-0.375rem)] sm:max-w-xs lg:max-w-sm">
            <TrustCard badge={trustBadges[4]} />
          </div>
        </div>

        {/* Credibility Metric Bar: 2x2 grid on mobile, 4-cols on desktop */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-navy-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 text-center">
          <div className="space-y-1 p-3.5 sm:p-4 rounded-xl bg-navy-900/60 border border-navy-800/80 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-gold-400 tracking-tight">100%</div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Safety &amp; HSE Compliance
            </div>
          </div>
          <div className="space-y-1 p-3.5 sm:p-4 rounded-xl bg-navy-900/60 border border-navy-800/80 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">200+</div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Delivered Projects
            </div>
          </div>
          <div className="space-y-1 p-3.5 sm:p-4 rounded-xl bg-navy-900/60 border border-navy-800/80 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-gold-400 tracking-tight">99%</div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              On-Time Handover
            </div>
          </div>
          <div className="space-y-1 p-3.5 sm:p-4 rounded-xl bg-navy-900/60 border border-navy-800/80 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">10+</div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Years Technical Expertise
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustCard({ badge }: { badge: TrustBadgeItem }) {
  const Icon = badge.icon;
  return (
    <div className="group relative bg-navy-900/90 hover:bg-navy-900 border border-navy-800 hover:border-gold-500/50 rounded-2xl p-3 sm:p-5 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-gold-500/10 flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5 sm:mb-3.5">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all duration-300 shrink-0 shadow-inner">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-navy-800/90 text-gold-300 border border-navy-700/80 whitespace-nowrap shrink-0">
            {badge.badge}
          </span>
        </div>

        <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-gold-300 transition-colors leading-tight sm:leading-snug">
          {badge.title}
        </h3>
        <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-300/80 leading-snug sm:leading-relaxed font-normal">
          {badge.subtitle}
        </p>
      </div>

      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-navy-800 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold text-gold-400">
        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-500 shrink-0" />
        <span>Verified Standard</span>
      </div>
    </div>
  );
}
