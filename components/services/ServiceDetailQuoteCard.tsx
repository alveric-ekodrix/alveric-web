'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquare, ArrowRight, Calculator } from 'lucide-react';

interface ServiceDetailQuoteCardProps {
  serviceId?: string;
  serviceName: string;
  whatsappNumber?: string | null;
}

export function ServiceDetailQuoteCard({
  serviceId,
  serviceName,
  whatsappNumber,
}: ServiceDetailQuoteCardProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const cleanWhatsapp = whatsappNumber?.replace(/\D/g, '');
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello Alveric Team, I would like to inquire about your ${serviceName} service.\nName: ${name || '-'}\nPhone: ${phone || '-'}\nLocation: ${location || '-'}\nDetails: ${details || '-'}`
      )}`
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Synthesize inquiry email for schema compliance if none provided
      const syntheticEmail = `${phone.trim().replace(/\D/g, '') || 'inquiry'}@quotes.alveric.ae`;

      const { error } = await supabase.from('project_inquiries').insert([
        {
          client_name: name.trim(),
          client_phone: phone.trim(),
          client_email: syntheticEmail,
          location: location.trim() || null,
          service_id: serviceId || null,
          preferred_contact_method: 'phone',
          project_brief: details.trim() || `Inquiry for ${serviceName} via Service Detail Page`,
          status: 'new',
        },
      ]);

      if (error) {
        throw new Error(error.message || 'Failed to submit inquiry.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send your request. Please try WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div id="quote-card" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm scroll-mt-28">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center shrink-0 shadow-xs">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-600 block">
            FAST ESTIMATE
          </span>
          <h3 className="text-lg font-black text-navy-900 tracking-tight">
            Get a Free Quote
          </h3>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-5">
        Share your project details and our engineering estimators will provide a competitive and transparent quote.
      </p>

      {isSuccess ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="text-sm font-bold text-emerald-950">Thank You, {name}!</h4>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your quotation request for <span className="font-semibold">{serviceName}</span> has been received. Our engineering team will contact you shortly.
          </p>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm mt-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp</span>
            </a>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label htmlFor="quote-name" className="sr-only">Your Name</label>
            <input
              id="quote-name"
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-navy-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition"
            />
          </div>

          <div>
            <label htmlFor="quote-phone" className="sr-only">Phone Number</label>
            <input
              id="quote-phone"
              type="tel"
              required
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-navy-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition"
            />
          </div>

          <div>
            <label htmlFor="quote-location" className="sr-only">Project Location</label>
            <input
              id="quote-location"
              type="text"
              placeholder="Project Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-navy-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition"
            />
          </div>

          <div>
            <label htmlFor="quote-details" className="sr-only">Project Details</label>
            <textarea
              id="quote-details"
              rows={3}
              placeholder="Project Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-navy-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs shadow-sm hover:shadow transition flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Inquiry...</span>
              </>
            ) : (
              <>
                <span>Request a Detailed Quote</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400">
              OR
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* WhatsApp Direct Action */}
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg border border-emerald-500/70 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 font-bold text-xs transition flex items-center justify-center gap-2 group shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Chat on WhatsApp</span>
            </a>
          ) : (
            <a
              href="/contact"
              className="w-full py-2.5 px-4 rounded-lg border border-slate-200 hover:border-navy-900 text-navy-900 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>Contact Our Office</span>
            </a>
          )}
        </form>
      )}
    </div>
  );
}
