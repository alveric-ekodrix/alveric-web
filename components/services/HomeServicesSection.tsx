'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Service } from '@/types/database';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { ArrowRight, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface HomeServicesSectionProps {
  services: Service[];
}

const CARD_WIDTH = 240; // px
const GAP = 16;         // px — gap-4
const AUTO_SLIDE_MS = 3000;

export function HomeServicesSection({ services }: HomeServicesSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = CARD_WIDTH + GAP;

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setActiveDot(0);
    } else {
      const progress = el.scrollLeft / maxScroll;
      if (progress < 0.33) {
        setActiveDot(0);
      } else if (progress > 0.67) {
        setActiveDot(2);
      } else {
        setActiveDot(1);
      }
    }
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState, services]);

  // Auto-slide
  useEffect(() => {
    if (isPaused || services.length <= 1) return;
    autoTimerRef.current = setTimeout(() => {
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, AUTO_SLIDE_MS);
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [isPaused, services.length, step]);

  const scrollBy = (dir: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    setIsPaused(true);
    el.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' });
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    setTimeout(() => setIsPaused(false), 6000);
  };

  const scrollToDot = (dotIndex: number) => {
    const el = trackRef.current;
    if (!el) return;
    setIsPaused(true);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const targetLeft = dotIndex === 0 ? 0 : dotIndex === 1 ? maxScroll * 0.5 : maxScroll;
    el.scrollTo({ left: targetLeft, behavior: 'smooth' });
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    setTimeout(() => setIsPaused(false), 6000);
  };

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500">
              OUR SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight mt-2">
              Comprehensive Solutions<br className="hidden sm:inline" /> Tailored to Your Needs.
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {services.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollBy('prev')}
                  disabled={!canScrollLeft}
                  aria-label="Previous services"
                  className="w-9 h-9 rounded-full border border-slate-300 bg-white shadow-sm flex items-center justify-center text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollBy('next')}
                  disabled={!canScrollRight}
                  aria-label="Next services"
                  className="w-9 h-9 rounded-full border border-slate-300 bg-white shadow-sm flex items-center justify-center text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-navy-900 text-xs font-bold shadow-sm hover:border-navy-900 hover:text-navy-900 transition group"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Slider or Empty State */}
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-1">
              No services available at the moment.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Our engineering catalogue is being configured in the admin dashboard.
            </p>
          </div>
        ) : (
          <>
            {/* Slider wrapper */}
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Left edge fade */}
              <div
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-14 z-10 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to right, rgb(248 250 252), transparent)',
                  opacity: canScrollLeft ? 1 : 0,
                }}
              />
              {/* Right edge fade */}
              <div
                className="pointer-events-none absolute right-0 top-0 bottom-0 w-14 z-10 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to left, rgb(248 250 252), transparent)',
                  opacity: canScrollRight ? 1 : 0,
                }}
              />

              {/* Scrollable track */}
              <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto pb-3"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    style={{ minWidth: `${CARD_WIDTH}px`, width: `${CARD_WIDTH}px`, scrollSnapAlign: 'start' }}
                    className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 w-full bg-slate-100">
                      <div className="relative w-full h-full overflow-hidden">
                        <CldImageWrapper
                          src={service.featured_image?.secure_url}
                          alt={service.name}
                          fill
                          fallbackText="Image pending upload"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      {/* Floating icon badge - icon circle only, bigger, no separate background */}
                      <div
                        className={`absolute -bottom-8 left-4 z-20 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
                          service.icon_media?.secure_url
                            ? 'drop-shadow-md'
                            : 'bg-white shadow-md border border-slate-200 p-3'
                        }`}
                      >
                        <ServiceIcon
                          iconUrl={service.icon_media?.secure_url}
                          slug={service.slug}
                          name={service.name}
                          className={
                            service.icon_media?.secure_url
                              ? 'w-full h-full rounded-full'
                              : 'w-8 h-8'
                          }
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-4 pt-10 flex flex-col flex-1">
                      <h3 className="text-xs font-black text-navy-900 group-hover:text-gold-600 transition-colors leading-snug mb-1.5 line-clamp-2">
                        {service.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed flex-1">
                        {service.short_description || 'Professional technical contracting and maintenance services.'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Exactly 3 Dot indicators */}
            {services.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-5">
                {[0, 1, 2].map((dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => scrollToDot(dotIdx)}
                    aria-label={`Go to section ${dotIdx + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      dotIdx === activeDot
                        ? 'w-6 h-2 bg-navy-900'
                        : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Hide webkit scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

