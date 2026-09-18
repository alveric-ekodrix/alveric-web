import React from 'react';
import Link from 'next/link';
import { getPublishedProjects, getPublishedCategories } from '@/lib/data/public';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const revalidate = 60;

interface ProjectsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { category: activeCategorySlug } = await searchParams;
  const categories = await getPublishedCategories();

  // Find active category ID if category slug provided
  const activeCategory = activeCategorySlug
    ? categories.find((c) => c.slug === activeCategorySlug)
    : null;

  const projects = await getPublishedProjects(activeCategory?.id);

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-400">
              OUR PORTFOLIO
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Contracting & Engineering Projects
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore our track record of engineering accomplishments, commercial installations, luxury residential developments, and infrastructure maintenance.
            </p>
          </div>
        </div>
      </section>

      {/* Projects List & Filters */}
      <section className="py-14 bg-slate-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Pills (Dynamically loaded from Supabase) */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200">
              <Link
                href="/projects"
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm',
                  !activeCategorySlug
                    ? 'bg-navy-900 text-white shadow'
                    : 'bg-white text-navy-900 border border-slate-200 hover:bg-slate-100'
                )}
              >
                All Projects
              </Link>
              {categories.map((cat) => {
                const isActive = activeCategorySlug === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/projects?category=${cat.slug}`}
                    className={cn(
                      'px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm',
                      isActive
                        ? 'bg-navy-900 text-white shadow'
                        : 'bg-white text-navy-900 border border-slate-200 hover:bg-slate-100'
                    )}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Projects Grid or Empty State */}
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-1">
                No projects available at the moment.
              </h3>
              <p className="text-xs text-slate-500">
                {activeCategory
                  ? `No published projects found under the "${activeCategory.name}" category.`
                  : 'Portfolio projects are managed through the admin dashboard.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
                    <CldImageWrapper
                      src={project.thumbnail_media?.secure_url || project.featured_image?.secure_url}
                      alt={project.title}
                      fill
                      fallbackText="Project image pending upload"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {project.category && (
                      <div className="absolute top-3 left-3 bg-navy-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                        {project.category.name}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-base font-black text-navy-900 group-hover:text-gold-600 transition-colors line-clamp-1 mb-2">
                      {project.title}
                    </h2>
                    {project.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                      {project.short_description || 'Technical contracting project delivered with precision and high-grade materials.'}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-navy-900 group-hover:text-gold-600 transition">
                      <span>View Project Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
