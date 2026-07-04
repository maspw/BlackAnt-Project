'use client';

import { useState, useEffect, useActionState } from 'react';
import { PackagePlus, RefreshCw, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Material } from '@/types/database';
import { formatRupiah, formatTanggalIndo } from '@/lib/utils-admin';
import { restockMaterial, addMaterial, type ActionState } from '@/actions/materials';

/* ══════════════════════════════════════════════════════════════
   Constants
══════════════════════════════════════════════════════════════ */
const FONT_UI   = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

const UNIT_OPTIONS = ['meter', 'roll', 'lusin', 'pcs', 'kg', 'liter', 'rim', 'set'];
const CATEGORY_OPTIONS = ['Kain', 'Benang', 'Sablon', 'Aksesori', 'Packaging', 'Lainnya'];

/* ══════════════════════════════════════════════════════════════
   Status logic
══════════════════════════════════════════════════════════════ */
type StockStatus = 'aman' | 'menipis' | 'habis';

function getStockStatus(stock: number, minStock: number | null): StockStatus {
  if (stock === 0) return 'habis';
  if (minStock != null && stock < minStock) return 'menipis';
  return 'aman';
}

const STATUS_CONFIG: Record<StockStatus, { label: string; hex: string }> = {
  aman:    { label: 'Aman',    hex: '#34d399' },
  menipis: { label: 'Menipis', hex: '#fbbf24' },
  habis:   { label: 'Habis',   hex: '#f87171' },
};

