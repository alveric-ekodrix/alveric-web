import React from 'react';
import Link from 'next/link';
import { HomepageSettings, SiteStatistic } from '@/types/database';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HomeAboutSectionProps {
  settings?: HomepageSettings | null;
  statistics?: SiteStatistic[];
}

export function HomeAboutSection({ settings, statistics = [] }: HomeAboutSectionProps) {
  const heading = settings?.about_heading || 'Built on Integrity.\nDriven by Excellence.';
  const description =
    settings?.about_description ||
    'Alveric Technical Contracting LLC is a trusted name in the contracting industry, delivering end-to-end technical solutions across a wide range of disciplines. Our experienced team ensures quality execution, on-time delivery, and customer satisfaction in every project we undertake.';

  // Dynamic experience calculation:
  // Base: 5+ years in 2026. Every next year (2027 => 6+, 2028 => 7+, etc.) increments automatically.
  const currentYear = new Date().getFullYear();
  const calculatedYears = Math.max(5, 5 + (currentYear - 2026));
  const dynamicExperienceText = `${calculatedYears}+\nYears of\nExperience`;
  
  // Fallback to dynamic if legacy '20+' or empty
  const rawExperience = settings?.about_experience_text?.trim();
  const experienceBadge = (!rawExperience || rawExperience.includes('20+'))
    ? dynamicExperienceText
    : rawExperience;

  const ctaText = settings?.about_cta_text || 'Learn More About Us';
  const ctaUrl = settings?.about_cta_url || '/about';

  const image1 =
    settings?.about_image_1?.secure_url ||
    (typeof settings?.about_image_1 === 'string' ? settings.about_image_1 : null) ||
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop';

  const image2 =
    settings?.about_image_2?.secure_url ||
    (typeof settings?.about_image_2 === 'string' ? settings.about_image_2 : null) ||
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop';

  const image3 =
    settings?.about_image_3?.secure_url ||
    (typeof settings?.about_image_3 === 'string' ? settings.about_image_3 : null) ||
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200&auto=format&fit=crop';

  return (
    <section className="relative bg-navy-950 text-white py-24 sm:py-32 lg:py-36 border-t border-navy-800 overflow-hidden">
      {/* Subtle background tech grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B2239_1px,transparent_1px),linear-gradient(to_bottom,#0B2239_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left: 3-Image Collage + Floating Experience Badge */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 relative">
              {/* Column 1: Two stacked images */}
              <div className="space-y-4 sm:space-y-6">
                <div className="relative h-44 sm:h-56 rounded-2xl overflow-hidden shadow-xl border border-navy-800 bg-navy-900 flex items-end p-4 group">
                  {/* Direct high-reliability native img tag */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image1}
                    alt={settings?.about_image_1?.alt_text || 'Electrical & MEP'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <span className="text-xs font-bold text-gold-400 block mb-0.5 drop-shadow">ELECTRICAL & MEP</span>
                    <span className="text-[11px] text-slate-200 drop-shadow">Technical contracting specialists</span>
                  </div>
                </div>

                <div className="relative h-44 sm:h-56 rounded-2xl overflow-hidden shadow-xl border border-navy-800 bg-navy-900 flex items-end p-4 group">
                  {/* Direct high-reliability native img tag */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image2}
                    alt={settings?.about_image_2?.alt_text || 'Facility Engineering'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <span className="text-xs font-bold text-gold-400 block mb-0.5 drop-shadow">FACILITY ENGINEERING</span>
                    <span className="text-[11px] text-slate-200 drop-shadow">Advanced building solutions</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Tall Image */}
              <div className="pt-6 sm:pt-10">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-navy-800 bg-navy-900 flex items-end p-4 group">
                  {/* Direct high-reliability native img tag */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image3}
                    alt={settings?.about_image_3?.alt_text || 'Field Experts'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <span className="text-xs font-bold text-gold-400 block mb-0.5 drop-shadow">FIELD EXPERTS</span>
                    <span className="text-[11px] text-slate-200 drop-shadow">Certified technicians & engineers</span>
                  </div>
                </div>
              </div>

              {/* Floating Round Experience Badge */}
              {experienceBadge && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gold-500 text-white shadow-2xl flex flex-col items-center justify-center text-center p-2 border-4 border-navy-950 font-black">
                  {experienceBadge.split('\n').map((line, idx) => (
                    <span
                      key={idx}
                      className={
                        idx === 0
                          ? 'text-lg sm:text-xl leading-tight font-black'
                          : 'text-[9px] sm:text-[10px] uppercase font-bold tracking-wider leading-tight'
                      }
                    >
                      {line}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Content & Statistics */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-400">
                ABOUT ALVERIC
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mt-2 uppercase">
                {heading.split('\n').map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                    {idx === heading.split('\n').length - 1 && (
                      <span className="text-gold-500 inline-block ml-1">.</span>
                    )}
                  </span>
                ))}
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {description}
            </p>

            {/* Statistics Counters from Supabase */}
            {statistics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-navy-800">
                {statistics.map((stat) => (
                  <div key={stat.id} className="space-y-1">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-gold-400">
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="text-lg font-bold text-gold-400">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg border border-slate-600 text-white font-semibold text-sm hover:border-gold-500 hover:text-gold-400 transition group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
