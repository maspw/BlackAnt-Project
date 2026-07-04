'use client';

import { useState, useEffect, useActionState, useMemo, Fragment } from 'react';
import { PlusCircle, Search, CheckCircle2, AlertCircle, Edit2, Trash2, Users, Star } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import type { Supplier } from '@/types/database';
import { createSupplier, updateSupplier, deleteSupplier, type SupplierActionState } from '@/actions/suppliers';

const FONT_UI   = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

/* ══════════════════════════════════════════════════════════════
   Helpers UI
══════════════════════════════════════════════════════════════ */
function Feedback({ state }: { state: SupplierActionState }) {
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

function DarkInput({ id, name, label, type = 'text', required, placeholder, defaultValue, max, min }: {
  id: string; name: string; label: string; type?: string; required?: boolean;
  placeholder?: string; defaultValue?: string | number; max?: number; min?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      <input
        id={id} name={name} type={type} required={required}
        placeholder={placeholder} defaultValue={defaultValue}
        max={max} min={min}
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

/* ══════════════════════════════════════════════════════════════
   Modal Tambah/Edit
══════════════════════════════════════════════════════════════ */
function SupplierModal({
  supplier, open, onOpenChange,
}: {
  supplier: Supplier | null | undefined; open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const isEdit = !!supplier;
  const submitAction = isEdit ? updateSupplier.bind(null, supplier.id) : createSupplier;
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
              {isEdit ? 'Edit Supplier' : 'Tambah Supplier'}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">Form data supplier</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-3 px-5 pb-5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <DarkInput id="name" name="name" label="Nama Supplier" required placeholder="PT. Pemasok Bahan" defaultValue={supplier?.name} />
            </div>
            <DarkInput id="contact_person" name="contact_person" label="Kontak Person" placeholder="Budi" defaultValue={supplier?.contact_person ?? ''} />
            <DarkInput id="phone" name="phone" label="No. Telepon" type="tel" placeholder="0812..." defaultValue={supplier?.phone ?? ''} />
            <div className="col-span-2">
              <DarkInput id="category" name="category" label="Kategori Bahan" placeholder="Kain, Benang, Tinta" defaultValue={supplier?.category ?? ''} />
            </div>
            <div className="col-span-2">
              <DarkInput id="rating" name="rating" label="Rating (1-5)" type="number" min={1} max={5} defaultValue={supplier?.rating ?? 5} />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>Catatan Tambahan</label>
              <textarea
                id="notes" name="notes" rows={3} placeholder="Catatan internal..."
                defaultValue={supplier?.notes ?? ''}
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
export default function SupplierClient({ data }: { data: Supplier[] }) {
  const [search, setSearch] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter(s => {
      const matchSearch = (s.name.toLowerCase().includes(search.toLowerCase())) || 
                          (s.category?.toLowerCase().includes(search.toLowerCase())) ||
                          (s.contact_person?.toLowerCase().includes(search.toLowerCase()));
      return matchSearch;
    });
  }, [data, search]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus supplier "${name}"?`)) {
      await deleteSupplier(id);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
              placeholder="Cari nama, kontak atau kategori..."
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
        </div>

        {/* Tambah */}
        <button
          type="button"
          onClick={() => { setEditingSupplier(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all whitespace-nowrap shrink-0 w-full sm:w-auto"
          style={{ border: '1px solid #83c3ff', color: '#ffffff', backgroundColor: 'transparent', fontFamily: FONT_UI }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#83c3ff'; e.currentTarget.style.color = '#080809'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
        >
          <PlusCircle size={14} strokeWidth={1.5} />
          Tambah Supplier
        </button>
      </div>

      {/* ── Tabel ─────────────────────────────────── */}
      {filteredData.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 h-48 rounded-[8px]"
          style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
        >
          <Users size={24} style={{ color: '#acadae' }} className="opacity-50 mb-1" />
          <p className="text-[14px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
            {data.length === 0 ? 'Belum ada data supplier.' : 'Pencarian tidak ditemukan.'}
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
                  {['Nama Supplier', 'Kontak Person', 'Telepon', 'Kategori Bahan', 'Rating', 'Aksi'].map((h) => (
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
                {filteredData.map((s, i) => (
                  <Fragment key={s.id}>
                    <tr
                      className="cursor-pointer"
                      style={{ borderBottom: i < filteredData.length - 1 && expandedId !== s.id ? '1px solid #34353c' : 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(60,61,64,0.25)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return;
                        toggleExpand(s.id);
                      }}
                    >
                    {/* Nama Supplier */}
                    <td className="px-3 py-3 max-w-[200px]">
                      <span className="text-[13px] font-bold text-white block truncate" style={{ fontFamily: FONT_UI }}>
                        {s.name}
                      </span>
                      {s.address && (
                        <span className="text-[11px] block truncate mt-0.5" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                          {s.address}
                        </span>
                      )}
                    </td>

                    {/* Kontak Person */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-[13px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                        {s.contact_person || '—'}
                      </span>
                    </td>

                    {/* Telepon */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-[12px]" style={{ color: '#ffffff', fontFamily: FONT_MONO }}>
                        {s.phone || '—'}
                      </span>
                    </td>

                    {/* Kategori Bahan */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                        {s.category || '—'}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={12} 
                            fill={star <= s.rating ? '#83c3ff' : 'transparent'} 
                            color={star <= s.rating ? '#83c3ff' : '#34353c'} 
                          />
                        ))}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setEditingSupplier(s); setModalOpen(true); }}
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
                          onClick={(e) => { e.stopPropagation(); handleDelete(s.id, s.name); }}
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
                    {expandedId === s.id && (
                      <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: i < filteredData.length - 1 ? '1px solid #34353c' : 'none' }}>
                        <td colSpan={6} className="px-5 py-4">
                          <div className="flex flex-col gap-2">
                            <h4 className="text-[12px] font-semibold text-white tracking-wide" style={{ fontFamily: FONT_UI }}>RIWAYAT PEMBELIAN (MOCKUP)</h4>
                            <div className="flex items-center justify-between p-3 rounded-[4px]" style={{ backgroundColor: '#1b1d1f', border: '1px solid #34353c' }}>
                              <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>Belum ada data riwayat spesifik dari database untuk supplier ini.</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit */}
      <SupplierModal
        supplier={editingSupplier}
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditingSupplier(null); }}
      />
    </>
  );
}
