import React from 'react';
import Link from 'next/link';
import { getPublishedJobs } from '@/lib/data/public';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function CareersPage() {
  const jobs = await getPublishedJobs();

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-400">
              CAREERS AT ALVERIC
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Build Your Career in Technical Contracting
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join our engineering and contracting workforce. We cultivate an environment of craftsmanship, continuous safety training, and career progression.
            </p>
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="py-16 bg-slate-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-1">
                No current openings.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                We currently have no active job postings. Please check back regularly or submit a spontaneous application through our contact form.
              </p>
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-navy-900 text-white rounded-lg text-xs font-bold hover:bg-navy-800 transition"
              >
                Send General Inquiry
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-navy-900">{job.title}</h2>
                      {job.department && (
                        <span className="px-2.5 py-0.5 rounded bg-navy-50 text-navy-900 text-[11px] font-bold">
                          {job.department}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold-500" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.employment_type && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gold-500" />
                          <span>{job.employment_type}</span>
                        </div>
                      )}
                      {job.experience && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-gold-500" />
                          <span>{job.experience}</span>
                        </div>
                      )}
                    </div>

                    {job.short_description && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 pt-1">
                        {job.short_description}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/careers/${job.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shrink-0 group"
                  >
                    <span>View Position</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
