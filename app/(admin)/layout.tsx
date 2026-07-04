/**
 * app/(admin)/layout.tsx
 *
 * Layout khusus route group admin.
 * Mengimport admin.css yang me-reset body ke dark terminal palette.
 * Route group (admin) tidak mempengaruhi URL — halaman di dalamnya
 * tetap accessible di /admin/... tanpa prefix (admin) di URL.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './admin.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-ui',
});

export const metadata: Metadata = {
  title: {
    default: 'Admin — Blackant Studio',
    template: '%s | Admin Blackant',
  },
  description: 'Panel administrasi Blackant Studio',
  robots: {
    index: false,   // Jangan diindex oleh search engine
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} min-h-screen bg-void text-paper-white font-ui antialiased`}>
      {children}
    </div>
  );
}
