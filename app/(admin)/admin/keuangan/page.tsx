/**
 * app/(admin)/admin/keuangan/page.tsx
 * Route: /admin/keuangan — Server Component
 */
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { JournalEntry } from '@/types/database';
import KeuanganClient from './KeuanganClient';

export const metadata: Metadata = { title: 'Keuangan' };

const FONT_UI   = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', monospace";

/* ══════════════════════════════════════════════════════════════
   Date range helper
══════════════════════════════════════════════════════════════ */
type DateRange = { from: string; to: string } | null;

function getPeriodRange(period: string): DateRange {
  const now = new Date();
  const pad  = (n: number) => String(n).padStart(2, '0');
  const ymd  = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  switch (period) {
    case 'this_month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to   = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { from: ymd(from), to: ymd(to) };
    }
    case 'last_month': {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to   = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from: ymd(from), to: ymd(to) };
    }
    case 'this_year': {
      return { from: `${now.getFullYear()}-01-01`, to: `${now.getFullYear()}-12-31` };
    }
    default:
      return null;  // 'all' — tanpa filter tanggal
  }
}

/* ══════════════════════════════════════════════════════════════
   Data fetching
══════════════════════════════════════════════════════════════ */
async function getJournalEntries(period: string): Promise<JournalEntry[]> {
  const supabase = createServerSupabaseClient();
  const range    = getPeriodRange(period);

  let query = supabase
    .from('journal_entries')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (range) {
    query = query.gte('date', range.from).lte('date', range.to);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[keuangan] Supabase error:', error.message);
    return [];
  }

  return (data ?? []) as JournalEntry[];
}

/* ══════════════════════════════════════════════════════════════
   Page
══════════════════════════════════════════════════════════════ */
interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function KeuanganPage({ searchParams }: PageProps) {
  const { period: rawPeriod } = await searchParams;
  const activePeriod = rawPeriod ?? 'this_month';

  const entries = await getJournalEntries(activePeriod);

  // Hitung summary dari entries yang sudah difilter
  const pemasukan   = entries.filter(e => e.type === 'income' ).reduce((s, e) => s + e.amount, 0);
  const pengeluaran = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const saldo       = pemasukan - pengeluaran;

  // Label periode untuk heading
  const periodeLabel: Record<string, string> = {
    this_month: 'Bulan Ini',
    last_month: 'Bulan Lalu',
    this_year:  'Tahun Ini',
    all:        'Semua Waktu',
  };

  // Distribusi kategori (top 5)
  const accountMap: Record<string, number> = {};
  entries.forEach((e) => {
    const key = e.account ?? 'Lainnya';
    accountMap[key] = (accountMap[key] ?? 0) + e.amount;
  });
  const topAccounts = Object.entries(accountMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">

      {/* ── Page header ──────────────────────────────── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-widest mb-1" style={{ color: '#acadae', fontFamily: FONT_UI }}>
            {periodeLabel[activePeriod] ?? 'Keuangan'}
          </p>
          <h2 className="text-[24px] font-medium text-white leading-none" style={{ fontFamily: FONT_UI }}>
            Laporan Keuangan
          </h2>
        </div>

        {/* Saldo bersih di header */}
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#acadae', fontFamily: FONT_UI }}>
            Saldo Bersih
          </p>
          <p
            className="text-[20px] font-medium leading-none"
            style={{ color: saldo >= 0 ? '#83c3ff' : '#f87171', fontFamily: FONT_MONO }}
          >
            {saldo < 0 ? '−' : '+'}
            {new Intl.NumberFormat('id-ID').format(Math.abs(saldo))}
          </p>
        </div>
      </div>

      {/* ── Top accounts mini strip ──────────────────── */}
      {topAccounts.length > 0 && (
        <div
          className="flex items-start gap-3 p-4 rounded-[8px] flex-wrap"
          style={{
            backgroundColor: '#141415',
            boxShadow: 'rgba(255,255,255,0.06) 0 0 0 1px inset',
          }}
        >
          <span className="text-[11px] uppercase tracking-widest self-center" style={{ color: '#acadae', fontFamily: FONT_UI }}>
            Top Kategori
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {topAccounts.map(([account, total]) => (
              <div
                key={account}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px]"
                style={{
                  backgroundColor: '#26272d',
                  boxShadow: 'rgba(255,255,255,0.06) 0 0 0 1px inset',
                }}
              >
                <span className="text-[12px] text-white" style={{ fontFamily: FONT_UI }}>{account}</span>
                <span className="text-[11px]" style={{ color: '#acadae', fontFamily: FONT_MONO }}>
                  {new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

      {/* ── Client Component ──────────────────────────── */}
      <KeuanganClient
        entries={entries}
        activePeriod={activePeriod}
        pemasukan={pemasukan}
        pengeluaran={pengeluaran}
      />

    </div>
  );
}
