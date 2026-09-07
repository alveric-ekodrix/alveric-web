import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedJobBySlug } from '@/lib/data/public';
import { CareerApplicationForm } from '@/components/forms/CareerApplicationForm';
import { MapPin, Clock, Briefcase, CheckCircle2, ArrowLeft } from 'lucide-react';

interface CareerDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CareerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);

  if (!job) {
    return { title: 'Career Opening Not Found | Alveric Technical Contracting LLC' };
  }

  return {
    title: `${job.title} | Careers | Alveric Technical Contracting LLC`,
    description: job.short_description || undefined,
  };
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const responsibilities: string[] = Array.isArray(job.responsibilities)
    ? (job.responsibilities as string[])
    : [];
  const requirements: string[] = Array.isArray(job.requirements)
    ? (job.requirements as string[])
    : [];

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-navy-950 text-white py-14 lg:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-gold-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Careers</span>
          </Link>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-400">
                JOB OPENING
              </span>
              {job.department && (
                <span className="px-2.5 py-0.5 rounded bg-white/10 text-white text-xs font-bold">
                  {job.department}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {job.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
            {job.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span>{job.location}</span>
              </div>
            )}
            {job.employment_type && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold-500" />
                <span>{job.employment_type}</span>
              </div>
            )}
            {job.experience && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-gold-500" />
                <span>{job.experience}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Job Details & Application Form */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              {job.description && (
                <div className="space-y-3">
                  <h2 className="text-xl font-black text-navy-900">Position Overview</h2>
                  <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                </div>
              )}

              {responsibilities.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-black text-navy-900">Key Responsibilities</h2>
                  <div className="space-y-2">
                    {responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {requirements.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-black text-navy-900">Requirements & Qualifications</h2>
                  <div className="space-y-2">
                    {requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-navy-900 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Application Form */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-5 sticky top-24">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gold-500">
                    APPLY NOW
                  </span>
                  <h3 className="text-xl font-black text-navy-900 mt-1">Submit Your Application</h3>
                </div>

                <CareerApplicationForm jobId={job.id} jobTitle={job.title} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
