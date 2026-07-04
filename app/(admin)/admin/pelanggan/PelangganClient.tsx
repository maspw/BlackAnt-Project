'use client';

import { useState, useEffect, useActionState, useMemo } from 'react';
import { PlusCircle, Search, CheckCircle2, AlertCircle, Edit2, Trash2, X, Users } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import type { Customer, CustomerCategory } from '@/types/database';
import { formatRupiah, formatTanggalIndo, getCategoryBadgeColor } from '@/lib/utils-admin';
import { createCustomer, updateCustomer, deleteCustomer, type CustomerActionState } from '@/actions/customers';

/* ══════════════════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════════════ */
export interface CustomerWithStats extends Customer {
  total_order: number;
  total_belanja: number;
  last_order: string | null;
}

const FONT_UI   = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

const CATEGORY_OPTIONS: { value: CustomerCategory; label: string }[] = [
  { value: 'vip',       label: 'VIP' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'regular',   label: 'Regular' },
  { value: 'retail',    label: 'Retail' },
];

/* ══════════════════════════════════════════════════════════════
   Helpers UI
══════════════════════════════════════════════════════════════ */
function Feedback({ state }: { state: CustomerActionState }) {
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

function DarkInput({ id, name, label, type = 'text', required, placeholder, defaultValue }: {
  id: string; name: string; label: string; type?: string; required?: boolean;
  placeholder?: string; defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      <input
        id={id} name={name} type={type} required={required}
        placeholder={placeholder} defaultValue={defaultValue}
        className="w-full h-9 px-3 text-[13px] outline-none placeholder:text-[#acadae]"
        style={{
          backgroundColor: '#0d0d0e', color: '#ffffff',
          border: '1px solid #34353c', borderRadius: '4px',
          fontFamily: type === 'number' || type === 'tel' ? FONT_MONO : FONT_UI,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
      />
    </div>
  );
}

function DarkSelect({ id, name, label, required, options, defaultValue }: {
  id: string; name: string; label: string; required?: boolean;
  options: { value: string; label: string }[]; defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      <select
        id={id} name={name} required={required} defaultValue={defaultValue ?? ''}
        className="w-full h-9 px-3 text-[13px] outline-none"
        style={{
          backgroundColor: '#0d0d0e', color: '#ffffff',
          border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
      >
        <option value="" disabled style={{ backgroundColor: '#1b1d1f' }}>— Pilih —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: '#1b1d1f' }}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Modal Tambah/Edit
══════════════════════════════════════════════════════════════ */
function CustomerModal({
  customer, open, onOpenChange,
}: {
  customer: Customer | null | undefined; open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const isEdit = !!customer;
  const submitAction = isEdit ? updateCustomer.bind(null, customer.id) : createCustomer;
  const [state, formAction] = useActionState(submitAction, { status: 'idle' });

  useEffect(() => {
    if (state.status === 'success') {
      const t = setTimeout(() => onOpenChange(false), 1500);
      return () => clearTimeout(t);
    }
  }, [state.status, onOpenChange]);

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
        <DialogHeader
          className="px-5 h-[48px] flex-row items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <PlusCircle size={14} style={{ color: '#83c3ff' }} />
            <DialogTitle className="text-[14px] font-medium text-white m-0" style={{ fontFamily: FONT_UI }}>
              {isEdit ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">Form data pelanggan</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-3 px-5 pb-5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <DarkInput id="name" name="name" label="Nama Lengkap" required placeholder="Contoh: Budi Santoso" defaultValue={customer?.name} />
            </div>
            <DarkInput id="phone" name="phone" label="No. Telepon (WA)" type="tel" required placeholder="0812..." defaultValue={customer?.phone} />
            <DarkInput id="email" name="email" label="Email" type="email" placeholder="email@contoh.com" defaultValue={customer?.email ?? ''} />
            <div className="col-span-2">
              <DarkInput id="address" name="address" label="Perusahaan / Alamat" placeholder="Nama brand atau alamat singkat" defaultValue={customer?.address ?? ''} />
            </div>
            <div className="col-span-2">
              <DarkSelect id="category" name="category" label="Kategori" required options={CATEGORY_OPTIONS} defaultValue={customer?.category ?? 'regular'} />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>Catatan Tambahan</label>
              <textarea
                id="notes" name="notes" rows={3} placeholder="Catatan internal..."
                defaultValue={customer?.notes ?? ''}
                className="w-full p-3 text-[13px] outline-none resize-none placeholder:text-[#acadae]"
                style={{
                  backgroundColor: '#0d0d0e', color: '#ffffff',
                  border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
              />
            </div>
          </div>

          <Feedback state={state} />
          <button
            type="submit"
            className="h-9 mt-2 px-4 text-[13px] font-medium rounded-[4px] transition-all"
            style={{ border: '1px solid #83c3ff', color: '#ffffff', backgroundColor: 'transparent', fontFamily: FONT_UI }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#83c3ff'; e.currentTarget.style.color = '#080809'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
          >
            Simpan Data
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Client Component
══════════════════════════════════════════════════════════════ */
export default function PelangganClient({ data }: { data: CustomerWithStats[] }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter(c => {
      const matchSearch = (c.name.toLowerCase().includes(search.toLowerCase())) || 
                          (c.phone.includes(search));
      const matchCat = filterCat === 'all' || c.category === filterCat;
      return matchSearch && matchCat;
    });
  }, [data, search, filterCat]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus pelanggan "${name}"?`)) {
      await deleteCustomer(id);
    }
  };

  return (
    <>
      {/* ── Toolbar: Search & Filter ───────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 w-full gap-3">
          {/* Search */}
          <div className="relative w-full max-w-[300px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#acadae' }} />
            <input
              type="text"
              placeholder="Cari nama atau telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-[#acadae]"
              style={{
                backgroundColor: '#1b1d1f', color: '#ffffff',
                border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
            />
          </div>

          {/* Filter */}
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="h-9 px-3 text-[13px] outline-none transition-colors"
            style={{
              backgroundColor: '#1b1d1f', color: '#ffffff',
              border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
          >
            <option value="all" style={{ backgroundColor: '#1b1d1f', color: '#ffffff' }}>Semua Kategori</option>
            {CATEGORY_OPTIONS.map(o => (
              <option key={o.value} value={o.value} style={{ backgroundColor: '#1b1d1f' }}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Tambah */}
        <button
          type="button"
          onClick={() => { setEditingCustomer(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all whitespace-nowrap shrink-0 w-full sm:w-auto"
          style={{ border: '1px solid #83c3ff', color: '#ffffff', backgroundColor: 'transparent', fontFamily: FONT_UI }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#83c3ff'; e.currentTarget.style.color = '#080809'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
        >
          <PlusCircle size={14} strokeWidth={1.5} />
          Tambah Pelanggan
        </button>
      </div>

      {/* ── Tabel CRM ─────────────────────────────────── */}
      {filteredData.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 h-48 rounded-[8px]"
          style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
        >
          <Users size={24} style={{ color: '#acadae' }} className="opacity-50 mb-1" />
          <p className="text-[14px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
            {data.length === 0 ? 'Belum ada data pelanggan.' : 'Pencarian tidak ditemukan.'}
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
                  {['Nama Pelanggan', 'Telepon', 'Kategori', 'Total Order', 'Total Belanja', 'Order Terakhir', 'Aksi'].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3 text-[12px] font-medium uppercase tracking-[0.06em] whitespace-nowrap"
                      style={{ color: '#acadae', fontFamily: FONT_UI, borderBottom: '1px solid #34353c' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((cust, i) => {
                  const c = getCategoryBadgeColor(cust.category);
                  return (
                    <tr
                      key={cust.id}
                      style={{ borderBottom: i < filteredData.length - 1 ? '1px solid #34353c' : 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(60,61,64,0.25)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {/* Nama & Perusahaan */}
                      <td className="px-3 py-3 max-w-[200px]">
                        <span className="text-[13px] font-bold text-white block truncate" style={{ fontFamily: FONT_UI }}>
                          {cust.name}
                        </span>
                        {cust.address && (
                          <span className="text-[11px] block truncate mt-0.5" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                            {cust.address}
                          </span>
                        )}
                      </td>

                      {/* Telepon */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-[12px]" style={{ color: '#ffffff', fontFamily: FONT_MONO }}>
                          {cust.phone}
                        </span>
                      </td>

                      {/* Kategori Badge */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-[3px] text-[11px] font-medium rounded-[4px] border ${c.text}`}
                          style={{
                            backgroundColor: 'transparent',
                            borderColor: c.hex + '50',
                            fontFamily: FONT_UI,
                          }}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                          {c.label}
                        </span>
                      </td>

                      {/* Total Order */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-[14px]" style={{ color: cust.total_order > 0 ? '#ffffff' : '#acadae', fontFamily: FONT_MONO }}>
                          {cust.total_order}
                        </span>
                      </td>

                      {/* Total Belanja */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-[13px]" style={{ color: cust.total_belanja > 0 ? '#34d399' : '#acadae', fontFamily: FONT_MONO }}>
                          {cust.total_belanja > 0 ? formatRupiah(cust.total_belanja, { compact: true }) : '—'}
                        </span>
                      </td>

                      {/* Last Order */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_MONO }}>
                          {cust.last_order ? formatTanggalIndo(cust.last_order, { short: true }) : '—'}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => { setEditingCustomer(cust); setModalOpen(true); }}
                            className="w-7 h-7 flex items-center justify-center rounded-[4px] transition-colors"
                            style={{ color: '#acadae' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3c3d40'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#acadae'; }}
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cust.id, cust.name)}
                            className="w-7 h-7 flex items-center justify-center rounded-[4px] transition-colors"
                            style={{ color: '#acadae' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.15)'; e.currentTarget.style.color = '#f87171'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#acadae'; }}
                            title="Hapus"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit */}
      <CustomerModal
        customer={editingCustomer}
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditingCustomer(null); }}
      />
    </>
  );
}
