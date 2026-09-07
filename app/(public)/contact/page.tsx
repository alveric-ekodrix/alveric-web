import React from 'react';
import { getCompanySettings } from '@/lib/data/public';
import { ContactForm } from '@/components/forms/ContactForm';
import { MapPin, Phone, Mail, Clock, MessageSquare, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export const revalidate = 60;

export default async function ContactPage() {
  const companySettings = await getCompanySettings();

  const phone1 = companySettings?.phone_primary;
  const phone2 = companySettings?.phone_secondary;
  const whatsapp = companySettings?.whatsapp_number || phone1;
  const email = companySettings?.email;
  const address = companySettings?.address;
  const hours = companySettings?.business_hours;
  const googleMapsUrl = companySettings?.google_maps_url;

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-400">
              GET IN TOUCH
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Contact Alveric Technical Contracting
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Reach out to our project estimators, MEP specialists, or administrative staff for contract inquiries and site inspections.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content & Form */}
      <section className="py-16 bg-slate-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Dynamic Company Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-black text-navy-900 mb-1">Company Information</h2>
                  <p className="text-xs text-slate-500">
                    Connect directly through our official corporate channels.
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  {address && (
                    <div className="flex items-start gap-3 text-slate-700">
                      <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Address</span>
                        <span className="text-xs sm:text-sm font-medium">{address}</span>
                      </div>
                    </div>
                  )}

                  {(phone1 || phone2) && (
                    <div className="flex items-start gap-3 text-slate-700">
                      <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Phone Numbers</span>
                        {phone1 && (
                          <a
                            href={`tel:${phone1.replace(/\s+/g, '')}`}
                            className="block text-xs sm:text-sm font-semibold text-navy-900 hover:text-gold-600 transition"
                          >
                            {phone1}
                          </a>
                        )}
                        {phone2 && (
                          <a
                            href={`tel:${phone2.replace(/\s+/g, '')}`}
                            className="block text-xs sm:text-sm font-semibold text-navy-900 hover:text-gold-600 transition"
                          >
                            {phone2}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {email && (
                    <div className="flex items-start gap-3 text-slate-700">
                      <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Email</span>
                        <a
                          href={`mailto:${email}`}
                          className="text-xs sm:text-sm font-semibold text-navy-900 hover:text-gold-600 transition"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  )}

                  {whatsapp && (
                    <div className="flex items-start gap-3 text-slate-700">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">WhatsApp</span>
                        <a
                          href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-semibold text-emerald-700 hover:underline"
                        >
                          Chat on WhatsApp ({whatsapp})
                        </a>
                      </div>
                    </div>
                  )}

                  {hours && (
                    <div className="flex items-start gap-3 text-slate-700">
                      <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Business Hours</span>
                        <span className="text-xs sm:text-sm font-medium">{hours}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social links */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  {companySettings?.facebook_url && (
                    <a
                      href={companySettings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:text-navy-900 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {companySettings?.linkedin_url && (
                    <a
                      href={companySettings.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:text-navy-900 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {companySettings?.instagram_url && (
                    <a
                      href={companySettings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:text-navy-900 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {companySettings?.youtube_url && (
                    <a
                      href={companySettings.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:text-navy-900 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Contact Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gold-500">
                    ONLINE INQUIRY
                  </span>
                  <h2 className="text-2xl font-black text-navy-900 mt-1">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Fill in the form below and our technical estimators will respond within 24 business hours.
                  </p>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
