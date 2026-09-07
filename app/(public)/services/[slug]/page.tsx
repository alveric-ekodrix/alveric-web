import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedServiceBySlug, getCompanySettings } from '@/lib/data/public';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { CheckCircle2, ArrowRight, Phone, MessageSquare } from 'lucide-react';

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  if (!service) {
    return { title: 'Service Not Found | Alveric Technical Contracting LLC' };
  }

  return {
    title: `${service.seo_title || service.name} | Alveric Technical Contracting LLC`,
    description: service.seo_description || service.short_description || undefined,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const [service, companySettings] = await Promise.all([
    getPublishedServiceBySlug(slug),
    getCompanySettings(),
  ]);

  if (!service) {
    notFound();
  }

  const benefits: string[] = Array.isArray(service.benefits) ? (service.benefits as string[]) : [];
  const processSteps: { title: string; description: string }[] = Array.isArray(service.process_steps)
    ? (service.process_steps as { title: string; description: string }[])
    : [];

  const whatsapp = companySettings?.whatsapp_number || companySettings?.phone_primary;
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hello Alveric Team, I would like to inquire about your ${service.name} service.`
      )}`
    : null;

  return (
    <div className="w-full">
      {/* Service Hero Header */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center p-2.5 backdrop-blur-sm border border-white/20">
                <ServiceIcon
                  iconUrl={service.icon_media?.secure_url}
                  slug={service.slug}
                  name={service.name}
                  className="w-7 h-7"
                />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-400">
                OFFICIAL SERVICE
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {service.name}
            </h1>

            {service.short_description && (
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {service.short_description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Service Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content Area */}
            <div className="lg:col-span-8 space-y-12">
              {/* Featured Image */}
              <div className="relative h-[340px] sm:h-[440px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
                <CldImageWrapper
                  src={service.featured_image?.secure_url}
                  alt={service.name}
                  fill
                  fallbackText="Showcase image pending upload"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Full Description */}
              {service.description && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-navy-900">Service Overview</h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {service.description}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-navy-900">Key Advantages & Benefits</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
                      >
                        <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Steps */}
              {processSteps.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-navy-900">Our Execution Process</h2>
                  <div className="space-y-4">
                    {processSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200"
                      >
                        <div className="w-9 h-9 rounded-xl bg-navy-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-navy-900 text-sm mb-1">{step.title}</h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar CTA & Contact */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quote Request Card */}
              <div className="p-6 rounded-2xl bg-navy-950 text-white border border-navy-800 shadow-xl space-y-4 sticky top-24">
                <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
                  READY TO START?
                </span>
                <h3 className="text-xl font-black leading-snug">
                  Get a Free Engineering Consultation
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect with our certified technical engineers for a customized assessment and itemized proposal.
                </p>

                <div className="space-y-3 pt-2">
                  <Link
                    href={`/quote?service=${service.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-wider hover:bg-gold-400 transition shadow"
                  >
                    <span>Request a Detailed Quote</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Discuss on WhatsApp</span>
                    </a>
                  )}

                  {companySettings?.phone_primary && (
                    <a
                      href={`tel:${companySettings.phone_primary.replace(/\s+/g, '')}`}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20"
                    >
                      <Phone className="w-4 h-4 text-gold-400" />
                      <span>Call {companySettings.phone_primary}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
