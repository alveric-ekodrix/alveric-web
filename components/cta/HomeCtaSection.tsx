import React from 'react';
import Link from 'next/link';
import { HomepageSettings } from '@/types/database';
import { ArrowRight } from 'lucide-react';

interface HomeCtaSectionProps {
  settings?: HomepageSettings | null;
}

export function HomeCtaSection({ settings }: HomeCtaSectionProps) {
  const heading = settings?.cta_heading || "Let's Build Your Next Project Together";
  const description =
    settings?.cta_description ||
    'Talk to our experts today and get an engineered solution tailored to your specific commercial or residential needs.';
  const buttonText = settings?.cta_button_text || 'Get a Free Quote';
  const buttonUrl = settings?.cta_button_url || '/quote';

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-navy-950 overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-14 border border-navy-800">
          {/* Subtle industrial background pattern / gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/95 to-navy-950/80 z-0" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-2 sm:space-y-3">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                {heading}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>

            <Link
              href={buttonUrl}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gold-500 text-navy-950 font-black text-sm tracking-wide shadow-lg hover:bg-gold-400 transition-all duration-200 shrink-0 group"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 text-navy-950 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
