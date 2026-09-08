import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getPublishedServiceBySlug,
  getCompanySettings,
  getPublishedServices,
} from '@/lib/data/public';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import {
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
  Award,
  FileCheck,
  Check,
  Wrench,
  Building,
} from 'lucide-react';

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
  const [service, companySettings, allServices] = await Promise.all([
    getPublishedServiceBySlug(slug),
    getCompanySettings(),
    getPublishedServices(),
  ]);

  if (!service) {
    notFound();
  }

  const benefits: string[] = Array.isArray(service.benefits) ? (service.benefits as string[]) : [];
  const processSteps: { title: string; description: string }[] = Array.isArray(service.process_steps)
    ? (service.process_steps as { title: string; description: string }[])
    : [];

  const otherServices = allServices
    .filter((s) => s.id !== service.id)
    .slice(0, 6);

  const whatsapp = companySettings?.whatsapp_number || companySettings?.phone_primary;
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hello Alveric Team, I would like to inquire about your ${service.name} service.`
      )}`
    : null;

  return (
    <div className="w-full bg-white">
      {/* 1. Integrated Split Hero Section */}
      <section className="relative bg-navy-950 text-white pt-10 pb-14 sm:pt-14 sm:pb-20 border-b border-navy-800 overflow-hidden">
        {/* Subtle decorative background lighting */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-navy-700/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
            <ol className="flex items-center space-x-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-gold-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </li>
              <li>
                <Link href="/services" className="hover:text-gold-400 transition">
                  Services
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </li>
              <li className="text-gold-400 font-semibold truncate max-w-[200px] sm:max-w-none">
                {service.name}
              </li>
            </ol>
          </nav>

          {/* Hero Content Grid (Text on Left, Balanced Image on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold tracking-wider uppercase">
                <ServiceIcon
                  iconUrl={service.icon_media?.secure_url}
                  slug={service.slug}
                  name={service.name}
                  className="w-4 h-4 text-gold-400"
                />
                <span>Specialized Contracting Scope</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {service.name}
              </h1>

              {service.short_description && (
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {service.short_description}
                </p>
              )}

              {/* Quick Credibility Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-navy-900 border border-navy-700 text-xs font-medium text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  UAE Municipality Compliant
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-navy-900 border border-navy-700 text-xs font-medium text-slate-200">
                  <Wrench className="w-3.5 h-3.5 text-gold-400" />
                  Certified Engineers
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-navy-900 border border-navy-700 text-xs font-medium text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  On-Time Handover
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href={`/quote?service=${service.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-navy-950 font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-gold-400 transition shadow-lg hover:shadow-gold-500/10"
                >
                  <span>Request a Free Quote</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm border border-navy-700 hover:border-gold-500/50 transition"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Showcase Card (Balanced, not taking half the page) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-navy-800/90 bg-navy-900 group">
                  {service.featured_image?.secure_url ? (
                    <CldImageWrapper
                      src={service.featured_image.secure_url}
                      alt={service.name}
                      fill
                      fallbackText={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-3 shadow-inner">
                        <ServiceIcon
                          iconUrl={service.icon_media?.secure_url}
                          slug={service.slug}
                          name={service.name}
                          className="w-8 h-8"
                        />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">
                        {service.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 max-w-xs">
                        ALVERIC Technical Contracting LLC
                      </p>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Trust Badge */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-navy-950/85 backdrop-blur-md border border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-gold-400 font-bold">
                      <Award className="w-4 h-4 text-gold-400" />
                      <span>Alveric Technical Standards</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-300">
                      ISO 9001 Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content & Details Section */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Content Area (8 Cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Service Detailed Overview */}
              {service.description && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-6 rounded-full bg-gold-500" />
                    <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                      Service Overview &amp; Scope
                    </h2>
                  </div>

                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line pt-1">
                    {service.description}
                  </div>
                </div>
              )}

              {/* Key Advantages & Benefits Grid */}
              {benefits.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-6 rounded-full bg-gold-500" />
                    <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                      Key Advantages &amp; What Sets Us Apart
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Clients choose Alveric for reliability, engineered precision, and end-to-end accountability.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 hover:border-gold-500/50 transition-all duration-200 group shadow-xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-gold-500/15 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-gold-500 transition-colors">
                          <Check className="w-3.5 h-3.5 text-gold-600 group-hover:text-navy-950 transition-colors" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Steps (Timeline Stepper) */}
              {processSteps.length > 0 && (
                <div className="space-y-5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-6 rounded-full bg-gold-500" />
                    <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                      Our Engineered Execution Process
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Every project follows a proven, milestone-driven technical workflow to guarantee flawless results.
                  </p>

                  <div className="space-y-4 pt-2">
                    {processSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition duration-200 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-navy-950 text-gold-400 font-black text-sm flex items-center justify-center shrink-0 border border-navy-800 group-hover:bg-navy-900 transition">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-navy-900 text-sm sm:text-base group-hover:text-navy-950">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality & Safety Commitment Strip */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-navy-900 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-gold-500" />
                    <span>HSE &amp; Municipal Compliance Guarantee</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    All contracting works are backed by comprehensive public liability insurance, certified HSE compliance, and dedicated post-completion warranty.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 hover:text-gold-600 transition whitespace-nowrap"
                >
                  <span>Speak With a Specialist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Sidebar Area (4 Cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Quote & Consultation Action Card */}
              <div className="p-6 rounded-2xl bg-navy-950 text-white border border-navy-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gold-400">
                    GET A QUOTE
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 text-slate-300 border border-navy-700">
                    Fast Response
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black leading-snug">
                  Request an Itemized Proposal
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Provide your project dimensions and specifications. Our senior estimation team will prepare a competitive, transparent quote.
                </p>

                <div className="space-y-2.5 pt-2">
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
                      <span>Instant WhatsApp Chat</span>
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

              {/* Service Guarantees Widget */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <h4 className="text-xs font-black text-navy-900 uppercase tracking-wider">
                  The Alveric Standard
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>Free preliminary engineering survey</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>Dedicated bilingual project manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>100% genuine &amp; certified materials</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>Formal handover and warranty documentation</span>
                  </li>
                </ul>
              </div>

              {/* Explore Other Services Widget */}
              {otherServices.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-navy-900 uppercase tracking-wider">
                      Explore Other Services
                    </h4>
                    <Link
                      href="/services"
                      className="text-[11px] text-gold-600 hover:text-gold-700 font-bold transition"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {otherServices.map((other) => (
                      <Link
                        key={other.id}
                        href={`/services/${other.slug}`}
                        className="py-2.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:text-navy-900 hover:font-bold transition group"
                      >
                        <span className="truncate pr-2">{other.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-transform shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
