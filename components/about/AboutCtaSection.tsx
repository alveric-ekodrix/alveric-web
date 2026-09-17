import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2 } from 'lucide-react';

interface AboutCtaSectionProps {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  primaryButtonText?: string | null;
  secondaryButtonText?: string | null;
  whatsappUrl?: string | null;
  backgroundImageUrl?: string | null;
}

export function AboutCtaSection({
  eyebrow,
  heading,
  description,
  primaryButtonText,
  secondaryButtonText,
  whatsappUrl,
  backgroundImageUrl,
}: AboutCtaSectionProps = {}) {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-navy-950 text-white overflow-hidden shadow-2xl border border-navy-800 py-16 sm:py-24 lg:py-28 px-6 sm:px-12 lg:px-16">
          {/* Background Skyline Silhouette Image - high visibility */}
          {backgroundImageUrl && (
            <div className="absolute inset-0 z-0">
              <Image
                src={backgroundImageUrl}
                alt="Skyline Silhouette"
                fill
                priority
                unoptimized
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center opacity-80 sm:opacity-85 transition-opacity duration-300"
              />
            </div>
          )}

          {/* Balanced cinematic gradient overlay allowing skyline to shine through */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/55 to-navy-950/70 z-0 pointer-events-none" />

          {/* Subtle architectural ambient gold highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/15 via-transparent to-transparent pointer-events-none z-0" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900/80 text-gold-400 text-xs font-bold uppercase tracking-wider mb-6 border border-gold-500/30 backdrop-blur-md shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-gold-400" />
              <span>{eyebrow || "LET'S BUILD TOGETHER"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-5 drop-shadow-md">
              {heading || 'Ready to Bring Your Project to Life?'}
            </h2>

            <p className="text-sm sm:text-base text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
              {description ||
                'Partner with Alveric Technical Contracting and experience reliable, efficient, and high-quality contracting solutions.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gold-500 text-navy-950 font-black text-xs sm:text-sm rounded-xl hover:bg-gold-400 transition-all duration-200 shadow-xl shadow-gold-500/25 hover:shadow-gold-500/40 hover:-translate-y-0.5 group"
              >
                <span>{primaryButtonText || 'Get a Free Quote'}</span>
                <ArrowRight className="w-4 h-4 text-navy-950 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </Link>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-4 bg-navy-900/80 backdrop-blur-md border border-white/25 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-navy-800 hover:border-white/40 transition-all duration-200 shadow-md hover:-translate-y-0.5"
                >
                  <span>{secondaryButtonText || 'Chat on WhatsApp'}</span>
                </a>
              ) : (
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2.5 px-7 py-4 bg-navy-900/80 backdrop-blur-md border border-white/25 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-navy-800 hover:border-white/40 transition-all duration-200 shadow-md hover:-translate-y-0.5"
                >
                  <span>{secondaryButtonText || 'Explore All Services'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


