import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedProjectBySlug, getCompanySettings } from '@/lib/data/public';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { formatDate } from '@/lib/utils';
import { MapPin, Calendar, User, Tag, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found | Alveric Technical Contracting LLC' };
  }

  return {
    title: `${project.seo_title || project.title} | Alveric Technical Contracting LLC`,
    description: project.seo_description || project.short_description || undefined,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const [project] = await Promise.all([
    getPublishedProjectBySlug(slug),
    getCompanySettings(),
  ]);

  if (!project) {
    notFound();
  }

  const heroImage = project.featured_image?.secure_url || project.thumbnail_media?.secure_url;
  const hasMetadata = project.client_name || project.location || project.completion_date || project.category;
  const hasCaseStudy = project.challenge || project.solution || project.results;

  return (
    <div className="w-full">
      {/* ── HERO with image as background ── */}
      <section className="relative min-h-[60vh] lg:min-h-[72vh] flex items-end overflow-hidden">
        {/* Background image */}
        {heroImage ? (
          <div className="absolute inset-0">
            <CldImageWrapper
              src={heroImage}
              alt={project.title}
              fill
              fallbackText=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-navy-950" />
        )}

        {/* Dark gradient overlay — stronger at bottom so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/20" />

        {/* Subtle left-side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 to-transparent" />

        {/* Content sitting on top of image */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-24">
          {/* Back link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-gold-400 transition font-semibold mb-6"
          >
            ← Back to All Projects
          </Link>

          <div className="max-w-3xl space-y-4">
            {project.category && (
              <span className="inline-block px-3 py-1 rounded bg-gold-500/25 text-gold-400 text-xs font-extrabold uppercase tracking-wider border border-gold-500/40 backdrop-blur-sm">
                {project.category.name}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
              {project.title}
            </h1>

            {project.short_description && (
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl drop-shadow">
                {project.short_description}
              </p>
            )}

            {/* Metadata pills */}
            {hasMetadata && (
              <div className="flex flex-wrap gap-3 pt-2">
                {project.client_name && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5">
                    <User className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span className="text-xs font-semibold text-white">{project.client_name}</span>
                  </div>
                )}
                {project.location && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span className="text-xs font-semibold text-white">{project.location}</span>
                  </div>
                )}
                {project.completion_date && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span className="text-xs font-semibold text-white">{formatDate(project.completion_date)}</span>
                  </div>
                )}
                {project.category && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5">
                    <Tag className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span className="text-xs font-semibold text-white">{project.category.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-10">

              {/* Project Overview */}
              {project.description && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gold-500 rounded-full inline-block" />
                    <h2 className="text-xl sm:text-2xl font-black text-navy-900">Project Overview</h2>
                  </div>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {project.description}
                  </div>
                </div>
              )}

              {/* Case Study Breakdown */}
              {hasCaseStudy && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-6 bg-gold-500 rounded-full inline-block" />
                    <h2 className="text-xl sm:text-2xl font-black text-navy-900">Project Case Study</h2>
                  </div>

                  <div className="space-y-4">
                    {project.challenge && (
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="w-4 h-4 text-gold-500 shrink-0" />
                          <h3 className="text-sm font-black text-navy-900 uppercase tracking-wide">The Engineering Challenge</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{project.challenge}</p>
                      </div>
                    )}

                    {project.solution && (
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-navy-600 shrink-0" />
                          <h3 className="text-sm font-black text-navy-900 uppercase tracking-wide">Our Technical Solution</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{project.solution}</p>
                      </div>
                    )}

                    {project.results && (
                      <div className="bg-gold-50 p-6 rounded-2xl border border-gold-200">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0" />
                          <h3 className="text-sm font-black text-navy-900 uppercase tracking-wide">Results & Impact</h3>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{project.results}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!project.description && !hasCaseStudy && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Layers className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-sm text-slate-400 font-semibold">Project details coming soon.</p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* CTA Card */}
              <div className="p-6 rounded-2xl bg-navy-950 text-white border border-navy-800 shadow-xl space-y-4 sticky top-24">
                <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
                  PROJECT INQUIRIES
                </span>
                <h3 className="text-xl font-black leading-snug">
                  Have a Similar Technical Requirement?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our team brings proven contracting methodologies and certified manpower to every assignment.
                </p>
                <div className="space-y-3 pt-2">
                  <Link
                    href={`/quote?category=${project.category_id || ''}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-wider hover:bg-gold-400 transition shadow"
                  >
                    <span>Request Similar Project Quote</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                  <Link
                    href="/projects"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20"
                  >
                    <span>Back to All Projects</span>
                  </Link>
                </div>
              </div>

              {/* Metadata card */}
              {hasMetadata && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h4 className="text-xs font-black text-navy-900 uppercase tracking-wider">Project Details</h4>
                  {project.client_name && (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <User className="w-3 h-3 text-gold-500" /><span>Client</span>
                      </div>
                      <p className="text-sm font-bold text-navy-900">{project.client_name}</p>
                    </div>
                  )}
                  {project.location && (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <MapPin className="w-3 h-3 text-gold-500" /><span>Location</span>
                      </div>
                      <p className="text-sm font-bold text-navy-900">{project.location}</p>
                    </div>
                  )}
                  {project.completion_date && (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <Calendar className="w-3 h-3 text-gold-500" /><span>Completed</span>
                      </div>
                      <p className="text-sm font-bold text-navy-900">{formatDate(project.completion_date)}</p>
                    </div>
                  )}
                  {project.category && (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <Tag className="w-3 h-3 text-gold-500" /><span>Sector</span>
                      </div>
                      <p className="text-sm font-bold text-navy-900">{project.category.name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
