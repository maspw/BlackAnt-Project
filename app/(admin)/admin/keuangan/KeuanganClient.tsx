'use client';

import { useState, useEffect, useActionState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  PlusCircle, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, BookOpen,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import type { JournalEntry } from '@/types/database';
import { formatRupiah, formatTanggalIndo } from '@/lib/utils-admin';
import { addJournalEntry, type ActionState } from '@/actions/journal';

/* ══════════════════════════════════════════════════════════════
   Constants
══════════════════════════════════════════════════════════════ */
const FONT_UI   = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

const PERIOD_TABS = [
  { label: 'Bulan Ini',  value: 'this_month'  },
  { label: 'Bulan Lalu', value: 'last_month'  },
  { label: 'Tahun Ini',  value: 'this_year'   },
  { label: 'Semua',      value: 'all'          },
] as const;

const ACCOUNT_PRESETS = [
  'Penjualan', 'Bahan Baku', 'Restock', 'Sewa Tempat', 'Listrik & Air',
  'Transportasi', 'Marketing', 'Gaji', 'Peralatan', 'Lainnya',
];

/* ══════════════════════════════════════════════════════════════
   Helpers
══════════════════════════════════════════════════════════════ */
function Feedback({ state }: { state: ActionState }) {
  if (state.status === 'idle') return null;
  const ok = state.status === 'success';
  return (
    <div
      className="flex items-start gap-2 p-3 rounded-[4px] text-[12px]"
      style={{
        backgroundColor: ok ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
        border: `1px solid ${ok ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
        color: ok ? '#34d399' : '#f87171',
        fontFamily: FONT_UI,
      }}
    >
      {ok ? <CheckCircle2 size={13} className="shrink-0 mt-0.5" /> : <AlertCircle size={13} className="shrink-0 mt-0.5" />}
      {state.message}
    </div>
  );
}

function DarkInput({ id, name, label, type = 'text', required, placeholder, defaultValue, min, max, step, hint }: {
  id: string; name: string; label: string; type?: string; required?: boolean;
  placeholder?: string; defaultValue?: string | number; min?: string; max?: string; step?: string; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      <input
        id={id} name={name} type={type} required={required}
        placeholder={placeholder} defaultValue={defaultValue} min={min} max={max} step={step}
        className="w-full h-9 px-3 text-[13px] outline-none"
        style={{
          backgroundColor: '#0d0d0e', color: '#ffffff',
          border: '1px solid #34353c', borderRadius: '4px',
          fontFamily: type === 'number' ? FONT_MONO : FONT_UI,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
      />
      {hint && <p className="text-[11px]" style={{ color: '#3c3d40', fontFamily: FONT_UI }}>{hint}</p>}
    </div>
  );
}

function SubmitBtn({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all duration-150"
      style={{ border: '1px solid #83c3ff', color: '#ffffff', backgroundColor: 'transparent', fontFamily: FONT_UI }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#83c3ff'; e.currentTarget.style.color = '#080809'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
    >
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   Catat Manual Dialog
══════════════════════════════════════════════════════════════ */
function CatatManualDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [state, formAction] = useActionState(addJournalEntry, { status: 'idle' });
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    if (state.status === 'success') {
      const t = setTimeout(() => { onOpenChange(false); setType('expense'); }, 1500);
      return () => clearTimeout(t);
    }
  }, [state.status, onOpenChange]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 border-0 max-w-md overflow-hidden"
        style={{
          backgroundColor: '#1b1d1f',
          boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset, 0 24px 64px rgba(0,0,0,0.6)',
          borderRadius: '8px',
        }}
      >
        {/* Header */}
        <DialogHeader
          className="px-5 h-[48px] flex-row items-center gap-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <BookOpen size={14} style={{ color: '#83c3ff' }} />
          <DialogTitle className="text-[14px] font-medium text-white m-0" style={{ fontFamily: FONT_UI }}>
            Catat Transaksi Manual
          </DialogTitle>
          <DialogDescription className="sr-only">Form input transaksi non-order</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4 px-5 pb-5 pt-4">
          {/* Tipe — toggle pills */}
          <div>
            <p className="text-[12px] mb-2" style={{ color: '#acadae', fontFamily: FONT_UI }}>
              Jenis <span style={{ color: '#f87171' }}>*</span>
            </p>
            <div className="flex gap-2">
              {(['income', 'expense'] as const).map((t) => {
                const isActive = type === t;
                const hex = t === 'income' ? '#34d399' : '#f87171';
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className="flex-1 h-9 flex items-center justify-center gap-2 rounded-[4px] text-[13px] font-medium transition-all"
                    style={{
                      border: `1px solid ${isActive ? hex : '#34353c'}`,
                      backgroundColor: isActive ? hex + '18' : 'transparent',
                      color: isActive ? hex : '#acadae',
                      fontFamily: FONT_UI,
                    }}
                  >
                    {t === 'income'
                      ? <TrendingUp size={13} strokeWidth={2} />
                      : <TrendingDown size={13} strokeWidth={2} />}
                    {t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="type" value={type} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DarkInput id="date" name="date" label="Tanggal" type="date" required defaultValue={today} max={today} />
            <DarkInput id="amount" name="amount" label="Jumlah (IDR)" type="number" required min="1" step="1000" placeholder="150000" />
          </div>

          <DarkInput id="description" name="description" label="Keterangan" required placeholder="Beli sablon, bayar listrik, dll." />

          {/* Account/Kategori — datalist */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="account" className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
              Kategori
            </label>
            <input
              id="account" name="account" list="account-presets"
              placeholder="Pilih atau ketik kategori"
              className="w-full h-9 px-3 text-[13px] outline-none"
              style={{
                backgroundColor: '#0d0d0e', color: '#ffffff',
                border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
            />
            <datalist id="account-presets">
              {ACCOUNT_PRESETS.map((a) => <option key={a} value={a} />)}
            </datalist>
          </div>

          <DarkInput id="notes" name="notes" label="Catatan (opsional)" placeholder="Detail tambahan..." />

          <Feedback state={state} />
          <SubmitBtn label="Simpan Transaksi" />
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════════════════════
   Amount Cell — warna sesuai tipe
══════════════════════════════════════════════════════════════ */
function AmountCell({ amount, type }: { amount: number; type: string }) {
  const isIncome = type === 'income';
  return (
    <span
      className="text-[14px] font-medium whitespace-nowrap"
      style={{
        color: isIncome ? '#34d399' : '#f87171',
        fontFamily: FONT_MONO,
      }}
    >
      {isIncome ? '+' : '−'} {formatRupiah(amount, { showSymbol: false })}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   KeuanganClient — main export
══════════════════════════════════════════════════════════════ */
interface KeuanganClientProps {
  entries:      JournalEntry[];
  activePeriod: string;
  pemasukan:    number;
  pengeluaran:  number;
}

export default function KeuanganClient({
  entries, activePeriod, pemasukan, pengeluaran,
}: KeuanganClientProps) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams= useSearchParams();
  const [addOpen, setAddOpen] = useState(false);

  const setPeriod = useCallback((val: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (val === 'all') p.delete('period');
    else p.set('period', val);
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const saldo = pemasukan - pengeluaran;

  return (
    <>
      {/* ── Summary Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: 'Pemasukan',
            value: formatRupiah(pemasukan, { compact: true }),
            sub:   `${entries.filter(e => e.type === 'income').length} entri`,
            icon:  TrendingUp,
            hex:   '#34d399',
          },
          {
            label: 'Pengeluaran',
            value: formatRupiah(pengeluaran, { compact: true }),
            sub:   `${entries.filter(e => e.type === 'expense').length} entri`,
            icon:  TrendingDown,
            hex:   '#f87171',
          },
          {
            label: 'Saldo Bersih',
            value: formatRupiah(Math.abs(saldo), { compact: true }),
            sub:   saldo >= 0 ? 'surplus' : 'defisit',
            icon:  saldo >= 0 ? TrendingUp : TrendingDown,
            hex:   '#83c3ff',
          },
        ].map(({ label, value, sub, icon: Icon, hex }) => (
          <div
            key={label}
            className="flex flex-col gap-4 p-4 rounded-[8px]"
            style={{
              backgroundColor: '#1b1d1f',
              boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset',
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                {label}
              </span>
              <div className="w-7 h-7 rounded-[4px] flex items-center justify-center" style={{ backgroundColor: hex + '18' }}>
                <Icon size={14} strokeWidth={1.5} style={{ color: hex }} />
              </div>
            </div>
            <p className="text-[28px] font-medium leading-none" style={{ color: hex, fontFamily: FONT_MONO }}>
              {label === 'Saldo Bersih' && saldo < 0 && '−'}{value}
            </p>
            <p className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Filter + Tombol ──────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        {/* Period tabs */}
        <div
          className="flex items-center overflow-x-auto no-scrollbar border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          role="tablist"
        >
          {PERIOD_TABS.map(({ label, value }) => {
            const isActive = activePeriod === value;
            return (
              <button
                key={value}
                role="tab"
                aria-selected={isActive}
                onClick={() => setPeriod(value)}
                className="px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors duration-150"
                style={{
                  borderColor: isActive ? '#83c3ff' : 'transparent',
                  color: isActive ? '#ffffff' : '#acadae',
                  fontFamily: FONT_UI,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Catat Manual */}
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all whitespace-nowrap shrink-0"
          style={{ border: '1px solid #83c3ff', color: '#ffffff', backgroundColor: 'transparent', fontFamily: FONT_UI }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#83c3ff'; e.currentTarget.style.color = '#080809'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
        >
          <PlusCircle size={14} strokeWidth={1.5} />
          Catat Manual
        </button>
      </div>

      {/* ── Tabel Journal ────────────────────────────── */}
      {entries.length === 0 ? (
        <div
          className="flex items-center justify-center h-40 rounded-[8px]"
          style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
        >
          <p className="text-[14px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
            Belum ada transaksi pada periode ini.
          </p>
        </div>
      ) : (
        <div
          className="rounded-[8px] overflow-hidden"
          style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {['Tanggal', 'Keterangan', 'Kategori', 'Jumlah', 'Catatan'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.06em] whitespace-nowrap"
                      style={{ color: '#acadae', fontFamily: FONT_UI, borderBottom: '1px solid #34353c' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr
                    key={entry.id}
                    style={{ borderBottom: i < entries.length - 1 ? '1px solid #34353c' : 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(60,61,64,0.25)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {/* Tanggal */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_MONO }}>
                        {formatTanggalIndo(entry.date, { short: true })}
                      </span>
                    </td>

                    {/* Keterangan */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <div className="flex items-center gap-2">
                        {/* Dot indicator */}
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: entry.type === 'income' ? '#34d399' : '#f87171' }}
                        />
                        <span
                          className="text-[13px] font-medium text-white truncate"
                          style={{ fontFamily: FONT_UI }}
                          title={entry.description}
                        >
                          {entry.description}
                        </span>
                      </div>
                      {entry.order_id && (
                        <span className="text-[11px] ml-3.5" style={{ color: '#83c3ff', fontFamily: FONT_MONO }}>
                          ↳ order terkait
                        </span>
                      )}
                    </td>

                    {/* Kategori */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {entry.account ? (
                        <span
                          className="text-[11px] px-2 py-[3px] rounded-[4px] border"
                          style={{
                            color: '#acadae',
                            borderColor: '#34353c',
                            backgroundColor: 'transparent',
                            fontFamily: FONT_UI,
                          }}
                        >
                          {entry.account}
                        </span>
                      ) : (
                        <span style={{ color: '#3c3d40', fontFamily: FONT_UI, fontSize: '12px' }}>—</span>
                      )}
                    </td>

                    {/* Jumlah — warna by tipe */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <AmountCell amount={entry.amount} type={entry.type} />
                    </td>

                    {/* Catatan */}
                    <td className="px-4 py-3 max-w-[160px]">
                      <span
                        className="text-[12px] truncate block"
                        style={{ color: '#3c3d40', fontFamily: FONT_UI }}
                        title={entry.notes ?? ''}
                      >
                        {entry.notes ?? '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Dialog ───────────────────────────────────── */}
      <CatatManualDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
