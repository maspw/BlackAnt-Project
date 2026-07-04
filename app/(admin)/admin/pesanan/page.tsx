/**
 * app/(admin)/admin/pesanan/page.tsx
 * Route: /admin/pesanan — Server Component
 *
 * Fetch orders dari Supabase berdasarkan filter URL param,
 * lalu render PesananClient (Client Component) untuk interaksi.
 */
import { Suspense } from 'react';
import type { Metadata } from 'next';
import AddOrderButton from './AddOrderButton';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { OrderSummary, OrderStatus } from '@/types/database';
import PesananClient from './PesananClient';

export const metadata: Metadata = { title: 'Pesanan' };

/* ─── Mapping filter → status array ─────────────────────────── */
const FILTER_STATUS_MAP: Record<string, OrderStatus[]> = {
  pending:  ['pending'],
  process:  ['confirmed', 'process', 'qc', 'shipping'],
  finish:   ['finish'],
  cancelled:['cancelled'],
};

/* ─── Data fetching ──────────────────────────────────────────── */
async function getOrders(filter: string): Promise<OrderSummary[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('orders')
    .select(
      'id, order_number, customer_name, customer_phone, product_type, quantity, total_price, dp_amount, status, deadline_date, created_at',
    )
    .order('created_at', { ascending: false });

  const statuses = FILTER_STATUS_MAP[filter];
  if (statuses) {
    query = query.in('status', statuses);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[pesanan] Supabase error:', error.message);
    return [];
  }

  return (data ?? []) as OrderSummary[];
}

/* ─── Count badge per filter ─────────────────────────────────── */
async function getStatusCounts(): Promise<Record<string, number>> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('orders')
    .select('status');

  if (!data) return {};

  return data.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    acc['all'] = (acc['all'] ?? 0) + 1;
    return acc;
  }, {});
}

/* ══════════════════════════════════════════════════════════════
   Page
══════════════════════════════════════════════════════════════ */
interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function PesananPage({ searchParams }: PageProps) {
  const { filter: rawFilter } = await searchParams;
  const activeFilter = rawFilter ?? 'all';

  const [orders, counts] = await Promise.all([
    getOrders(activeFilter),
    getStatusCounts(),
  ]);

  const FONT_UI   = 'Inter, system-ui, sans-serif';
  const FONT_MONO = "'JetBrains Mono', monospace";

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">

      {/* ── Page header ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p
            className="text-[12px] uppercase tracking-widest mb-1"
            style={{ color: '#acadae', fontFamily: FONT_UI }}
          >
            Admin
          </p>
          <h2
            className="text-[24px] font-medium text-white leading-none"
            style={{ fontFamily: FONT_UI }}
          >
            Manajemen Pesanan
          </h2>
        </div>

        {/* Tombol Tambah Order — outlined Ice Signal */}
        <AddOrderButton />
      </div>

      {/* ── Summary strip ───────────────────────────── */}
      <div className="flex items-center gap-6 flex-wrap">
        {[
          { label: 'Total',   value: counts['all']       ?? 0, color: '#acadae' },
          { label: 'Pending', value: counts['pending']   ?? 0, color: '#f87171' },
          { label: 'Proses',  value: (counts['process'] ?? 0) + (counts['confirmed'] ?? 0) + (counts['qc'] ?? 0) + (counts['shipping'] ?? 0), color: '#83c3ff' },
          { label: 'Selesai', value: counts['finish']    ?? 0, color: '#34d399' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-baseline gap-1.5">
            <span
              className="text-[22px] font-medium leading-none"
              style={{ color, fontFamily: FONT_MONO }}
            >
              {value}
            </span>
            <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

      {/* ── Client Component (tabs + table + modal) ── */}
      <Suspense fallback={
        <div className="h-48 rounded-[8px] animate-pulse" style={{ backgroundColor: '#1b1d1f' }} />
      }>
        <PesananClient orders={orders} activeFilter={activeFilter} />
      </Suspense>

    </div>
  );
}
