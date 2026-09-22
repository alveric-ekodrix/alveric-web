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

            {/* Right Sidebar — sticky wrapper keeps both cards together */}
            <div className="lg:col-span-4">
              <div className="space-y-5 sticky top-28">

                {/* ── Premium CTA Card ── */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  {/* Dark gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-[#0f1f3d] to-navy-900" />
                  {/* Gold accent bar at top */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />
                  {/* Subtle grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(255,255,255,1) 23px,rgba(255,255,255,1) 24px),repeating-linear-gradient(90deg,transparent,transparent 23px,rgba(255,255,255,1) 23px,rgba(255,255,255,1) 24px)',
                    }}
                  />

                  <div className="relative z-10 p-6 space-y-5">
                    {/* Label */}
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gold-400">
                        Project Inquiries
                      </span>
                    </div>

                    {/* Heading */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-black leading-snug text-white">
                        Have a Similar<br />Technical Requirement?
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Our certified team delivers every project with precision, quality, and on-schedule execution.
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/10" />

                    {/* Actions */}
                    <div className="space-y-2.5">
                      {/* Primary CTA */}
                      <Link
                        href={`/quote?category=${project.category_id || ''}`}
                        className="group w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #d4a017, #f5c842)', color: '#0f172a' }}
                      >
                        <span>Request a Project Quote</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {/* WhatsApp quick chat */}
                      <a
                        href={`https://wa.me/971569919792?text=${encodeURIComponent(`Hi! I saw your project "${project.title}" and I'd like to discuss a similar requirement.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-[11px] transition-all duration-200 border border-white/10 hover:border-[#25D366]/50 hover:bg-[#25D366]/10"
                        style={{ background: 'rgba(37,211,102,0.08)', color: '#4ade80' }}
                      >
                        {/* WhatsApp icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.112 1.532 5.836L.057 23.882a.75.75 0 0 0 .918.926l6.188-1.461A11.938 11.938 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.938 9.938 0 0 1-5.134-1.427l-.367-.217-3.807.899.944-3.698-.24-.381A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                        <span>Chat on WhatsApp</span>
                      </a>

                      {/* Back link */}
                      <Link
                        href="/projects"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-slate-400 hover:text-white font-semibold text-[11px] transition-colors duration-200"
                      >
                        ← Back to All Projects
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ── Metadata Card ── */}
                {hasMetadata && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Card header */}
                    <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
                      <h4 className="text-[10px] font-black text-navy-900 uppercase tracking-wider">Project Details</h4>
                    </div>
                    {/* Card body */}
                    <div className="bg-white px-5 py-4 space-y-4">
                      {project.client_name && (
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gold-50 border border-gold-100 shrink-0 mt-0.5">
                            <User className="w-3.5 h-3.5 text-gold-500" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Client</p>
                            <p className="text-sm font-bold text-navy-900">{project.client_name}</p>
                          </div>
                        </div>
                      )}
                      {project.location && (
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gold-50 border border-gold-100 shrink-0 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-gold-500" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Location</p>
                            <p className="text-sm font-bold text-navy-900">{project.location}</p>
                          </div>
                        </div>
                      )}
                      {project.completion_date && (
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gold-50 border border-gold-100 shrink-0 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-gold-500" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Completed</p>
                            <p className="text-sm font-bold text-navy-900">{formatDate(project.completion_date)}</p>
                          </div>
                        </div>
                      )}
                      {project.category && (
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gold-50 border border-gold-100 shrink-0 mt-0.5">
                            <Tag className="w-3.5 h-3.5 text-gold-500" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Sector</p>
                            <p className="text-sm font-bold text-navy-900">{project.category.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
