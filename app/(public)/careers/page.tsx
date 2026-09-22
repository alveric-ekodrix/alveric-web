import React from 'react';
import Link from 'next/link';
import { getPublishedJobs } from '@/lib/data/public';
import { Briefcase, MapPin, Clock, ArrowRight, Users } from 'lucide-react';

export const revalidate = 60;

export default async function CareersPage() {
  const jobs = await getPublishedJobs();

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
                Careers at Alveric
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Build Your Career in{' '}
              <span className="text-gold-400">Technical Contracting</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Join our engineering and contracting workforce. We cultivate an environment of
              craftsmanship, continuous safety training, and career progression.
            </p>
          </div>
        </div>
      </section>

      {/* ── Jobs Listing ── */}
      <section className="py-16 bg-slate-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">
                No current openings.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                We currently have no active job postings. Please check back regularly or
                submit a spontaneous application through our contact form.
              </p>
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-800 transition"
              >
                Send General Inquiry
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="group bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-navy-900 group-hover:text-gold-600 transition-colors">
                        {job.title}
                      </h2>
                      {job.department && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gold-50 text-gold-700 text-[11px] font-bold border border-gold-200">
                          {job.department}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      {job.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.employment_type && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span>{job.employment_type}</span>
                        </div>
                      )}
                      {job.experience && (
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span>{job.experience}</span>
                        </div>
                      )}
                    </div>

                    {job.short_description && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 pt-0.5">
                        {job.short_description}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/careers/${job.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-gold-500 hover:text-navy-950 transition shrink-0 group/btn"
                  >
                    <span>View Position</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Culture CTA Strip ── */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-navy-900">
                  Don&apos;t see your role? Reach out anyway.
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  We&apos;re always looking for talented engineers and technicians to join our team.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white font-bold text-sm rounded-xl hover:bg-navy-800 transition shrink-0"
            >
              <span>Contact Our Team</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
