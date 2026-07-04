'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Wallet,
  Settings,
  ChevronRight,
  Users,
} from 'lucide-react';

/* ─── Nav items ─────────────────────────────────────────────── */
const navItems = [
  { label: 'Dashboard',  href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Pesanan',    href: '/admin/pesanan',   icon: ShoppingBag },
  { label: 'Bahan',      href: '/admin/bahan',     icon: Package },
  { label: 'Pelanggan',  href: '/admin/pelanggan', icon: Users },
  { label: 'Keuangan',   href: '/admin/keuangan',  icon: Wallet },
] as const;

/* ─── Sidebar ───────────────────────────────────────────────── */
export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-[240px] flex flex-col z-50"
      style={{ backgroundColor: '#141415' }}
      aria-label="Navigasi admin"
    >
      {/* ── Wordmark ────────────────────────────────────── */}
      <div
        className="h-[48px] flex items-center px-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <span
          className="text-[15px] font-medium text-white tracking-tight select-none"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          blackant
          <span
            className="ml-1.5 text-[11px] font-normal px-1.5 py-0.5 rounded-[4px]"
            style={{
              color: '#83c3ff',
              backgroundColor: 'rgba(131,195,255,0.12)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            admin
          </span>
        </span>
      </div>

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu utama">
        <p
          className="px-2 mb-2 text-[11px] font-medium uppercase tracking-[0.08em]"
          style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Menu
        </p>

        <ul className="flex flex-col gap-0.5" role="list">
          {navItems.map(({ label, href, icon: Icon }) => {
            // Active jika pathname cocok atau sub-route
            const isActive =
              pathname === href ||
              (href !== '/admin/dashboard' && pathname.startsWith(href));

            return (
              <li key={href} role="listitem">
                <Link
                  href={href}
                  className="group relative flex items-center gap-3 px-3 py-2 rounded-[4px] transition-colors duration-100"
                  style={{
                    backgroundColor: isActive ? '#3c3d40' : 'transparent',
                    color: isActive ? '#ffffff' : '#acadae',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(60,61,64,0.5)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#acadae';
                    }
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Active: left accent bar (Ice Signal) */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-[2px]"
                      style={{ backgroundColor: '#83c3ff' }}
                      aria-hidden="true"
                    />
                  )}

                  <Icon
                    size={16}
                    strokeWidth={isActive ? 2 : 1.5}
                    style={{ color: isActive ? '#83c3ff' : 'currentColor' }}
                    aria-hidden="true"
                  />

                  <span className="text-[14px] font-normal flex-1">{label}</span>

                  {/* Chevron — hanya saat hover, non-active */}
                  {!isActive && (
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-40 transition-opacity"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom: Settings ────────────────────────────── */}
      <div
        className="px-3 py-4 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-[4px] transition-colors duration-100"
          style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(60,61,64,0.5)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#acadae';
          }}
        >
          <Settings size={16} strokeWidth={1.5} aria-hidden="true" />
          <span className="text-[14px] font-normal">Pengaturan</span>
        </Link>

        {/* Studio branding */}
        <div className="mt-4 px-3 flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-[4px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#3c3d40' }}
          >
            <span
              className="text-[10px] font-bold text-white"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              B
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-[12px] font-medium text-white truncate leading-none"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Blackant Studio
            </span>
            <span
              className="text-[11px] leading-none mt-0.5"
              style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              admin
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
