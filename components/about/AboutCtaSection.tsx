import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';

export function AboutCtaSection() {
  return (
    <section className="py-20 bg-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 text-gold-700 text-xs font-bold uppercase tracking-wider mb-4 border border-gold-200">
          <Building2 className="w-3.5 h-3.5 text-gold-600" />
          <span>LET&apos;S COLLABORATE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight leading-tight mb-4">
          Partner with a Proven Leader in Technical Contracting
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
          Whether you require commercial MEP installations, complex facility maintenance, or specialized
          building services, our certified engineering team is ready to assist.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-navy-900 text-white font-bold text-xs rounded-xl hover:bg-navy-800 transition shadow-md group"
          >
            <span>Request a Technical Quote</span>
            <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-300 text-navy-900 font-bold text-xs rounded-xl hover:border-navy-900 hover:bg-slate-50 transition shadow-xs"
          >
            <span>Explore All Services</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
