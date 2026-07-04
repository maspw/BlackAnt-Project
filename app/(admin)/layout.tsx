/**
 * app/(admin)/layout.tsx
 *
 * Shell layout dua panel untuk semua route admin.
 * Struktur:
 *   ┌──────────────────────────────────────────────┐
 *   │ Sidebar (240px, fixed)  │ Content area        │
 *   │ bg: Obsidian #141415    │ bg: Charcoal #1b1d1f│
 *   │                         │                     │
 *   │  [Wordmark]             │  [Header 48px]      │
 *   │  [Nav items]            │  [children]         │
 *   │  [Settings / Avatar]    │                     │
 *   └──────────────────────────────────────────────┘
 *
 * Tidak ada drop shadow — semua pembatas pakai:
 *   border: 1px solid rgba(255,255,255,0.08)
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
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
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} min-h-screen antialiased`}
      style={{
        backgroundColor: '#080809',   /* Void — outer shell */
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────── */}
      <AdminSidebar />

      {/* ── Content shell — offset oleh sidebar 240px ─── */}
      <div
        className="flex flex-col min-h-screen"
        style={{ marginLeft: '240px' }}
      >
        {/* Top header */}
        <AdminHeader />

        {/* Scrollable content area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: '#1b1d1f' }}
          id="admin-main-content"
        >
          {/* Inner padding — 32px seperti desain spec */}
          <div className="p-8">
            {children}
          </div>
        </main>

        {/* ── Footer bar ──────────────────────────────── */}
        <footer
          className="h-[40px] flex items-center justify-between px-6 shrink-0"
          style={{
            backgroundColor: '#141415',   /* Obsidian */
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            {['Tentang', 'Bantuan', 'Kebijakan'].map((item) => (
              <span
                key={item}
                className="text-[12px] cursor-default"
                style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {item}
              </span>
            ))}
          </div>
          <span
            className="text-[12px]"
            style={{
              color: '#acadae',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            © {new Date().getFullYear()} Blackant Studio
          </span>
        </footer>
      </div>
    </div>
  );
}
