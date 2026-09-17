import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutStorySectionProps {
  story: string;
  eyebrow?: string | null;
  heading?: string | null;
  buttonText?: string | null;
  storyImageUrl?: string | null;
  storyImageOverlayTitle?: string | null;
  benefits?: string[] | null;
}

export function AboutStorySection({
  story,
  eyebrow,
  heading,
  buttonText,
  storyImageUrl,
  storyImageOverlayTitle,
  benefits,
}: AboutStorySectionProps) {
  const defaultCommitments = [
    {
      title: 'Certified Engineering Specialists',
      desc: 'Dedicated supervisors, certified electricians, and HVAC engineers on every project.',
    },
    {
      title: 'Regulatory & Code Compliance',
      desc: 'Strict adherence to regional civil defense, municipality, and environmental health regulations.',
    },
    {
      title: 'Transparent Pricing & Accountability',
      desc: 'Clear bills of quantities, defined milestone schedules, and complete cost transparency.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Journey Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-500">
                {eyebrow || 'OUR JOURNEY & EXPERTISE'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight leading-tight mt-2">
                {heading || 'Built on Foundations of Trust, Technical Rigor, and Integrity'}
              </h2>
            </div>

            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
              <p className="first-letter:text-4xl first-letter:font-black first-letter:text-navy-900 first-letter:mr-2 first-letter:float-left">
                {story}
              </p>
            </div>

            {/* Core Commitments Checklist */}
            <div className="space-y-3 pt-2">
              {benefits && benefits.length > 0
                ? benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-gold-50 text-gold-600 border border-gold-200 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-navy-900">{b}</h4>
                      </div>
                    </div>
                  ))
                : defaultCommitments.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-gold-50 text-gold-600 border border-gold-200 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-navy-900">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
            </div>

            <div className="pt-2">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shadow-sm group"
              >
                <span>{buttonText || 'Explore Our Capabilities'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Story Showcase Image from Admin */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 group">
              {storyImageUrl ? (
                <Image
                  src={storyImageUrl}
                  alt={heading || 'Alveric Technical Contracting Story'}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 mb-3">
                    <CheckCircle2 className="w-8 h-8 text-gold-500" />
                  </div>
                  <span className="text-sm font-bold text-navy-900 mb-1">
                    Our Story &amp; Journey
                  </span>
                  <span className="text-xs text-slate-500 max-w-xs">
                    Building Solutions. Delivering Excellence.
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/15 to-transparent pointer-events-none" />

              {storyImageOverlayTitle && (
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <span className="block w-6 h-1 bg-gold-500 rounded-full mb-2" />
                  <span className="text-xs sm:text-sm font-bold leading-snug text-white block">
                    {storyImageOverlayTitle}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
