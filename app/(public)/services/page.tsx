import React from 'react';
import Link from 'next/link';
import { getPublishedServices } from '@/lib/data/public';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { ArrowRight, Layers } from 'lucide-react';

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-400">
              OUR EXPERTISE
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Engineering & Contracting Services
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Comprehensive MEP, structural, finishing, and facility maintenance services delivered to regional regulatory and international quality standards.
            </p>
          </div>
        </div>
      </section>

      {/* Services Listing */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                    <CldImageWrapper
                      src={service.featured_image?.secure_url}
                      alt={service.name}
                      fill
                      fallbackText="Service image pending upload"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 z-10 w-12 h-12 rounded-xl bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center p-2.5">
                      <ServiceIcon
                        iconUrl={service.icon_media?.secure_url}
                        slug={service.slug}
                        name={service.name}
                        className="w-7 h-7"
                      />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-lg font-black text-navy-900 group-hover:text-gold-600 transition-colors leading-snug mb-3">
                      {service.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6 flex-1">
                      {service.short_description ||
                        'Professional technical contracting executed by experienced engineers and certified technicians.'}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 text-navy-900 text-xs font-bold border border-slate-200 group-hover:bg-navy-900 group-hover:text-white group-hover:border-navy-900 transition"
                    >
                      <span>View Service Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
