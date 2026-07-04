'use client';

import { useState, useEffect, useActionState, useMemo } from 'react';
import { CheckSquare, Search, FileText, CheckCircle2, AlertCircle, XCircle, RotateCcw } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import type { Order, QcRecord } from '@/types/database';
import { submitQcRecord, type QcActionState } from '@/actions/qc';

const FONT_UI = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

function getQcBadgeStyle(status: string) {
  switch (status) {
    case 'passed':
      return { bg: 'rgba(52,211,153,0.15)', text: '#34d399', border: 'rgba(52,211,153,0.3)', icon: <CheckCircle2 size={12} /> };
    case 'revised':
      return { bg: 'rgba(131,195,255,0.15)', text: '#83c3ff', border: 'rgba(131,195,255,0.3)', icon: <RotateCcw size={12} /> };
    case 'rejected':
      return { bg: 'rgba(226,71,86,0.15)', text: '#e24756', border: 'rgba(226,71,86,0.3)', icon: <XCircle size={12} /> };
    default:
      return { bg: 'rgba(172,173,174,0.15)', text: '#acadae', border: 'rgba(172,173,174,0.3)', icon: <AlertCircle size={12} /> };
  }
}

/* ─── Modal Form QC ─────────────────────────────────────────── */
function QcModal({
  order, open, onOpenChange,
}: {
  order: Order | null; open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const [qcStatus, setQcStatus] = useState<'passed' | 'revised' | 'rejected'>('passed');
  const actionWithStatus = order ? submitQcRecord.bind(null, order.id, qcStatus) : async () => ({ status: 'idle' } as QcActionState);
  const [state, formAction] = useActionState(actionWithStatus, { status: 'idle' });

  useEffect(() => {
    if (state.status === 'success') {
      const t = setTimeout(() => onOpenChange(false), 1500);
      return () => clearTimeout(t);
    }
  }, [state.status, onOpenChange]);

  const checklists = [
    { id: 'jahitanRapi', label: 'Jahitan Rapi' },
    { id: 'ukuranSesuai', label: 'Ukuran Sesuai' },
    { id: 'warnaSesuai', label: 'Warna Sesuai' },
    { id: 'tidakAdaNoda', label: 'Tidak Ada Noda' },
    { id: 'labelTerpasang', label: 'Label Terpasang' },
  ];

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
            <CheckSquare size={14} style={{ color: '#83c3ff' }} />
            <DialogTitle className="text-[14px] font-medium text-white m-0" style={{ fontFamily: FONT_UI }}>
              Form Inspeksi QC
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">Form quality control</DialogDescription>
        </DialogHeader>

        {order && (
          <form action={formAction} className="flex flex-col px-5 pb-5 pt-4 gap-4">
            
            <div className="flex justify-between items-center bg-[#0d0d0e] border border-[#34353c] rounded-[6px] p-3">
              <span className="text-[12px] text-[#acadae]">Order: <strong className="text-white ml-1">{order.customer_name}</strong></span>
              <span className="text-[13px] text-[#83c3ff]" style={{ fontFamily: FONT_MONO }}>{order.order_number}</span>
            </div>

            {/* Checklist */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-[#acadae]" style={{ fontFamily: FONT_UI }}>Checklist Pengecekan</label>
              <div className="flex flex-col gap-2 p-3 rounded-[6px] border border-[#34353c] bg-[#141415]">
                {checklists.map((c) => (
                  <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        name={c.id}
                        className="peer appearance-none w-4 h-4 rounded-[3px] border transition-colors cursor-pointer"
                        style={{ borderColor: '#34353c', backgroundColor: 'transparent' }}
                      />
                      <div className="absolute inset-0 rounded-[3px] pointer-events-none transition-opacity opacity-0 peer-checked:opacity-100 flex items-center justify-center bg-[#83c3ff]">
                        <CheckCircle2 size={12} color="#080809" strokeWidth={3} />
                      </div>
                    </div>
                    <span className="text-[13px] text-white select-none transition-colors group-hover:text-[#83c3ff]">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cacat & Revisi */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="defect_count" className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>Jumlah Cacat (Defect)</label>
                <input
                  id="defect_count" name="defect_count" type="number" min={0} defaultValue={0}
                  className="w-full h-9 px-3 text-[13px] outline-none"
                  style={{
                    backgroundColor: '#141415', color: '#ffffff',
                    border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_MONO,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="notes" className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>Catatan / Detail Revisi</label>
                <textarea
                  id="notes" name="notes" rows={3} placeholder="Tulis catatan jika ada..."
                  className="w-full p-3 text-[13px] outline-none resize-none placeholder:text-[#acadae]"
                  style={{
                    backgroundColor: '#141415', color: '#ffffff',
                    border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
                />
              </div>
            </div>

            {state.status === 'success' && (
              <div className="p-3 text-[12px] rounded-[4px] border border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399]">
                {state.message}
              </div>
            )}
            {state.status === 'error' && (
              <div className="p-3 text-[12px] rounded-[4px] border border-[#f87171]/30 bg-[#f87171]/10 text-[#f87171]">
                {state.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[11px] text-[#acadae] text-center mb-1">Keputusan Akhir QC</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="submit"
                  onClick={() => setQcStatus('passed')}
                  className="flex items-center justify-center gap-1.5 h-9 text-[12px] font-medium rounded-[4px] transition-colors"
                  style={{ border: '1px solid #34d399', color: '#34d399', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(52,211,153,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <CheckCircle2 size={14} /> Passed
                </button>
                <button
                  type="submit"
                  onClick={() => setQcStatus('revised')}
                  className="flex items-center justify-center gap-1.5 h-9 text-[12px] font-medium rounded-[4px] transition-colors"
                  style={{ border: '1px solid #83c3ff', color: '#83c3ff', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(131,195,255,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <RotateCcw size={14} /> Revised
                </button>
                <button
                  type="submit"
                  onClick={() => setQcStatus('rejected')}
                  className="flex items-center justify-center gap-1.5 h-9 text-[12px] font-medium rounded-[4px] transition-colors"
                  style={{ border: '1px solid #e24756', color: '#e24756', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(226,71,86,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <XCircle size={14} /> Rejected
                </button>
              </div>
            </div>

          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Client ────────────────────────────────────────────── */
export default function QcClient({ orders, qcRecords }: { orders: Order[], qcRecords: QcRecord[] }) {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // List Order untuk QC (Tampilkan order dengan status finish/shipping tapi qc_status pending/null)
  const pendingQcOrders = useMemo(() => {
    return orders.filter(o => {
      const isFinished = o.status === 'finish' || o.status === 'shipping';
      const isPendingQc = !o.qc_status || o.qc_status === 'pending';
      return isFinished && isPendingQc;
    }).filter(o => 
      o.customer_name.toLowerCase().includes(search.toLowerCase()) || 
      o.order_number.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* KOTAK ATAS: List Order Need QC */}
      <div 
        className="rounded-[8px] p-5 flex flex-col gap-4 shrink-0"
        style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-[14px] font-semibold text-white tracking-tight" style={{ fontFamily: FONT_UI }}>Antrean Quality Control</h2>
          <div className="relative w-full sm:w-[250px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#acadae' }} />
            <input
              type="text"
              placeholder="Cari order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-9 pr-3 text-[12px] outline-none transition-colors placeholder:text-[#acadae]"
              style={{
                backgroundColor: '#141415', color: '#ffffff',
                border: '1px solid #34353c', borderRadius: '4px', fontFamily: FONT_UI,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = '#34353c'; }}
            />
          </div>
        </div>

        {/* Tabel Antrean */}
        <div className="overflow-x-auto rounded-[6px] border border-[#34353c]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#141415' }}>
                <th className="px-4 py-2.5 text-[11px] font-medium uppercase text-[#acadae] tracking-wider w-[20%] border-b border-[#34353c]">No. Pesanan</th>
                <th className="px-4 py-2.5 text-[11px] font-medium uppercase text-[#acadae] tracking-wider w-[35%] border-b border-[#34353c]">Customer / Produk</th>
                <th className="px-4 py-2.5 text-[11px] font-medium uppercase text-[#acadae] tracking-wider text-center w-[15%] border-b border-[#34353c]">Qty</th>
                <th className="px-4 py-2.5 text-[11px] font-medium uppercase text-[#acadae] tracking-wider text-center w-[15%] border-b border-[#34353c]">Deadline</th>
                <th className="px-4 py-2.5 text-[11px] font-medium uppercase text-[#acadae] tracking-wider text-right w-[15%] border-b border-[#34353c]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingQcOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <CheckCircle2 size={24} className="text-[#34d399] mx-auto opacity-60 mb-2" />
                    <span className="text-[13px] text-[#acadae]">Semua order sudah diinspeksi.</span>
                  </td>
                </tr>
              ) : pendingQcOrders.map((order, i) => (
                <tr 
                  key={order.id} 
                  style={{ borderBottom: i < pendingQcOrders.length - 1 ? '1px solid #34353c' : 'none' }}
                  className="hover:bg-[#3c3d40]/20 transition-colors"
                >
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#83c3ff]" style={{ fontFamily: FONT_MONO }}>{order.order_number}</td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold text-white block">{order.customer_name}</span>
                    <span className="text-[11px] text-[#acadae] block">{order.product_type}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-white text-center font-mono">{order.quantity}</td>
                  <td className="px-4 py-3 text-[12px] text-[#acadae] text-center">
                    {order.deadline_date ? new Date(order.deadline_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1.5 h-7 px-3 text-[11px] font-medium rounded-[4px] transition-all bg-[#83c3ff] text-[#080809]"
                    >
                      Mulai QC
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KOTAK BAWAH: Riwayat QC */}
      <div 
        className="rounded-[8px] p-5 flex flex-col gap-4 flex-1 min-h-[300px]"
        style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} style={{ color: '#acadae' }} />
          <h2 className="text-[14px] font-semibold text-white tracking-tight" style={{ fontFamily: FONT_UI }}>Riwayat QC Terakhir</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-3 text-[11px] font-medium uppercase text-[#acadae] tracking-wider border-b border-[#34353c]">Tanggal QC</th>
                <th className="px-2 py-3 text-[11px] font-medium uppercase text-[#acadae] tracking-wider border-b border-[#34353c]">Order ID</th>
                <th className="px-2 py-3 text-[11px] font-medium uppercase text-[#acadae] tracking-wider border-b border-[#34353c]">Inspector</th>
                <th className="px-2 py-3 text-[11px] font-medium uppercase text-[#acadae] tracking-wider border-b border-[#34353c] text-center">Cacat</th>
                <th className="px-2 py-3 text-[11px] font-medium uppercase text-[#acadae] tracking-wider border-b border-[#34353c]">Catatan</th>
                <th className="px-2 py-3 text-[11px] font-medium uppercase text-[#acadae] tracking-wider border-b border-[#34353c] text-right">Status Akhir</th>
              </tr>
            </thead>
            <tbody>
              {qcRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[13px] text-[#acadae] italic">Belum ada riwayat QC tersimpan.</td>
                </tr>
              ) : qcRecords.map((record, i) => {
                const style = getQcBadgeStyle(record.status);
                // Try finding the matched order to display order_number
                const matchedOrder = orders.find(o => o.id === record.order_id);
                return (
                  <tr key={record.id} style={{ borderBottom: i < qcRecords.length - 1 ? '1px solid #34353c' : 'none' }}>
                    <td className="px-2 py-3 text-[12px] text-[#acadae]">{record.check_date}</td>
                    <td className="px-2 py-3 text-[12px] font-mono text-white">{matchedOrder?.order_number || record.order_id?.split('-')[0]}</td>
                    <td className="px-2 py-3 text-[12px] text-[#acadae]">{record.inspector_name || '-'}</td>
                    <td className="px-2 py-3 text-[13px] font-mono text-white text-center">
                      <span className={record.defect_count > 0 ? 'text-[#f87171]' : 'text-white'}>{record.defect_count}</span>
                    </td>
                    <td className="px-2 py-3 text-[12px] text-[#acadae] max-w-[200px] truncate">{record.notes || '-'}</td>
                    <td className="px-2 py-3 text-right">
                      <span 
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[4px] text-[10px] font-medium uppercase tracking-wider"
                        style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                      >
                        {style.icon} {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <QcModal
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(v) => { if(!v) setSelectedOrder(null); }}
      />
    </div>
  );
}
