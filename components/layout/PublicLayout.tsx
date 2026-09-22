import React from 'react';
import { getCompanySettings, getPublishedServices } from '@/lib/data/public';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// WhatsApp floating button config
const WA_NUMBER = '971569919792';
const WA_TEXT = encodeURIComponent(
  "Hello! I'm interested in Alveric Technical Contracting services and would like to know more. 👋"
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`;


export async function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [companySettings, services] = await Promise.all([
    getCompanySettings(),
    getPublishedServices(),
  ]);

  return (
    <>
      <Header companySettings={companySettings} services={services} />
      <main className="flex-1 pt-20 sm:pt-24">{children}</main>
      <Footer companySettings={companySettings} services={services} />

      {/* ── Floating WhatsApp Button ── */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-float-btn"
        aria-label="Chat with us on WhatsApp"
        className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
      >
        {/* Tooltip label — slides in on hover */}
        <span
          className="hidden sm:block opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 ease-out pointer-events-none whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-lg"
          style={{ background: '#128C7E' }}
        >
          Chat with us
        </span>

        {/* Button circle */}
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform duration-300 group-hover:scale-110" style={{ background: '#25D366' }}>
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: '#25D366' }}
          />
          {/* WhatsApp SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-7 h-7 fill-white relative z-10"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.112 1.532 5.836L.057 23.882a.75.75 0 0 0 .918.926l6.188-1.461A11.938 11.938 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.938 9.938 0 0 1-5.134-1.427l-.367-.217-3.807.899.944-3.698-.24-.381A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
        </span>
      </a>
    </>
  );
}

