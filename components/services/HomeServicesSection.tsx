import React from 'react';
import Link from 'next/link';
import { Service } from '@/types/database';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { ArrowRight, Layers } from 'lucide-react';

interface HomeServicesSectionProps {
  services: Service[];
}

export function HomeServicesSection({ services }: HomeServicesSectionProps) {
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

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-navy-900 text-xs font-bold shadow-sm hover:border-navy-900 hover:text-navy-900 transition self-start md:self-auto group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Services Grid or Professional Empty State */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Container with Floating Icon Badge */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <CldImageWrapper
                    src={service.featured_image?.secure_url}
                    alt={service.name}
                    fill
                    fallbackText="Image pending upload"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {/* Floating Circular Icon Badge */}
                  <div className="absolute -bottom-4 left-4 z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                    <ServiceIcon
                      iconUrl={service.icon_media?.secure_url}
                      slug={service.slug}
                      name={service.name}
                      className="w-6 h-6"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-7 flex flex-col flex-1">
                  <h3 className="text-sm font-black text-navy-900 group-hover:text-gold-600 transition-colors leading-snug mb-2 line-clamp-2">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4 flex-1">
                    {service.short_description || 'Professional technical contracting and maintenance services engineered for optimal performance.'}
                  </p>
                  <div className="flex items-center text-xs font-bold text-navy-900 group-hover:text-gold-600 transition gap-1 pt-2 border-t border-slate-100">
                    <span>Explore Service</span>
                    <ArrowRight className="w-3 h-3 text-gold-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
