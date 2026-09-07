import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutStorySectionProps {
  story: string;
}

export function AboutStorySection({ story }: AboutStorySectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Journey Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-500">
                OUR JOURNEY &amp; EXPERTISE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight leading-tight mt-2">
                Built on Foundations of Trust, Technical Rigor, and Integrity
              </h2>
            </div>

            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
              <p className="first-letter:text-4xl first-letter:font-black first-letter:text-navy-900 first-letter:mr-2 first-letter:float-left">
                {story}
              </p>
            </div>

            {/* Core Commitments Checklist */}
            <div className="space-y-3 pt-2">
              {[
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
              ].map((item) => (
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
                <span>Explore Our Capabilities</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: 2-Image Asymmetric Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 relative">
              {/* Photo 1: Site Inspection */}
              <div className="relative aspect-[16/10] sm:aspect-square lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 group">
                <Image
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"
                  alt="Engineers reviewing plans"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-white text-xs font-bold">
                  Field Engineering &amp; Diagnostics
                </span>
              </div>

              {/* Photo 2: MEP Infrastructure */}
              <div className="relative aspect-[16/10] sm:aspect-square lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 group">
                <Image
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
                  alt="MEP technical installation"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-white text-xs font-bold">
                  Precision Mechanical &amp; Electrical Scope
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
