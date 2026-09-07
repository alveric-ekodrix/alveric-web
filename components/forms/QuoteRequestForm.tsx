'use client';

import React, { useState } from 'react';
import { Service, ProjectCategory } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { projectInquirySchema } from '@/lib/validations';
import { CheckCircle2, AlertCircle, Loader2, Send, MessageSquare } from 'lucide-react';

interface QuoteRequestFormProps {
  services: Service[];
  categories: ProjectCategory[];
  defaultServiceId?: string;
  defaultCategoryId?: string;
  whatsappNumber?: string | null;
}

export function QuoteRequestForm({
  services,
  categories,
  defaultServiceId = '',
  defaultCategoryId = '',
  whatsappNumber,
}: QuoteRequestFormProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [serviceId, setServiceId] = useState(defaultServiceId);
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [location, setLocation] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone' | 'whatsapp'>('email');
  const [brief, setBrief] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const budgetOptions = [
    'Under $10,000 / AED 35,000',
    '$10,000 - $50,000 / AED 35,000 - 180,000',
    '$50,000 - $150,000 / AED 180,000 - 550,000',
    '$150,000+ / AED 550,000+',
    'To be determined upon technical assessment',
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      client_name: name.trim(),
      company_name: company.trim() || undefined,
      client_email: email.trim().toLowerCase(),
      client_phone: phone.trim(),
      whatsapp: whatsapp.trim() || undefined,
      service_id: serviceId || null,
      category_id: categoryId || null,
      location: location.trim() || undefined,
      budget_range: budgetRange || undefined,
      preferred_contact_method: contactMethod,
      project_brief: brief.trim(),
    };

    const parseResult = projectInquirySchema.safeParse(payload);
    if (!parseResult.success) {
      setErrorMessage(parseResult.error.errors[0]?.message || 'Please check your form entries');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('project_inquiries').insert([
        {
          client_name: payload.client_name,
          company_name: payload.company_name || null,
          client_email: payload.client_email,
          client_phone: payload.client_phone,
          whatsapp: payload.whatsapp || null,
          service_id: payload.service_id,
          category_id: payload.category_id,
          location: payload.location || null,
          budget_range: payload.budget_range || null,
          preferred_contact_method: payload.preferred_contact_method,
          project_brief: payload.project_brief,
          status: 'new',
        },
      ]);

      if (error) {
        throw new Error(error.message || 'Failed to submit quote inquiry');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit quotation inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const whatsappDirectUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hello Alveric Team, I have just submitted a quote request under the name of ${name || 'a client'}.`
      )}`
    : null;

  if (isSuccess) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-emerald-900">Quote Request Submitted</h3>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
          Thank you for choosing Alveric Technical Contracting LLC. Your technical brief has been assigned to a senior estimator who will prepare a comprehensive proposal.
        </p>

        {whatsappDirectUrl && (
          <div className="pt-4">
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition shadow"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Speed up review: Chat on WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Name & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Full Name <span className="text-gold-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Company / Organization
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Landmark Real Estate Development"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Email Address <span className="text-gold-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. client@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Phone Number <span className="text-gold-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +971 50 123 4567"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Row 3: Service & Project Category Dropdowns (from Supabase) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Primary Service Required
          </label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          >
            <option value="">Select a Service (Optional)</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Project Sector / Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          >
            <option value="">Select Category (Optional)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Location & Budget Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Site Location / City
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Dubai, Abu Dhabi, Doha, etc."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1.5">
            Estimated Budget Range
          </label>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          >
            <option value="">Select Budget Range (Optional)</option>
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 5: Preferred Contact Method */}
      <div>
        <label className="block text-xs font-bold text-navy-900 mb-2">
          Preferred Contact Method
        </label>
        <div className="flex items-center gap-6 text-xs text-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="contactMethod"
              value="email"
              checked={contactMethod === 'email'}
              onChange={() => setContactMethod('email')}
              className="text-navy-900 focus:ring-gold-500"
            />
            <span>Email</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="contactMethod"
              value="phone"
              checked={contactMethod === 'phone'}
              onChange={() => setContactMethod('phone')}
              className="text-navy-900 focus:ring-gold-500"
            />
            <span>Phone Call</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="contactMethod"
              value="whatsapp"
              checked={contactMethod === 'whatsapp'}
              onChange={() => setContactMethod('whatsapp')}
              className="text-navy-900 focus:ring-gold-500"
            />
            <span>WhatsApp</span>
          </label>
        </div>
      </div>

      {/* Row 6: Project Brief */}
      <div>
        <label className="block text-xs font-bold text-navy-900 mb-1.5">
          Project Brief / Scope Details <span className="text-gold-500">*</span>
        </label>
        <textarea
          rows={5}
          required
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Please describe the scope of work, timeline constraints, drawing availability, and site conditions..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-xl bg-gold-500 text-navy-950 font-black text-sm tracking-wide uppercase hover:bg-gold-400 disabled:opacity-50 transition shadow-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-navy-950" />
            <span>Processing Proposal Request...</span>
          </>
        ) : (
          <>
            <span>Request a Free Quote</span>
            <Send className="w-4 h-4 stroke-[2.5]" />
          </>
        )}
      </button>
    </form>
  );
}
