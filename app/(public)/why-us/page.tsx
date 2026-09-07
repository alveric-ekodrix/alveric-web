import React from 'react';
import Link from 'next/link';
import { getWhyUsSettings, getWhyUsFeatures, getSiteStatistics } from '@/lib/data/public';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { Shield, Award, Clock, Users, Wrench, CheckCircle, ArrowRight } from 'lucide-react';

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

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-400">
              WHY CHOOSE ALVERIC
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {heading}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (Dynamically Populated from Supabase) */}
      <section className="py-16 bg-white min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {features.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Default corporate capability pillars */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center mb-5">
                  <Wrench className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-lg font-black text-navy-900 mb-2">Technical Competence</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Certified technicians and multi-disciplinary engineers handling complex MEP installations and structural operations.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center mb-5">
                  <Shield className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-lg font-black text-navy-900 mb-2">HSE Safety Compliance</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Zero-compromise safety policies strictly compliant with municipal safety codes and occupational health regulations.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center mb-5">
                  <Clock className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-lg font-black text-navy-900 mb-2">On-Time Execution</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Rigorous milestone planning and project supervision ensuring on-schedule completion without budget overruns.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition"
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
                    <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center mb-5">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  )}
                  <h3 className="text-lg font-black text-navy-900 mb-2">{feature.title}</h3>
                  {feature.description && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics if configured */}
      {statistics.length > 0 && (
        <section className="py-14 bg-navy-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {statistics.map((stat) => (
                <div key={stat.id} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-gold-400">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mb-3">
            Build with Confidence and Precision
          </h2>
          <p className="text-sm text-slate-600 mb-8 max-w-xl mx-auto">
            Contact our engineering team to request an on-site technical inspection or commercial estimate.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-navy-900 text-white font-bold text-sm rounded-lg hover:bg-navy-800 transition shadow"
          >
            <span>Request a Technical Quote</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </Link>
        </div>
      </section>
    </div>
  );
}
