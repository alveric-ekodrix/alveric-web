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
  Award,
  Lightbulb,
  Cpu,
  Shield,
  Layers,
  Sparkles,
  Phone,
} from 'lucide-react';

export const revalidate = 60;

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

/**
 * Parses markdown-style descriptions (headings, bullets, paragraphs)
 * and turns them into clean, structured, premium Alveric UI components.
 */
function FormattedDescription({ content, serviceName }: { content?: string | null; serviceName: string }) {
  if (!content) {
    return (
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
        Our {serviceName} contracting services cover complete engineering planning, professional installation,
        system maintenance, and statutory compliance across commercial, residential, and industrial properties in the UAE.
      </p>
    );
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentBullets: string[] = [];
  let currentParagraphLines: string[] = [];
  let hasBullets = false;

  function flushParagraph() {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(' ').trim();
      if (text) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {text}
          </p>
        );
      }
      currentParagraphLines = [];
    }
  }

  function flushBullets() {
    if (currentBullets.length > 0) {
      hasBullets = true;
      const items = [...currentBullets];
      elements.push(
        <div key={`bullets-${elements.length}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {items.map((bullet, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs hover:border-gold-500/40 hover:bg-white transition duration-200"
            >
              <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-semibold text-navy-900 leading-snug">
                {bullet}
              </span>
            </div>
          ))}
        </div>
      );
      currentBullets = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushParagraph();
      flushBullets();
      continue;
    }

    // Check if heading: #, ##, ###, ####
    if (/^#{1,4}\s+/.test(trimmed)) {
      flushParagraph();
      flushBullets();
      const headingText = trimmed.replace(/^#{1,4}\s+/, '');
      elements.push(
        <div key={`h-${elements.length}`} className="pt-4 pb-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-gold-500 shrink-0" />
            <h3 className="text-sm sm:text-base font-black text-navy-900 uppercase tracking-wide">
              {headingText}
            </h3>
          </div>
        </div>
      );
      continue;
    }

    // Check if bullet point: *, -, •
    if (/^[*•-]\s+/.test(trimmed)) {
      flushParagraph();
      const bulletText = trimmed.replace(/^[*•-]\s+/, '');
      currentBullets.push(bulletText);
      continue;
    }

    // Normal line
    if (currentBullets.length > 0) {
      flushBullets();
    }
    currentParagraphLines.push(trimmed);
  }

  flushParagraph();
  flushBullets();

  return (
    <div className="space-y-4">
      {elements}

      {/* If the description didn't provide bullets, show our default engineering scope checklist */}
      {!hasBullets && (
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-navy-900 mb-4">
            Scope &amp; Deliverables Checklist:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-slate-700 leading-snug">
                Detailed site survey and engineering load analysis
              </span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-slate-700 leading-snug">
                Approved high-grade materials and manufacturer warranties
              </span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-slate-700 leading-snug">
                UAE Municipality &amp; Civil Defence code compliance
              </span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-slate-700 leading-snug">
                Testing, commissioning, and full handover documentation
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
        { label: 'Pipe Routing & Fitting', icon: Zap },
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
        { label: 'Quality Execution', icon: Zap },
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
          title: 'Site Survey & Consultation',
          description: 'Our engineering specialists inspect the site, evaluate technical requirements, and define the complete scope.',
          icon: FileText,
        },
        {
          stepNumber: '02',
          title: 'Engineering & Planning',
          description: 'We develop detailed schematics, calculate specifications, and prepare approvals compliant with UAE regulations.',
          icon: Settings,
        },
        {
          stepNumber: '03',
          title: 'Precision Execution',
          description: 'Execution by certified technicians using premium materials, adhering to strict safety and quality benchmarks.',
          icon: Wrench,
        },
        {
          stepNumber: '04',
          title: 'Testing & Handover',
          description: 'Comprehensive testing, commissioning, quality sign-off, and formal documentation handover.',
          icon: CheckCircle2,
        },
      ];

  return (
    <div className="w-full bg-white text-slate-800">

      {/* ========================================================= */}
      {/* 1. HERO SECTION (Signature Alveric Deep Navy & Gold)      */}
      {/* ========================================================= */}
      <section className="relative bg-navy-950 text-white pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-navy-800 overflow-hidden">
        {/* Subtle architectural tech grid pattern matching Home & About */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B2239_1px,transparent_1px),linear-gradient(to_bottom,#0B2239_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        {/* Ambient radial lighting glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-gold-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3 h-3 text-slate-600" />
              </li>
              <li>
                <Link href="/services" className="hover:text-gold-400 transition">
                  Services
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3 h-3 text-slate-600" />
              </li>
              <li className="text-gold-400 font-semibold truncate max-w-[200px] sm:max-w-none">
                {service.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Column: Eyebrow, Title, Description, Highlight Pills, Action Buttons */}
            <div className="lg:col-span-7 space-y-6">

              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[11px] font-extrabold uppercase tracking-[0.2em] backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                <span>
                  {isElectrical
                    ? 'ELECTRICAL CONTRACTING'
                    : isAc
                    ? 'HVAC & COOLING SYSTEMS'
                    : isPlumbing
                    ? 'PLUMBING & SANITARY SCOPE'
                    : isPainting
                    ? 'PAINTING & SURFACE FINISHES'
                    : `${service.name.toUpperCase()} SOLUTIONS`}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] uppercase">
                {service.name}
              </h1>

              {/* Subtitle Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                {service.short_description ||
                  `Engineered ${service.name.toLowerCase()} solutions executed by licensed specialists across commercial, residential, and industrial facilities in the UAE.`}
              </p>

              {/* 3 Key Alveric Feature Highlights — 2 col on mobile, 3 on sm+ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                      UAE Compliant
                    </h4>
                    <span className="text-[9.5px] sm:text-[10px] text-slate-400 block mt-0.5">Safety codes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                      Licensed Engineers
                    </h4>
                    <span className="text-[9.5px] sm:text-[10px] text-slate-400 block mt-0.5">Certified team</span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                      On-Time Delivery
                    </h4>
                    <span className="text-[9.5px] sm:text-[10px] text-slate-400 block mt-0.5">Milestone schedule</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#quote-card"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-gold-500/20 hover:scale-[1.02] transition-all duration-200 group"
                >
                  <span>Request a Free Quote</span>
                  <ArrowRight className="w-4 h-4 text-navy-950 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm tracking-wide backdrop-blur-sm hover:scale-[1.02] transition-all duration-200"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Hero Visual Container */}
            <div className="lg:col-span-5 relative">
              {/* Outer decorative gold accent glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-gold-500/20 via-navy-800 to-gold-500/10 rounded-[32px] -z-10 blur-xl opacity-80" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-navy-800 bg-navy-900 aspect-[4/3.4]">
                {service.featured_image?.secure_url ? (
                  <CldImageWrapper
                    src={service.featured_image.secure_url}
                    alt={service.name}
                    fill
                    fallbackText={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4 shadow-inner">
                      <ServiceIcon
                        iconUrl={service.icon_media?.secure_url}
                        slug={service.slug}
                        name={service.name}
                        className="w-10 h-10"
                      />
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Alveric Technical Contracting LLC
                    </p>
                  </div>
                )}

                {/* Very light vignette — only bottom third for badge readability, keeps image clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/65 via-transparent to-transparent pointer-events-none" />

                {/* Floating Bottom Badge Card */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-navy-950/85 backdrop-blur-md shadow-xl border border-white/15">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] sm:text-xs font-black text-white leading-tight truncate">
                      Engineered Quality &amp; Precision
                    </h4>
                    <p className="text-[9.5px] sm:text-[10px] text-slate-300 leading-tight mt-0.5 truncate">
                      Alveric Technical Contracting LLC
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom gold accent dividing strip */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 shadow-sm" />
      </section>

      {/* ========================================================= */}
      {/* 2. CAPABILITIES / SCOPES 5-ICON RIBBON BAR                 */}
      {/* ========================================================= */}
      <section className="border-b border-slate-200 bg-slate-50/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {capabilities.map((cap, i) => {
              const IconComponent = cap.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center justify-center p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-gold-500/50 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center group-hover:bg-navy-900 group-hover:text-gold-400 group-hover:border-navy-900 transition-all duration-200 mb-2 shadow-2xs">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-navy-900 group-hover:text-gold-600 transition-colors leading-tight">
                    {cap.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SERVICE OVERVIEW SECTION (100% Image-Free & Clean)      */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* Left Column: Parsed Rich Service Description & Bullet Cards */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500 block mb-1">
                  TECHNICAL SCOPE
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-7 rounded-full bg-gold-500 inline-block shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                    Service Overview
                  </h2>
                </div>
              </div>

              {/* Rich Markdown Parser Component */}
              <FormattedDescription content={service.description} serviceName={service.name} />
            </div>

            {/* Right Column: Alveric Engineering Standards Card (NO IMAGE AT ALL) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-navy-950 text-white p-7 sm:p-8 border border-navy-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-gold-400" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                    ALVERIC ASSURANCE
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-white tracking-tight mb-2">
                  Technical Standards &amp; Compliance
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Every {service.name} project is executed in full compliance with UAE regulatory authorities and strict international engineering codes.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5 pb-4 border-b border-navy-800">
                    <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Full Authority Clearances</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Compliant with UAE Municipality, Civil Defence, and utility standards.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pb-4 border-b border-navy-800">
                    <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Licensed Technical Supervisors</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Qualified project engineers overseeing every execution milestone on-site.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pb-4 border-b border-navy-800">
                    <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">100% Certified Materials</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Only genuine, tested, and manufacturer-approved components &amp; equipment.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Milestone &amp; Handover Guarantee</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Structured timelines with zero hidden fees and formal testing sign-off.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-navy-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Need a site inspection?</span>
                  <a
                    href="#quote-card"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300 transition"
                  >
                    <span>Request Survey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. OUR PROCESS + GET A QUOTE CARD (Two Columns)           */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* Left Column: Our Process Stepper */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500 block mb-1">
                  WORKFLOW &amp; METHODOLOGY
                </span>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-1.5 h-7 rounded-full bg-gold-500 inline-block shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                    How We Execute Your Project
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  A structured, transparent engineering process designed to deliver exceptional quality on schedule.
                </p>
              </div>

              {/* Process Steps — 2-col grid on mobile, vertical list on lg */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-0 lg:relative lg:pt-3 lg:space-y-5">
                {/* Connecting Vertical Line — desktop only */}
                <div className="hidden lg:block absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-200 border-l border-dashed border-slate-300 -z-0" />

                {processSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isLastOdd = processSteps.length % 2 !== 0 && idx === processSteps.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`relative z-10 group ${
                        isLastOdd ? 'col-span-2' : ''
                      } lg:flex lg:items-start lg:gap-4 sm:gap-5`}
                    >
                      {/* Mobile card layout */}
                      <div className="lg:hidden flex flex-col h-full p-3 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm group-hover:border-gold-500/40 transition">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-navy-950 text-gold-400 font-black text-[10px] flex items-center justify-center shrink-0">
                            {step.stepNumber}
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <StepIcon className="w-3.5 h-3.5 text-gold-600" />
                          </div>
                        </div>
                        <h3 className="text-[11px] sm:text-xs font-extrabold text-navy-900 mb-1 leading-snug">
                          {step.title}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Desktop timeline layout */}
                      <div className="hidden lg:flex items-start gap-4 sm:gap-5">
                        <div className="w-10 h-10 rounded-xl bg-navy-950 text-gold-400 font-black text-xs flex items-center justify-center shrink-0 shadow-md border-2 border-white group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1 flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs group-hover:border-gold-500/40 group-hover:shadow-sm transition">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 text-navy-900 flex items-center justify-center shrink-0">
                            <StepIcon className="w-4 h-4 text-gold-600" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-extrabold text-navy-900">{step.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Sticky Quote Card */}
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
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500 block mb-1">
              THE ALVERIC ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight">
              Why Choose Alveric for {service.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Engineering leadership, certified field technicians, and uncompromised safety compliance.
            </p>
          </div>

          {/* Why Choose Us — 2-col on mobile, 4-col on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Card 1 */}
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-gold-500/40 hover:-translate-y-0.5 transition duration-200 flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-navy-950 text-white flex items-center justify-center mb-3 sm:mb-4 shadow-sm shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
              </div>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-navy-900 mb-1 sm:mb-1.5 leading-snug">
                UAE Regulatory Compliance
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                All contracting adheres strictly to regional civil defence, municipal, and health &amp; safety standards.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-gold-500/40 hover:-translate-y-0.5 transition duration-200 flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-navy-950 text-white flex items-center justify-center mb-3 sm:mb-4 shadow-sm shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
              </div>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-navy-900 mb-1 sm:mb-1.5 leading-snug">
                Certified Engineering Staff
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                Multi-disciplinary technicians with verified technical credentials and continuous safety training.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-gold-500/40 hover:-translate-y-0.5 transition duration-200 flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-navy-950 text-white flex items-center justify-center mb-3 sm:mb-4 shadow-sm shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
              </div>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-navy-900 mb-1 sm:mb-1.5 leading-snug">
                Quality Materials Only
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                100% genuine components and durable parts procured exclusively from certified manufacturers.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-gold-500/40 hover:-translate-y-0.5 transition duration-200 flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-navy-950 text-white flex items-center justify-center mb-3 sm:mb-4 shadow-sm shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
              </div>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-navy-900 mb-1 sm:mb-1.5 leading-snug">
                Strict On-Time Delivery
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                Disciplined project scheduling ensures milestones are achieved without costly project delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. ALVERIC BRANDED DARK CTA BANNER (No Stock Photos)      */}
      {/* ========================================================= */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-navy-950 overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-14 border border-navy-800">
            {/* Subtle tech grid background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B2239_1px,transparent_1px),linear-gradient(to_bottom,#0B2239_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35 pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[10px] font-extrabold uppercase tracking-widest">
                  <Zap className="w-3 h-3 fill-gold-400 text-gold-400" />
                  <span>NEED {service.name.toUpperCase()}?</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  Let&apos;s Build &amp; Power Your Next Project Together
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Connect with our licensed engineering team for detailed technical proposals, site inspections, and competitive contracting estimates across the UAE.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 shrink-0">
                <a
                  href="#quote-card"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-gold-500/20 hover:scale-[1.02] transition-all duration-200 group"
                >
                  <span>Request a Free Quote</span>
                  <ArrowRight className="w-4 h-4 text-navy-950 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-sm hover:scale-[1.02] transition-all duration-200"
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
      {/* 7. RELATED SERVICES SECTION (Clean Alveric Cards)         */}
      {/* ========================================================= */}
      {relatedServices.length > 0 && (
        <section className="py-14 sm:py-18 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-500 block mb-1">
                  MORE EXPERTISE
                </span>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-1.5 h-6 rounded-full bg-gold-500 inline-block shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                    Related Services
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Explore other specialized contracting disciplines delivered by Alveric.
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedServices.map((other) => (
                <Link
                  key={other.id}
                  href={`/services/${other.slug}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:border-gold-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Top Image — brighter, no heavy overlay */}
                  <div className="relative h-28 sm:h-32 w-full bg-slate-100 overflow-hidden">
                    <CldImageWrapper
                      src={other.featured_image?.secure_url}
                      alt={other.name}
                      fill
                      fallbackText={other.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {/* Very light bottom gradient only for legibility — keeps image clear */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 to-transparent pointer-events-none" />
                  </div>

                  {/* Card Title & Arrow */}
                  <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between">
                    <h3 className="text-[11px] sm:text-xs font-black text-navy-900 group-hover:text-gold-600 transition-colors leading-snug line-clamp-2 mb-1.5 sm:mb-2">
                      {other.name}
                    </h3>
                    <div className="flex items-center text-gold-500 font-bold pt-1">
                      <span className="text-[10px] sm:text-[11px] group-hover:underline">Explore</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
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
