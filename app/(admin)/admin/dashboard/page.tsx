import type { Metadata } from 'next';
import { ShoppingBag, Package, Wallet, TrendingUp } from 'lucide-react';
import { formatRupiah } from '@/lib/utils-admin';

export const metadata: Metadata = {
  title: 'Dashboard',
};

/* ─── Stat cards placeholder ─────────────────────────────────── */
const stats = [
  {
    label: 'Total Pesanan',
    value: '—',
    sub: 'dari Supabase',
    icon: ShoppingBag,
    accent: '#83c3ff',
  },
  {
    label: 'Pesanan Aktif',
    value: '—',
    sub: 'process + qc + shipping',
    icon: TrendingUp,
    accent: '#34d399',
  },
  {
    label: 'Bahan Baku',
    value: '—',
    sub: 'item terdaftar',
    icon: Package,
    accent: '#fbbf24',
  },
  {
    label: 'Pemasukan Bulan Ini',
    value: formatRupiah(null),
    sub: 'income — journal',
    icon: Wallet,
    accent: '#83c3ff',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">

      {/* ── Greeting ─────────────────────────────────── */}
      <div>
        <p
          className="text-[13px] uppercase tracking-widest mb-1"
          style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Selamat datang
        </p>
        <h2
          className="text-[32px] font-medium text-white leading-[1.25]"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Dashboard
        </h2>
      </div>

      {/* ── Stat cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map(({ label, value, sub, icon: Icon, accent }) => (
          <div
            key={label}
            className="flex flex-col gap-3 p-4 rounded-[8px]"
            style={{
              backgroundColor: '#26272d',
              boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset',
            }}
          >
            {/* Icon + label */}
            <div className="flex items-center justify-between">
              <span
                className="text-[12px] font-medium uppercase tracking-[0.06em]"
                style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {label}
              </span>
              <div
                className="w-7 h-7 rounded-[4px] flex items-center justify-center"
                style={{ backgroundColor: `${accent}18` }}
              >
                <Icon size={14} style={{ color: accent }} strokeWidth={1.5} aria-hidden="true" />
              </div>
            </div>

            {/* Value */}
            <p
              className="text-[28px] font-medium leading-none"
              style={{
                color: '#ffffff',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {value}
            </p>

            {/* Sub */}
            <p
              className="text-[12px] leading-none"
              style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Design token preview ──────────────────────── */}
      <div
        className="p-4 rounded-[8px]"
        style={{
          backgroundColor: '#26272d',
          boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset',
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest mb-4"
          style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Palette — OpenSea Dark Terminal
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'ice-signal',  hex: '#83c3ff' },
            { name: 'paper-white', hex: '#ffffff' },
            { name: 'fog',         hex: '#acadae' },
            { name: 'iron',        hex: '#34353c' },
            { name: 'slate',       hex: '#3c3d40' },
            { name: 'graphite',    hex: '#26272d' },
            { name: 'charcoal',    hex: '#1b1d1f' },
            { name: 'obsidian',    hex: '#141415' },
            { name: 'void',        hex: '#080809' },
          ].map(({ name, hex }) => (
            <div
              key={name}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-[4px]"
              style={{
                backgroundColor: '#1b1d1f',
                boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset',
              }}
            >
              <div
                className="w-3 h-3 rounded-[2px] shrink-0"
                style={{
                  backgroundColor: hex,
                  boxShadow: 'rgba(255,255,255,0.15) 0px 0px 0px 1px inset',
                }}
              />
              <span
                className="text-[11px]"
                style={{
                  color: '#acadae',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {hex}
              </span>
              <span
                className="text-[11px] text-white"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
