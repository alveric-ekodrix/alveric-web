import React from 'react';
import { SiteStatistic } from '@/types/database';

interface AboutStatsStripProps {
  statistics: SiteStatistic[];
  calculatedYears: number;
}

export function AboutStatsStrip({ statistics, calculatedYears }: AboutStatsStripProps) {
  return (
    <section className="py-14 bg-navy-950 text-white border-b border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-navy-800">
          {statistics && statistics.length > 0 ? (
            statistics.map((stat) => (
              <div key={stat.id} className="pt-4 md:pt-0 space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-gold-400">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {stat.label}
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-gold-400">{calculatedYears}+</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Years of Engineering Excellence
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-gold-400">100+</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Commercial &amp; Civil Projects
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-gold-400">100%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Safety &amp; Compliance Record
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-gold-400">24/7</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Engineering Support &amp; Dispatch
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