function StockBadge({ stock, minStock }: { stock: number; minStock: number | null }) {
  const s = getStockStatus(stock, minStock);
  const { label, hex } = STATUS_CONFIG[s];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-[3px] text-[11px] font-medium rounded-[4px] border whitespace-nowrap"
      style={{
        backgroundColor: 'transparent',
        color: hex,
        borderColor: hex + '50',
        fontFamily: FONT_UI,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hex }} />
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   Feedback Banner
══════════════════════════════════════════════════════════════ */
function Feedback({ state }: { state: ActionState }) {
  if (state.status === 'idle') return null;
  const isOk = state.status === 'success';
  return (
    <div
      className="flex items-start gap-2 p-3 rounded-[4px] text-[12px]"
      style={{
        backgroundColor: isOk ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
        border: `1px solid ${isOk ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
        color: isOk ? '#34d399' : '#f87171',
        fontFamily: FONT_UI,
      }}
    >
      {isOk
        ? <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
        : <AlertCircle  size={13} className="shrink-0 mt-0.5" />}
      {state.message}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Input helper (styled dark)
══════════════════════════════════════════════════════════════ */
function DarkInput({
  id, name, label, type = 'text', required, placeholder, defaultValue, min, step, hint,
}: {
  id: string; name: string; label: string; type?: string; required?: boolean;
  placeholder?: string; defaultValue?: string | number; min?: string; step?: string; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      <input
        id={id} name={name} type={type} required={required}
        placeholder={placeholder} defaultValue={defaultValue}
        min={min} step={step}
        className="w-full h-9 px-3 text-[13px] outline-none transition-colors"
        style={{
          backgroundColor: '#0d0d0e',
          color: '#ffffff',
          border: '1px solid #34353c',
          borderRadius: '4px',
          fontFamily: type === 'number' ? FONT_MONO : FONT_UI,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
      />
      {hint && <p className="text-[11px]" style={{ color: '#3c3d40', fontFamily: FONT_UI }}>{hint}</p>}
    </div>
  );
}

function DarkSelect({
  id, name, label, required, options, defaultValue,
}: {
  id: string; name: string; label: string; required?: boolean;
  options: string[]; defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      <select
        id={id} name={name} required={required} defaultValue={defaultValue ?? ''}
        className="w-full h-9 px-3 text-[13px] outline-none transition-colors"
        style={{
          backgroundColor: '#0d0d0e',
          color: '#ffffff',
          border: '1px solid #34353c',
          borderRadius: '4px',
          fontFamily: FONT_UI,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
      >
        <option value="" disabled style={{ backgroundColor: '#1b1d1f' }}>— Pilih —</option>
        {options.map((o) => (
          <option key={o} value={o} style={{ backgroundColor: '#1b1d1f' }}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Submit button
══════════════════════════════════════════════════════════════ */
function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all duration-150 flex items-center justify-center gap-2"
      style={{ border: '1px solid #83c3ff', color: '#ffffff', backgroundColor: 'transparent', fontFamily: FONT_UI }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#83c3ff';
        e.currentTarget.style.color = '#080809';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#ffffff';
      }}
    >
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   Restock Dialog
══════════════════════════════════════════════════════════════ */
function RestockDialog({
  material, open, onOpenChange,
}: {
  material: Material | null; open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const [state, formAction] = useActionState(restockMaterial, { status: 'idle' });

  // Auto-close on success
  useEffect(() => {
    if (state.status === 'success') {
      const t = setTimeout(() => onOpenChange(false), 1500);
      return () => clearTimeout(t);
    }
  }, [state.status, onOpenChange]);

  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 border-0 overflow-hidden max-w-sm"
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
          <RefreshCw size={14} style={{ color: '#83c3ff' }} />
          <DialogTitle className="text-[14px] font-medium text-white m-0" style={{ fontFamily: FONT_UI }}>
            Restock Bahan
          </DialogTitle>
          <DialogDescription className="sr-only">
            Form untuk menambah stok {material.name}
          </DialogDescription>
        </DialogHeader>

        {/* Info bahan */}
        <div
          className="mx-5 mt-4 p-3 rounded-[4px] flex items-center justify-between"
          style={{ backgroundColor: '#26272d', boxShadow: 'rgba(255,255,255,0.06) 0 0 0 1px inset' }}
        >
          <div>
            <p className="text-[13px] font-medium text-white" style={{ fontFamily: FONT_UI }}>{material.name}</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#acadae', fontFamily: FONT_UI }}>
              {material.category ?? '—'} · {material.unit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[20px] font-medium" style={{ color: '#83c3ff', fontFamily: FONT_MONO }}>
              {material.stock}
            </p>
            <p className="text-[11px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>stok saat ini</p>
          </div>
        </div>

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-4 px-5 pb-5 pt-4">
          <input type="hidden" name="materialId"   value={material.id} />
          <input type="hidden" name="materialName" value={material.name} />

          <DarkInput
            id="qty" name="qty" label="Jumlah Tambah" type="number"
            required min="1" placeholder="Contoh: 50"
            hint={`Dalam satuan: ${material.unit}`}
          />
          <DarkInput
            id="unitCost" name="unitCost" label="Harga per Satuan (IDR)" type="number"
            min="0" step="100"
            defaultValue={material.unit_cost ?? ''}
            placeholder="Contoh: 45000"
            hint="Kosongkan untuk pakai harga lama"
          />
          <DarkInput
            id="restockNotes" name="notes" label="Catatan (opsional)"
            placeholder="Misal: Beli dari Supplier X"
          />

          <Feedback state={state} />
          <SubmitButton label="Tambah Stok" />
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════════════════════
   Add Material Dialog
══════════════════════════════════════════════════════════════ */
function AddMaterialDialog({
  open, onOpenChange,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const [state, formAction] = useActionState(addMaterial, { status: 'idle' });

  useEffect(() => {
    if (state.status === 'success') {
      const t = setTimeout(() => onOpenChange(false), 1500);
      return () => clearTimeout(t);
    }
  }, [state.status, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 border-0 overflow-hidden max-w-md"
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
          <PackagePlus size={14} style={{ color: '#83c3ff' }} />
          <DialogTitle className="text-[14px] font-medium text-white m-0" style={{ fontFamily: FONT_UI }}>
            Tambah Bahan Baru
          </DialogTitle>
          <DialogDescription className="sr-only">Form untuk menambah bahan baru ke inventori</DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-3 px-5 pb-5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <DarkInput id="name" name="name" label="Nama Bahan" required placeholder="Kain Cotton Combed 30s" />
            </div>
            <DarkSelect id="category" name="category" label="Kategori" options={CATEGORY_OPTIONS} />
            <DarkSelect id="unit" name="unit" label="Satuan" required options={UNIT_OPTIONS} />
            <DarkInput id="stock" name="stock" label="Stok Awal" type="number" min="0" defaultValue={0} />
            <DarkInput id="unitCost" name="unitCost" label="Harga/Satuan (IDR)" type="number" min="0" step="100" placeholder="45000" />
            <div className="col-span-2">
              <DarkInput
                id="minStock" name="minStock" label="Stok Minimum (alert)"
                type="number" min="0" placeholder="Contoh: 10"
                hint="Alert akan muncul jika stok di bawah nilai ini"
              />
            </div>
            <div className="col-span-2">
              <DarkInput id="addNotes" name="notes" label="Catatan" placeholder="Supplier, kode SKU, dll." />
            </div>
          </div>

          <Feedback state={state} />
          <SubmitButton label="Simpan Bahan" />
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════════════════════
   BahanClient — Main export
══════════════════════════════════════════════════════════════ */
interface BahanClientProps {
  materials: Material[];
}

export default function BahanClient({ materials }: BahanClientProps) {
  const [restockTarget, setRestockTarget] = useState<Material | null>(null);
  const [addOpen, setAddOpen]             = useState(false);

  const lowCount  = materials.filter((m) => getStockStatus(m.stock, m.min_stock) === 'menipis').length;
  const zeroCount = materials.filter((m) => m.stock === 0).length;

  return (
    <>
      {/* ── Alert strip ─────────────────────────────── */}
      {(lowCount > 0 || zeroCount > 0) && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-[4px] text-[13px]"
          style={{
            backgroundColor: 'rgba(251,191,36,0.08)',
            border: '1px solid rgba(251,191,36,0.25)',
            color: '#fbbf24',
            fontFamily: FONT_UI,
          }}
        >
          <AlertTriangle size={14} strokeWidth={1.5} className="shrink-0" />
          <span>
            {zeroCount > 0 && <><strong>{zeroCount} bahan habis</strong> · </>}
            {lowCount  > 0 && <><strong>{lowCount} bahan menipis</strong></>}
            {' '}— segera lakukan restock.
          </span>
        </div>
      )}

      {/* ── Tombol Tambah Bahan ──────────────────────── */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all duration-150"
          style={{ border: '1px solid #83c3ff', color: '#ffffff', backgroundColor: 'transparent', fontFamily: FONT_UI }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#83c3ff';
            e.currentTarget.style.color = '#080809';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          <PackagePlus size={14} strokeWidth={1.5} aria-hidden="true" />
          Tambah Bahan
        </button>
      </div>

      {/* ── Tabel Inventori ──────────────────────────── */}
      {materials.length === 0 ? (
        <div
          className="flex items-center justify-center h-48 rounded-[8px]"
          style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
        >
          <p className="text-[14px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
            Belum ada bahan terdaftar.
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
                  {['Nama Bahan', 'Kategori', 'Stok', 'Satuan', 'Harga/Unit', 'Status', 'Diperbarui', ''].map((h) => (
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
                {materials.map((mat, i) => (
                  <tr
                    key={mat.id}
                    style={{ borderBottom: i < materials.length - 1 ? '1px solid #34353c' : 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(60,61,64,0.25)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {/* Nama */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <span className="text-[13px] font-medium text-white truncate block" style={{ fontFamily: FONT_UI }}>
                        {mat.name}
                      </span>
                      {mat.notes && (
                        <span className="text-[11px] truncate block" style={{ color: '#3c3d40', fontFamily: FONT_UI }}>
                          {mat.notes}
                        </span>
                      )}
                    </td>

                    {/* Kategori */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                        {mat.category ?? '—'}
                      </span>
                    </td>

                    {/* Stok — besar, mono, warna sesuai status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {(() => {
                        const s = getStockStatus(mat.stock, mat.min_stock);
                        const hex = STATUS_CONFIG[s].hex;
                        return (
                          <span
                            className="text-[22px] font-medium leading-none"
                            style={{ color: s === 'aman' ? '#ffffff' : hex, fontFamily: FONT_MONO }}
                          >
                            {mat.stock}
                          </span>
                        );
                      })()}
                    </td>

                    {/* Satuan */}
                    <td className="px-4 py-3">
                      <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                        {mat.unit}
                      </span>
                    </td>

                    {/* Harga */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[13px] text-white" style={{ fontFamily: FONT_MONO }}>
                        {formatRupiah(mat.unit_cost)}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <StockBadge stock={mat.stock} minStock={mat.min_stock} />
                    </td>

                    {/* Diperbarui */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_MONO }}>
                        {formatTanggalIndo(mat.updated_at ?? mat.created_at, { short: true })}
                      </span>
                    </td>

                    {/* Restock button */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setRestockTarget(mat)}
                        className="inline-flex items-center gap-1.5 h-7 px-3 text-[11px] font-medium rounded-[4px] transition-all whitespace-nowrap"
                        style={{ border: '1px solid #34353c', color: '#acadae', backgroundColor: 'transparent', fontFamily: FONT_UI }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#83c3ff';
                          e.currentTarget.style.color = '#83c3ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#34353c';
                          e.currentTarget.style.color = '#acadae';
                        }}
                      >
                        <RefreshCw size={11} strokeWidth={2} />
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Dialogs ──────────────────────────────────── */}
      <RestockDialog
        material={restockTarget}
        open={!!restockTarget}
        onOpenChange={(v) => { if (!v) setRestockTarget(null); }}
      />
      <AddMaterialDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
