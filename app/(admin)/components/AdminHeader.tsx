'use client';

import { usePathname } from 'next/navigation';
import NotificationBell from '@/components/admin/NotificationBell';

/* ─── Page title map ─────────────────────────────────────────── */
const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/pesanan':   'Pesanan',
  '/admin/bahan':     'Bahan Baku',
  '/admin/keuangan':  'Keuangan',
  '/admin/settings':  'Pengaturan',
};

function getPageTitle(pathname: string): string {
  // Exact match dulu
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Prefix match (misal /admin/pesanan/detail/abc)
  const match = Object.keys(PAGE_TITLES).find((key) => pathname.startsWith(key));
  return match ? PAGE_TITLES[match] : 'Admin';
}

/* ─── Header ────────────────────────────────────────────────── */
export default function AdminHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header
      className="h-[48px] flex items-center justify-between px-6 shrink-0"
      style={{
        backgroundColor: '#1b1d1f',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Judul halaman */}
      <h1
        className="text-[16px] font-medium text-white leading-none"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {title}
      </h1>

      {/* Kanan: actions */}
      <div className="flex items-center gap-2">
        <NotificationBell />

        {/* Divider */}
        <div
          className="w-px h-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          aria-hidden="true"
        />

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-[4px] flex items-center justify-center text-[11px] font-bold text-white select-none"
            style={{
              backgroundColor: '#3c3d40',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
            aria-label="Profil admin"
          >
            A
          </div>
          <span
            className="text-[13px] font-normal hidden sm:block"
            style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
