'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Service } from '@/types/database';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ServicesQuickNavProps {
  services: Service[];
}

export function ServicesQuickNav({ services }: ServicesQuickNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!services || services.length === 0) {
    return null;
  }

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [services]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Quick Services Navigation"
      className="w-full bg-white border-y border-slate-200 py-4 sm:py-5 relative shadow-sm"
    >
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 relative">
        {/* Left Scroll Button (visible on touch/overflow) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll services left"
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-navy-900 hover:bg-slate-50 transition active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Scroll Button (visible on touch/overflow) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll services right"
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-navy-900 hover:bg-slate-50 transition active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Subtle Edge Fade Gradients for visual scroll cue on mobile */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />
        )}

        {/* Scrollable Container with Momentum Touch and Snap Points */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-stretch overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory divide-x divide-slate-200 py-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="snap-start shrink-0 flex flex-col items-center justify-start text-center px-3 sm:px-4 py-2 w-[125px] sm:w-[135px] lg:flex-1 lg:min-w-0 hover:bg-slate-50/80 transition-colors group"
            >
              {/* Icon Container - no background, balanced icon size */}
              <div className="mb-2 shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <ServiceIcon
                  iconUrl={service.icon_media?.secure_url}
                  slug={service.slug}
                  name={service.name}
                  className="w-12 h-12 sm:w-13 sm:h-13 drop-shadow-sm"
                />
              </div>

              {/* Service Title */}
              <span className="text-[11px] sm:text-xs font-semibold sm:font-bold text-navy-900 leading-tight line-clamp-2 group-hover:text-gold-600 transition-colors">
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
