import React from 'react';
import { SiteStatistic } from '@/types/database';

interface AboutStatsStripProps {
  statistics: SiteStatistic[];
  calculatedYears: number;
}

export function AboutStatsStrip({ statistics, calculatedYears }: AboutStatsStripProps) {
  return (
    <section className="py-6 sm:py-8 bg-navy-950 text-white border-b border-navy-800/80 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,160,23,0.06),transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
          {statistics && statistics.length > 0 ? (
            statistics.map((stat) => (
              <div
                key={stat.id}
                className="py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold-500/40 hover:bg-white/[0.06] transition-all duration-300 space-y-0.5 group"
              >
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-gold-400 tracking-tight font-mono group-hover:scale-105 transition-transform">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  {stat.label}
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold-500/40 hover:bg-white/[0.06] transition-all duration-300 space-y-0.5 group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-gold-400 tracking-tight font-mono group-hover:scale-105 transition-transform">
                  {calculatedYears}+
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Years of Excellence
                </div>
              </div>
              <div className="py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold-500/40 hover:bg-white/[0.06] transition-all duration-300 space-y-0.5 group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-gold-400 tracking-tight font-mono group-hover:scale-105 transition-transform">
                  100+
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Completed Projects
                </div>
              </div>
              <div className="py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold-500/40 hover:bg-white/[0.06] transition-all duration-300 space-y-0.5 group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-gold-400 tracking-tight font-mono group-hover:scale-105 transition-transform">
                  100%
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Safety &amp; Compliance
                </div>
              </div>
              <div className="py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold-500/40 hover:bg-white/[0.06] transition-all duration-300 space-y-0.5 group">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-gold-400 tracking-tight font-mono group-hover:scale-105 transition-transform">
                  24/7
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Technical Support
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
