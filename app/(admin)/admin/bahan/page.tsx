/**
 * app/(admin)/admin/bahan/page.tsx
 * Route: /admin/bahan — Server Component
 */
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Material } from '@/types/database';
import BahanClient from './BahanClient';

export const metadata: Metadata = { title: 'Bahan Baku' };

const FONT_UI   = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', monospace";

async function getMaterials(): Promise<Material[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('[bahan] Supabase error:', error.message);
    return [];
  }
  return (data ?? []) as Material[];
}

export default async function BahanPage() {
  const materials = await getMaterials();

  // Hitung summary
  const totalItems = materials.length;
  const totalNilai = materials.reduce(
    (sum, m) => sum + m.stock * (m.unit_cost ?? 0), 0,
  );
  const amanCount   = materials.filter((m) => m.stock > 0 && (m.min_stock == null || m.stock >= m.min_stock)).length;
  const menipisCount= materials.filter((m) => m.stock > 0 && m.min_stock != null && m.stock < m.min_stock).length;
  const habisCount  = materials.filter((m) => m.stock === 0).length;

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">

      {/* ── Page header ──────────────────────────────── */}
      <div>
        <p className="text-[12px] uppercase tracking-widest mb-1" style={{ color: '#acadae', fontFamily: FONT_UI }}>
          Inventori
        </p>
        <h2 className="text-[24px] font-medium text-white leading-none" style={{ fontFamily: FONT_UI }}>
          Manajemen Bahan
        </h2>
      </div>

      {/* ── Summary strip ────────────────────────────── */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-[8px] overflow-hidden"
        style={{ backgroundColor: '#34353c' }}
      >
        {[
          { label: 'Total Item',    value: totalItems,                         mono: true,  color: '#ffffff' },
          { label: 'Nilai Stok',    value: `Rp ${(totalNilai/1_000_000).toFixed(1)}Jt`, mono: true, color: '#83c3ff' },
          { label: 'Stok Menipis',  value: menipisCount,                       mono: true,  color: menipisCount > 0 ? '#fbbf24' : '#acadae' },
          { label: 'Stok Habis',    value: habisCount,                         mono: true,  color: habisCount   > 0 ? '#f87171' : '#acadae' },
        ].map(({ label, value, mono, color }) => (
          <div
            key={label}
            className="flex flex-col gap-1 px-5 py-4"
            style={{ backgroundColor: '#1b1d1f' }}
          >
            <span className="text-[11px] uppercase tracking-widest" style={{ color: '#acadae', fontFamily: FONT_UI }}>
              {label}
            </span>
            <span
              className="text-[22px] font-medium leading-none"
              style={{ color, fontFamily: mono ? FONT_MONO : FONT_UI }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

      {/* ── Client Component (alert, table, dialogs) ── */}
      <BahanClient materials={materials} />

    </div>
  );
}
