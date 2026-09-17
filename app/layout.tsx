import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ALVERIC TECHNICAL CONTRACTING LLC | Building Solutions. Delivering Excellence.',
  description:
    'Alveric Technical Contracting LLC delivers expert engineering and technical contracting solutions with an uncompromising commitment to quality, safety, and excellence across commercial, residential, and industrial infrastructure.',
  keywords: [
    'Technical Contracting',
    'MEP Contracting',
    'Building Maintenance',
    'Electrical Fitting Contracting',
    'HVAC Installation',
    'Painting Contracting',
    'Plumbing & Sanitary',
    'Carpentry & Flooring',
    'Alveric Technical Contracting',
  ],
  authors: [{ name: 'Alveric Technical Contracting LLC' }],
  openGraph: {
    title: 'ALVERIC TECHNICAL CONTRACTING LLC',
    description: 'Building Solutions. Delivering Excellence.',
    siteName: 'Alveric Technical Contracting LLC',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col antialiased text-navy-900 bg-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
