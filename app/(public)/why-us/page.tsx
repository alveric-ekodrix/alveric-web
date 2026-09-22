import React from 'react';
import Link from 'next/link';
import { getWhyUsSettings, getWhyUsFeatures, getSiteStatistics } from '@/lib/data/public';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import {
  Shield, Award, Clock, Users, Wrench, CheckCircle,
  ArrowRight, Star, TrendingUp, Zap,
} from 'lucide-react';

export const revalidate = 60;

export default async function WhyUsPage() {
  const [settings, features, statistics] = await Promise.all([
    getWhyUsSettings(),
    getWhyUsFeatures(),
    getSiteStatistics('why-us'),
  ]);

  const heading = settings?.heading || 'Engineered for Performance. Driven by Standards.';
  const description =
    settings?.description ||
    'At Alveric Technical Contracting LLC, we pair seasoned engineering leadership with certified technical field teams to deliver reliable, durable contracting and facility maintenance services.';

  const defaultFeatures = [
    {
      icon: Wrench,
      title: 'Technical Competence',
      description:
        'Certified technicians and multi-disciplinary engineers handling complex MEP installations and structural operations.',
    },
    {
      icon: Shield,
      title: 'HSE Safety Compliance',
      description:
        'Zero-compromise safety policies strictly compliant with municipal safety codes and occupational health regulations.',
    },
    {
      icon: Clock,
      title: 'On-Time Execution',
      description:
        'Rigorous milestone planning and project supervision ensuring on-schedule completion without budget overruns.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description:
        'Comprehensive QA/QC protocols throughout every project phase, from material sourcing to final handover.',
    },
    {
      icon: Users,
      title: 'Experienced Team',
      description:
        'Seasoned engineering leadership backed by a skilled and dedicated field workforce across all disciplines.',
    },
    {
      icon: TrendingUp,
      title: 'Proven Track Record',
      description:
        'A portfolio of successfully completed commercial, residential, and industrial projects across the UAE.',
    },
  ];

  return (
    <div className="w-full">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-navy-950 text-white py-20 lg:py-28">
        {/* Geometric accents */}
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
                Why Choose Alveric
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              {heading}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Feature Cards Grid ── */}
      <section className="py-16 lg:py-20 bg-slate-50 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {features.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {defaultFeatures.map(({ icon: Icon, title, description: desc }) => (
                <div
                  key={title}
                  className="group p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center mb-5 group-hover:bg-gold-500 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-gold-400 group-hover:text-navy-950 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-black text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">{title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="group p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {feature.icon_media ? (
                    <div className="relative w-12 h-12 mb-5">
                      <CldImageWrapper
                        src={feature.icon_media.secure_url}
                        alt={feature.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center mb-5 group-hover:bg-gold-500 transition-colors duration-300">
                      <CheckCircle className="w-6 h-6 text-gold-400 group-hover:text-navy-950 transition-colors duration-300" />
                    </div>
                  )}
                  <h3 className="text-lg font-black text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">{feature.title}</h3>
                  {feature.description && (
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Statistics Strip ── */}
      {statistics.length > 0 && (
        <section className="py-14 bg-navy-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {statistics.map((stat) => (
                <div key={stat.id} className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-black text-gold-400">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Section ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-[#0f1f3d] to-navy-900" />
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)' }}
            />

            <div className="relative z-10 p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-gold-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-400">Build with Confidence</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  Build with Confidence and Precision
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Contact our engineering team to request an on-site technical inspection or commercial estimate.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold-500 text-navy-950 font-black text-sm rounded-xl hover:bg-gold-400 transition shadow-lg"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition border border-white/20"
                >
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
