import React from 'react';
import { getPublishedServices, getPublishedCategories, getCompanySettings } from '@/lib/data/public';
import { QuoteRequestForm } from '@/components/forms/QuoteRequestForm';
import { ShieldCheck, Clock, FileText } from 'lucide-react';

export const revalidate = 60;

interface QuotePageProps {
  searchParams: Promise<{ service?: string; category?: string }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const { service: defaultServiceId, category: defaultCategoryId } = await searchParams;

  const [services, categories, companySettings] = await Promise.all([
    getPublishedServices(),
    getPublishedCategories(),
    getCompanySettings(),
  ]);

  return (
    <div className="w-full">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-navy-950 text-white py-20 lg:py-28">
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                Commercial &amp; Technical Proposals
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Request a Free{' '}
              <span className="text-gold-400">Technical Quote</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Submit your engineering scope or maintenance project details. Our estimation
              engineers will analyze your specifications and provide a competitive, transparent proposal.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Form & Value Points */}
      <section className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: What to Expect */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-navy-950 text-white p-8 rounded-2xl border border-navy-800 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
                    OUR PROMISE
                  </span>
                  <h2 className="text-xl font-black mt-1">Why Partner With Alveric?</h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Rapid Response</span>
                      <span>Itemized quote delivered within 24 to 48 hours of submission.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Transparent Costing</span>
                      <span>Clear breakdown of materials, certified manpower, and project milestones.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Engineered Quality</span>
                      <span>Guaranteed adherence to municipality standards and technical codes.</span>
                    </div>
                  </div>
                </div>

                {companySettings?.phone_primary && (
                  <div className="pt-4 border-t border-navy-800">
                    <p className="text-xs text-slate-400">Prefer direct telephone consultation?</p>
                    <a
                      href={`tel:${companySettings.phone_primary.replace(/\s+/g, '')}`}
                      className="text-sm font-bold text-gold-400 hover:underline block mt-1"
                    >
                      Call: {companySettings.phone_primary}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quote Request Form */}
            <div className="lg:col-span-8">
              <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gold-500">
                    PROJECT ESTIMATION FORM
                  </span>
                  <h2 className="text-2xl font-black text-navy-900 mt-1">
                    Provide Your Technical Requirements
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Please provide detailed specifications for accurate commercial and technical estimation.
                  </p>
                </div>

                <QuoteRequestForm
                  services={services}
                  categories={categories}
                  defaultServiceId={defaultServiceId}
                  defaultCategoryId={defaultCategoryId}
                  whatsappNumber={companySettings?.whatsapp_number || companySettings?.phone_primary}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
