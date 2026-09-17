import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  getPublishedServiceBySlug,
  getCompanySettings,
  getPublishedServices,
} from '@/lib/data/public';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { ServiceDetailQuoteCard } from '@/components/services/ServiceDetailQuoteCard';
import {
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  MessageSquare,
  Zap,
  CheckCircle2,
  Users,
  Settings,
  FileText,
  Wrench,
  Check,
  CheckCircle,
  Lightbulb,
  Cpu,
  Shield,
  Award,
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

  const cleanWhatsapp = (companySettings?.whatsapp_number || companySettings?.phone_primary)?.replace(/\D/g, '');
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello Alveric Team, I would like to inquire about your ${service.name} service.`
      )}`
    : null;

  // Other services for related section (up to 5 items)
  const relatedServices = allServices
    .filter((s) => s.id !== service.id)
    .slice(0, 5);

  // Dynamic capabilities/scopes ribbon icons
  const sName = service.name.toLowerCase();
  const isElectrical = sName.includes('electr');
  const isAc = sName.includes('air') || sName.includes('condition') || sName.includes('hvac');
  const isPlumbing = sName.includes('plumb') || sName.includes('sanitar');
  const isPainting = sName.includes('paint');

  const capabilities = isElectrical
    ? [
        { label: 'Electrical Installation', icon: Zap },
        { label: 'Lighting Solutions', icon: Lightbulb },
        { label: 'Panel & Distribution', icon: Cpu },
        { label: 'Electrical Maintenance', icon: Wrench },
        { label: 'Testing & Commissioning', icon: FileText },
      ]
    : isAc
    ? [
        { label: 'AC Installation', icon: Zap },
        { label: 'Duct Fabrication', icon: Building2 },
        { label: 'Chiller Servicing', icon: Cpu },
        { label: 'Preventive Maintenance', icon: Wrench },
        { label: 'Air Balancing & Testing', icon: FileText },
      ]
    : isPlumbing
    ? [
        { label: 'Pipe Fitting & Routing', icon: Zap },
        { label: 'Sanitary Fixtures', icon: Building2 },
        { label: 'Drainage Networks', icon: Cpu },
        { label: 'Leak & Pressure Testing', icon: FileText },
        { label: 'System Maintenance', icon: Wrench },
      ]
    : isPainting
    ? [
        { label: 'Surface Preparation', icon: Zap },
        { label: 'Interior Wall Painting', icon: Building2 },
        { label: 'Exterior Coatings', icon: Cpu },
        { label: 'Protective Sealants', icon: ShieldCheck },
        { label: 'Final Quality Inspection', icon: FileText },
      ]
    : [
        { label: 'Site Survey & Audit', icon: FileText },
        { label: 'Engineering Layout', icon: Cpu },
        { label: 'Quality Installation', icon: Zap },
        { label: 'Safety Compliance', icon: ShieldCheck },
        { label: 'Testing & Handover', icon: Award },
      ];

  // Process steps (use database if populated, otherwise use standard 4-step workflow)
  const rawProcess = Array.isArray(service.process_steps) ? (service.process_steps as any[]) : [];
  const processSteps = rawProcess.length > 0
    ? rawProcess.map((step, idx) => ({
        stepNumber: String(idx + 1).padStart(2, '0'),
        title: step.title,
        description: step.description,
        icon: idx === 0 ? FileText : idx === 1 ? Settings : idx === 2 ? Wrench : CheckCircle2,
      }))
    : [
        {
          stepNumber: '01',
          title: 'Site Survey',
          description: 'We assess your requirements and analyze the site conditions.',
          icon: FileText,
        },
        {
          stepNumber: '02',
          title: 'Planning & Design',
          description: 'Our engineers design the optimal layout and calculate load requirements.',
          icon: Settings,
        },
        {
          stepNumber: '03',
          title: 'Execution',
          description: 'Fast, professional installation with quality materials and strict safety measures.',
          icon: Wrench,
        },
        {
          stepNumber: '04',
          title: 'Testing & Handover',
          description: 'Complete testing, documentation and final handover for a worry-free experience.',
          icon: CheckCircle2,
        },
      ];

  // Secondary showcase image for Overview (pendant lamps / interior installation)
  const overviewImage =
    service.service_images && service.service_images.length > 0
      ? service.service_images[0].media?.secure_url
      : 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80';

  // Villa night architectural photo for Dark CTA banner
  const ctaVillaImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="w-full bg-white text-slate-800">

      {/* ========================================================= */}
      {/* 1. HERO SECTION (Clean White Background, Split Layout)   */}
      {/* ========================================================= */}
      <section className="pt-8 pb-14 lg:pt-10 lg:pb-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-gold-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3 h-3 text-slate-300" />
              </li>
              <li>
                <Link href="/services" className="hover:text-gold-600 transition">
                  Services
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3 h-3 text-slate-300" />
              </li>
              <li className="text-slate-600 font-medium truncate max-w-[200px] sm:max-w-none">
                {service.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Column: Title, Intro, Feature Badges, CTAs */}
            <div className="lg:col-span-7 space-y-6">

              {/* Category Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[11px] font-extrabold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>
                  {isElectrical
                    ? 'ELECTRICAL SOLUTIONS'
                    : isAc
                    ? 'HVAC & COOLING SOLUTIONS'
                    : isPlumbing
                    ? 'PLUMBING & SANITARY'
                    : isPainting
                    ? 'PAINTING & COATINGS'
                    : `${service.name.toUpperCase()} SCOPE`}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-navy-900 tracking-tight leading-[1.15]">
                {service.name}
              </h1>

              {/* Subtitle Description */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
                {service.short_description ||
                  'Safe, reliable and efficient electrical systems for residential, commercial and industrial spaces. We handle everything from planning to installation, with full compliance and professional execution.'}
              </p>

              {/* 3 Key Feature Badges in a Row */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-navy-950 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-navy-900 leading-tight">
                      Licensed &amp; Certified Engineers
                    </h4>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-navy-950 text-white flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-navy-900 leading-tight">
                      UAE Municipality Compliant
                    </h4>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-navy-950 text-white flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-navy-900 leading-tight">
                      On-Time Project Delivery
                    </h4>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#quote-card"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-extrabold text-xs tracking-wide shadow-sm hover:shadow transition group"
                >
                  <span>Request a Free Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-800 font-bold text-xs transition"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Hero Image with Floating Badge */}
            <div className="lg:col-span-5 relative">
              {/* Soft decorative background accent shape */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-slate-100 to-amber-500/10 rounded-[36px] -z-10 blur-xl opacity-70" />

              <div className="relative rounded-[28px] overflow-hidden shadow-xl border border-slate-100 bg-slate-100 aspect-[4/3.8]">
                <CldImageWrapper
                  src={service.featured_image?.secure_url}
                  alt={service.name}
                  fill
                  fallbackText={service.name}
                  className="w-full h-full object-cover"
                />

                {/* Floating Bottom-Right Badge Card */}
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-navy-900 leading-tight">
                      Powering Safer Spaces
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      Expert {service.name} Solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CAPABILITIES / SCOPES 5-ICON RIBBON BAR                 */}
      {/* ========================================================= */}
      <section className="border-y border-slate-200/80 bg-slate-50/50 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-200">
            {capabilities.map((cap, i) => {
              const IconComponent = cap.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center justify-center p-2.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-navy-900 group-hover:text-gold-600 group-hover:border-gold-500/50 transition-all duration-200 mb-2">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                    {cap.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SERVICE OVERVIEW SECTION (Text + Landscape Image)      */}
      {/* ========================================================= */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Description Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-6 rounded-full bg-gold-500 inline-block shrink-0" />
                <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                  Service Overview
                </h2>
              </div>

              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3 pt-1">
                {service.description ||
                  `Our ${service.name} services cover complete electrical installations, system layouts, panel wiring, lighting, and maintenance for all types of buildings. We work with precision, follow safety standards, and ensure long-term reliability.\n\nFrom modern residential villas and multi-unit towers to commercial facilities and industrial plants, our licensed engineers coordinate each execution phase with seamless efficiency and uncompromising adherence to UAE civil defence and municipal regulations.`}
              </div>
            </div>

            {/* Right Overview Landscape Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 aspect-[16/10] bg-slate-100">
                <Image
                  src={overviewImage}
                  alt={`${service.name} Overview`}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. OUR PROCESS + GET A QUOTE CARD (Two Columns)           */}
      {/* ========================================================= */}
      <section className="py-12 sm:py-16 bg-slate-50/50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* Left Column: Our Process Stepper */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-1.5 h-6 rounded-full bg-gold-500 inline-block shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                    Our Process
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  A simple and transparent workflow to deliver the best results.
                </p>
              </div>

              {/* Vertical Process Timeline */}
              <div className="relative pt-3 space-y-6">
                {/* Connecting Vertical Line */}
                <div className="absolute left-[17px] top-6 bottom-6 w-0.5 bg-slate-200 border-l border-dashed border-slate-300 -z-0" />

                {processSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={idx} className="relative z-10 flex items-start gap-4 sm:gap-5 group">
                      {/* Step Number Dot */}
                      <div className="w-9 h-9 rounded-full bg-gold-500 text-navy-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                        {step.stepNumber}
                      </div>

                      {/* Step Content Card */}
                      <div className="flex-1 flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs group-hover:border-gold-500/40 transition">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-navy-900 flex items-center justify-center shrink-0">
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-xs sm:text-sm font-extrabold text-navy-900">
                            {step.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Get a Quote Card */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <ServiceDetailQuoteCard
                serviceId={service.id}
                serviceName={service.name}
                whatsappNumber={companySettings?.whatsapp_number || companySettings?.phone_primary}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. WHY CHOOSE US SECTION (4 Clean Cards Grid)             */}
      {/* ========================================================= */}
      <section className="py-14 sm:py-18 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-1.5 h-6 rounded-full bg-gold-500 inline-block shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                Why Choose Us
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Quality workmanship, safety compliance and complete project support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-navy-900 mb-3.5">
                <Shield className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-sm font-extrabold text-navy-900 mb-1">
                UAE Compliant
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All works as per municipality regulations
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-navy-900 mb-3.5">
                <Users className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-sm font-extrabold text-navy-900 mb-1">
                Experienced Team
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Certified and skilled electricians
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-navy-900 mb-3.5">
                <CheckCircle2 className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-sm font-extrabold text-navy-900 mb-1">
                Quality Materials
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                100% genuine &amp; trusted brands
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-navy-900 mb-3.5">
                <Clock className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-sm font-extrabold text-navy-900 mb-1">
                On-Time Delivery
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We value your time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. DARK CTA BANNER ("Let's Power Your Next Project")       */}
      {/* ========================================================= */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-navy-950 min-h-[300px] flex items-center border border-navy-800">
            {/* Background architectural photo with dark gradient overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src={ctaVillaImage}
                alt="Architectural Project"
                fill
                className="object-cover opacity-35 object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-transparent" />
            </div>

            <div className="relative z-10 p-8 sm:p-12 lg:p-14 max-w-2xl space-y-4">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[10px] font-extrabold uppercase tracking-widest">
                <Zap className="w-3 h-3 fill-gold-400 text-gold-400" />
                <span>
                  {isElectrical ? 'NEED ELECTRICAL SOLUTIONS' : `NEED ${service.name.toUpperCase()}`}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Let&apos;s Power Your Next Project
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                From small installations to large-scale projects, we&apos;re here to help.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#quote-card"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-extrabold text-xs tracking-wide shadow transition group"
                >
                  <span>Get a Free Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Us</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. RELATED SERVICES SECTION (5 Compact Cards in a Row)    */}
      {/* ========================================================= */}
      {relatedServices.length > 0 && (
        <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-1.5 h-6 rounded-full bg-gold-500 inline-block shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                    Related Services
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Explore our other contracting and maintenance services.
                </p>
              </div>

              <Link
                href="/services"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 hover:text-gold-600 transition group"
              >
                <span>View All Services</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedServices.map((other) => (
                <Link
                  key={other.id}
                  href={`/services/${other.slug}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Top Image */}
                  <div className="relative h-32 w-full bg-slate-100 overflow-hidden">
                    <CldImageWrapper
                      src={other.featured_image?.secure_url}
                      alt={other.name}
                      fill
                      fallbackText={other.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Card Title & Arrow */}
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <h3 className="text-xs font-black text-navy-900 group-hover:text-gold-600 transition-colors leading-snug line-clamp-2 mb-2">
                      {other.name}
                    </h3>
                    <div className="flex items-center text-gold-500 text-xs font-bold pt-1">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 hover:text-gold-600"
              >
                <span>View All Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
