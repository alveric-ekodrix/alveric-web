import React from 'react';
import Link from 'next/link';
import { getPublishedServices } from '@/lib/data/public';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { ArrowRight, Layers, Wrench } from 'lucide-react';

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="w-full">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-navy-950 text-white py-20 lg:py-28">
        {/* Geometric accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-white/5" />
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-white/5" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
            }}
          />
        </div>
        {/* Gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                Our Expertise
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Engineering &amp; Contracting{' '}
              <span className="text-gold-400">Services</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Comprehensive MEP, structural, finishing, and facility maintenance services
              delivered to regional regulatory and international quality standards.
            </p>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-16 bg-slate-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-1">
                No services available at the moment.
              </h3>
              <p className="text-xs text-slate-500">
                Services can be added and published through the administrator panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-36 sm:h-48 md:h-56 w-full bg-slate-100 overflow-hidden">
                    <CldImageWrapper
                      src={service.featured_image?.secure_url}
                      alt={service.name}
                      fill
                      fallbackText="Service image pending upload"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Icon badge */}
                    <div
                      className={`absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
                        service.icon_media?.secure_url
                          ? 'drop-shadow-md'
                          : 'bg-white shadow-md border border-slate-200 p-1.5 sm:p-2.5'
                      }`}
                    >
                      <ServiceIcon
                        iconUrl={service.icon_media?.secure_url}
                        slug={service.slug}
                        name={service.name}
                        className={
                          service.icon_media?.secure_url
                            ? 'w-full h-full rounded-full'
                            : 'w-5 h-5 sm:w-7 sm:h-7'
                        }
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-5 md:p-6 flex flex-col flex-1">
                    <h2 className="text-sm sm:text-base md:text-lg font-black text-navy-900 group-hover:text-gold-600 transition-colors leading-snug mb-2 sm:mb-3">
                      {service.name}
                    </h2>
                    <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-5 md:mb-6 flex-1">
                      {service.short_description ||
                        'Professional technical contracting executed by experienced engineers and certified technicians.'}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-slate-50 text-navy-900 text-[11px] sm:text-xs font-bold border border-slate-200 group-hover:bg-navy-900 group-hover:text-white group-hover:border-navy-900 transition"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-500 group-hover:text-gold-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                <Wrench className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Need a custom scope of work?
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Talk to our engineering team for tailored contracting solutions.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-navy-950 font-black text-sm rounded-xl hover:bg-gold-400 transition shadow-lg"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition border border-white/20"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
