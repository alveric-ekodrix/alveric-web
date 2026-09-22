import React from 'react';
import { getCompanySettings } from '@/lib/data/public';
import { ContactForm } from '@/components/forms/ContactForm';
import {
  MapPin, Phone, Mail, Clock,
  Facebook, Instagram, Linkedin, Youtube,
  ArrowRight, MessageCircle,
} from 'lucide-react';

export const revalidate = 60;

const WA_NUMBER = '0569919792';
const WA_INTL = '971569919792';

export default async function ContactPage() {
  const companySettings = await getCompanySettings();

  const phone1 = companySettings?.phone_primary;
  const phone2 = companySettings?.phone_secondary;
  const email = companySettings?.email;
  const address = companySettings?.address;
  const hours = companySettings?.business_hours;

  const contactCards = [
    ...(address ? [{
      icon: MapPin,
      label: 'Our Location',
      value: address,
      href: companySettings?.google_maps_url || undefined,
      color: 'gold',
    }] : []),
    ...((phone1 || phone2) ? [{
      icon: Phone,
      label: 'Call Us Directly',
      value: [phone1, phone2].filter(Boolean).join(' · '),
      href: `tel:${(phone1 || '').replace(/\s+/g, '')}`,
      color: 'gold',
    }] : []),
    ...(email ? [{
      icon: Mail,
      label: 'Email Address',
      value: email,
      href: `mailto:${email}`,
      color: 'gold',
    }] : []),
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: WA_NUMBER,
      href: `https://wa.me/${WA_INTL}?text=${encodeURIComponent("Hello! I'd like to inquire about your technical contracting services.")}`,
      color: 'green',
      external: true,
    },
    ...(hours ? [{
      icon: Clock,
      label: 'Business Hours',
      value: hours,
      color: 'gold',
    }] : []),
  ] as const;

  const hasSocials = companySettings?.facebook_url || companySettings?.linkedin_url ||
    companySettings?.instagram_url || companySettings?.youtube_url;

  return (
    <div className="w-full bg-slate-50">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-navy-950 text-white py-20 lg:py-28">
        {/* Diagonal geometric accent */}
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

        {/* Gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-400">
                Get in Touch
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Contact <span className="text-gold-400">Alveric</span><br />
              Technical Contracting
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Reach out to our project estimators, MEP specialists, or administrative staff
              for contract inquiries, site inspections, and technical consultations.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact Info Cards Row ── */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {contactCards.map((card, i) => {
              const isGreen = card.color === 'green';
              const content = (
                <div
                  key={i}
                  className={`group flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                    isGreen
                      ? 'bg-[#f0fdf4] border-[#bbf7d0] hover:border-[#25D366]/50'
                      : 'bg-white border-slate-200 hover:border-gold-300 hover:bg-gold-50/30'
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
                    isGreen ? 'bg-[#dcfce7]' : 'bg-gold-50 border border-gold-100'
                  }`}>
                    <card.icon className={`w-5 h-5 ${isGreen ? 'text-[#16a34a]' : 'text-gold-500'}`} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                      {card.label}
                    </p>
                    <p className={`text-sm font-bold leading-snug ${isGreen ? 'text-[#15803d]' : 'text-navy-900'}`}>
                      {card.value}
                    </p>
                    {card.href && (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold mt-1.5 ${
                        isGreen ? 'text-[#16a34a]' : 'text-gold-600'
                      }`}>
                        {isGreen ? 'Chat Now' : 'Click to contact'}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </div>
                </div>
              );

              if (card.href) {
                return (
                  <a
                    key={i}
                    href={card.href}
                    target={(card as any).external ? '_blank' : undefined}
                    rel={(card as any).external ? 'noopener noreferrer' : undefined}
                  >
                    {content}
                  </a>
                );
              }
              return <div key={i}>{content}</div>;
            })}
          </div>
        </div>
      </section>

      {/* ── Main Content: Info + Form ── */}
      <section className="py-14 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left: Company info panel */}
            <div className="lg:col-span-5 space-y-6">
              {/* WhatsApp CTA card */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-[#0f1f3d] to-navy-900" />
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#25D366]" />
                <div className="relative z-10 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-xl shadow-lg"
                      style={{ background: '#25D366', boxShadow: '0 6px 20px rgba(37,211,102,0.3)' }}
                    >
                      <MessageCircle className="w-6 h-6 text-white fill-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#4ade80]">Instant Response</p>
                      <h3 className="text-base font-black text-white">Chat on WhatsApp</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Get a quick reply from our technical team — no waiting, direct business communication.
                  </p>
                  <a
                    href={`https://wa.me/${WA_INTL}?text=${encodeURIComponent("Hello! I'd like to inquire about your technical contracting services.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="contact-whatsapp-btn"
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-black text-sm text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: '#25D366', boxShadow: '0 6px 20px rgba(37,211,102,0.25)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.112 1.532 5.836L.057 23.882a.75.75 0 0 0 .918.926l6.188-1.461A11.938 11.938 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.938 9.938 0 0 1-5.134-1.427l-.367-.217-3.807.899.944-3.698-.24-.381A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    <span>Start WhatsApp Chat</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                </div>
              </div>

              {/* Company info card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-xs font-black text-navy-900 uppercase tracking-wider">Company Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  {address && (
                    <div className="flex items-start gap-3.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-50 border border-gold-100 shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
                        <p className="text-sm font-semibold text-navy-900 leading-snug">{address}</p>
                      </div>
                    </div>
                  )}
                  {(phone1 || phone2) && (
                    <div className="flex items-start gap-3.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-50 border border-gold-100 shrink-0 mt-0.5">
                        <Phone className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                        {phone1 && <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="block text-sm font-bold text-navy-900 hover:text-gold-600 transition">{phone1}</a>}
                        {phone2 && <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="block text-sm font-bold text-navy-900 hover:text-gold-600 transition">{phone2}</a>}
                      </div>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-start gap-3.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-50 border border-gold-100 shrink-0 mt-0.5">
                        <Mail className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                        <a href={`mailto:${email}`} className="text-sm font-bold text-navy-900 hover:text-gold-600 transition">{email}</a>
                      </div>
                    </div>
                  )}
                  {hours && (
                    <div className="flex items-start gap-3.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-50 border border-gold-100 shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Business Hours</p>
                        <p className="text-sm font-semibold text-navy-900">{hours}</p>
                      </div>
                    </div>
                  )}
                </div>

                {hasSocials && (
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Follow Us</p>
                    <div className="flex items-center gap-2.5">
                      {companySettings?.facebook_url && (
                        <a href={companySettings.facebook_url} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-navy-900 hover:border-navy-300 transition shadow-sm">
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {companySettings?.linkedin_url && (
                        <a href={companySettings.linkedin_url} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-navy-900 hover:border-navy-300 transition shadow-sm">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {companySettings?.instagram_url && (
                        <a href={companySettings.instagram_url} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-navy-900 hover:border-navy-300 transition shadow-sm">
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {companySettings?.youtube_url && (
                        <a href={companySettings.youtube_url} target="_blank" rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-navy-900 hover:border-navy-300 transition shadow-sm">
                          <Youtube className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-navy-950 to-[#0f1f3d]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gold-400">Online Inquiry</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Send Us a Message</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Our technical estimators will respond within 24 business hours.
                  </p>
                </div>
                <div className="p-8 sm:p-10">
                  <ContactForm />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
