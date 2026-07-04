'use client';

import { useState, useCallback, useEffect, useActionState, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  X, ChevronRight, Loader2, CheckCircle2, AlertCircle,
  User, Package, Calendar, CreditCard, Phone, FileText,
} from 'lucide-react';
import type { OrderSummary, OrderStatus } from '@/types/database';
import {
  formatRupiah, formatTanggalIndo, formatRelativeTime,
  getStatusColor, getStatusLabel, calcSisa, calcPaymentProgress,
} from '@/lib/utils-admin';
import { updateOrderStatus, type UpdateStatusState } from '@/actions/orders';

/* ══════════════════════════════════════════════════════════════
   Constants
══════════════════════════════════════════════════════════════ */
const FONT_UI   = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending',   label: 'Menunggu'    },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'process',   label: 'Produksi'     },
  { value: 'qc',        label: 'Quality Check'},
  { value: 'shipping',  label: 'Dikirim'      },
  { value: 'finish',    label: 'Selesai'      },
  { value: 'cancelled', label: 'Dibatalkan'   },
];

const FILTER_TABS: { label: string; value: string }[] = [
  { label: 'Semua',   value: 'all'       },
  { label: 'Pending', value: 'pending'   },
  { label: 'Proses',  value: 'process'   },
  { label: 'Selesai', value: 'finish'    },
];

/* ══════════════════════════════════════════════════════════════
   StatusBadge
══════════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: OrderStatus }) {
  const c = getStatusColor(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-[3px] text-[11px] font-medium rounded-[4px] border whitespace-nowrap"
      style={{
        backgroundColor: 'transparent',
        color: c.hex,
        borderColor: c.hex + '60',
        fontFamily: FONT_UI,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.hex }} />
      {c.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   OrderModal
══════════════════════════════════════════════════════════════ */
interface OrderModalProps {
  order: OrderSummary | null;
  onClose: () => void;
}

const initialActionState: UpdateStatusState = { status: 'idle' };

function OrderModal({ order, onClose }: OrderModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [actionState, formAction] = useActionState(updateOrderStatus, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  // Sync selected status ketika order berubah
  useEffect(() => {
    setSelectedStatus(order?.status ?? '');
  }, [order]);

  // Tutup modal otomatis setelah sukses
  useEffect(() => {
    if (actionState.status === 'success') {
      const t = setTimeout(() => onClose(), 1200);
      return () => clearTimeout(t);
    }
  }, [actionState.status, onClose]);

  if (!order) return null;

  const isFinish = selectedStatus === 'finish';
  const sisa     = calcSisa(order.total_price, order.total_paid);
  const progress = calcPaymentProgress(order.total_price, order.total_paid);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-end"
      style={{ backgroundColor: 'rgba(8,8,9,0.75)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail pesanan ${order.order_number}`}
    >
      {/* Panel */}
      <aside
        className="relative h-full w-full max-w-[480px] flex flex-col overflow-y-auto"
        style={{
          backgroundColor: '#1b1d1f',
          boxShadow: 'rgba(255,255,255,0.08) -1px 0 0 0',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 h-[48px] shrink-0 sticky top-0 z-10"
          style={{
            backgroundColor: '#141415',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-[14px] font-medium text-white" style={{ fontFamily: FONT_UI }}>
            Detail Pesanan
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-[4px] transition-colors"
            style={{ color: '#acadae' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3c3d40';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#acadae';
            }}
            aria-label="Tutup"
          >
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-5">

          {/* Order number + status */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                No. Pesanan
              </p>
              <p className="text-[20px] font-medium text-white" style={{ fontFamily: FONT_MONO }}>
                {order.order_number ?? '—'}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {[
              { icon: User,     label: 'Klien',    value: order.client_name },
              { icon: Package,  label: 'Item',     value: `${order.item_name}` },
              { icon: Package,  label: 'Kuantitas',value: `${order.quantity} pcs` },
              { icon: Calendar, label: 'Deadline', value: order.due_date ? formatTanggalIndo(order.due_date, { short: true }) : '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <p className="text-[11px] uppercase tracking-widest mb-1 flex items-center gap-1"
                  style={{ color: '#acadae', fontFamily: FONT_UI }}>
                  <Icon size={10} strokeWidth={1.5} />
                  {label}
                </p>
                <p className="text-[14px] text-white" style={{ fontFamily: FONT_UI }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Keuangan */}
          <div
            className="rounded-[8px] p-4 flex flex-col gap-3"
            style={{
              backgroundColor: '#26272d',
              boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset',
            }}
          >
            <p className="text-[11px] uppercase tracking-widest" style={{ color: '#acadae', fontFamily: FONT_UI }}>
              <CreditCard size={10} strokeWidth={1.5} className="inline mr-1" />
              Keuangan
            </p>

            <div className="flex flex-col gap-2">
              {[
                { label: 'Total Harga',  value: formatRupiah(order.total_price) },
                { label: 'Sudah Bayar',  value: formatRupiah(order.total_paid) },
                { label: 'Sisa Tagihan', value: formatRupiah(sisa), highlight: sisa > 0 },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>{label}</span>
                  <span
                    className="text-[13px] font-medium"
                    style={{
                      fontFamily: FONT_MONO,
                      color: highlight ? '#f87171' : '#ffffff',
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar pembayaran */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>Lunas</span>
                <span className="text-[11px]" style={{ color: '#acadae', fontFamily: FONT_MONO }}>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#34353c' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progress === 100 ? '#34d399' : '#83c3ff',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Update status form */}
          <div
            className="rounded-[8px] p-4 flex flex-col gap-4"
            style={{
              backgroundColor: '#26272d',
              boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset',
            }}
          >
            <p className="text-[11px] uppercase tracking-widest" style={{ color: '#acadae', fontFamily: FONT_UI }}>
              <FileText size={10} strokeWidth={1.5} className="inline mr-1" />
              Update Status
            </p>

            <form ref={formRef} action={formAction} className="flex flex-col gap-3">
              <input type="hidden" name="orderId" value={order.id} />

              {/* Status select */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="status-select"
                  className="text-[12px]"
                  style={{ color: '#acadae', fontFamily: FONT_UI }}
                >
                  Status Baru
                </label>
                <select
                  id="status-select"
                  name="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full h-9 px-3 text-[13px] outline-none transition-colors"
                  style={{
                    backgroundColor: '#1b1d1f',
                    color: '#ffffff',
                    border: '1px solid #34353c',
                    borderRadius: '4px',
                    fontFamily: FONT_UI,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#83c3ff'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#34353c'; }}
                >
                  <option value="" disabled style={{ backgroundColor: '#1b1d1f' }}>
                    — Pilih status —
                  </option>
                  {STATUS_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value} style={{ backgroundColor: '#1b1d1f' }}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input total harga — muncul saat status = finish */}
              {isFinish && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="total-price"
                    className="text-[12px]"
                    style={{ color: '#acadae', fontFamily: FONT_UI }}
                  >
                    Total Harga Final (IDR)
                  </label>
                  <input
                    id="total-price"
                    name="totalPrice"
                    type="number"
                    min="0"
                    step="1000"
                    defaultValue={order.total_price ?? ''}
                    placeholder="Contoh: 1500000"
                    className="w-full h-9 px-3 text-[13px] outline-none transition-colors"
                    style={{
                      backgroundColor: '#1b1d1f',
                      color: '#ffffff',
                      border: '1px solid #34d399',
                      borderRadius: '4px',
                      fontFamily: FONT_MONO,
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#34d399'; }}
                  />
                  <p className="text-[11px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
                    Masukkan total harga untuk menyelesaikan pesanan.
                  </p>
                </div>
              )}

              {/* Feedback banner */}
              {actionState.status !== 'idle' && (
                <div
                  className="flex items-start gap-2 p-3 rounded-[4px] text-[12px]"
                  style={{
                    backgroundColor: actionState.status === 'success'
                      ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
                    border: `1px solid ${actionState.status === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                    color: actionState.status === 'success' ? '#34d399' : '#f87171',
                    fontFamily: FONT_UI,
                  }}
                >
                  {actionState.status === 'success'
                    ? <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
                    : <AlertCircle size={13} className="shrink-0 mt-0.5" />}
                  {actionState.message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!selectedStatus || selectedStatus === order.status}
                className="h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  border: '1px solid #83c3ff',
                  color: '#ffffff',
                  backgroundColor: 'transparent',
                  fontFamily: FONT_UI,
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#83c3ff';
                    e.currentTarget.style.color = '#080809';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PesananClient
══════════════════════════════════════════════════════════════ */
interface PesananClientProps {
  orders: OrderSummary[];
  activeFilter: string;
}

export default function PesananClient({ orders, activeFilter }: PesananClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);

  const setFilter = useCallback(
    (val: string) => {
      const p = new URLSearchParams(searchParams.toString());
      if (val === 'all') p.delete('filter');
      else p.set('filter', val);
      router.push(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <>
      {/* ── Filter Tabs ─────────────────────────────────── */}
      <div
        className="flex items-center gap-0 border-b overflow-x-auto no-scrollbar"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        role="tablist"
        aria-label="Filter status pesanan"
      >
        {FILTER_TABS.map(({ label, value }) => {
          const isActive = activeFilter === value;
          return (
            <button
              key={value}
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(value)}
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

      {/* ── Tabel ────────────────────────────────────────── */}
      {orders.length === 0 ? (
        <div
          className="flex items-center justify-center h-48 rounded-[8px]"
          style={{
            backgroundColor: '#1b1d1f',
            boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset',
          }}
        >
          <p className="text-[14px]" style={{ color: '#acadae', fontFamily: FONT_UI }}>
            Tidak ada pesanan.
          </p>
        </div>
      ) : (
        <div
          className="rounded-[8px] overflow-hidden"
          style={{
            backgroundColor: '#1b1d1f',
            boxShadow: 'rgba(255,255,255,0.08) 0 0 0 1px inset',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* thead */}
              <thead>
                <tr>
                  {['No. Order', 'Customer', 'Jenis & Jumlah', 'Deadline', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.06em] whitespace-nowrap"
                      style={{
                        color: '#acadae',
                        fontFamily: FONT_UI,
                        borderBottom: '1px solid #34353c',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* tbody */}
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer transition-colors duration-100 group"
                    style={{
                      borderBottom: i < orders.length - 1 ? '1px solid #34353c' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(60,61,64,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSelectedOrder(order); }}
                    aria-label={`Buka detail pesanan ${order.order_number}`}
                  >
                    {/* No. Order */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[12px]" style={{ color: '#83c3ff', fontFamily: FONT_MONO }}>
                        {order.order_number ?? '—'}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3 max-w-[160px]">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className="text-[13px] font-medium text-white truncate block"
                          style={{ fontFamily: FONT_UI }}
                          title={order.client_name}
                        >
                          {order.client_name}
                        </span>
                      </div>
                    </td>

                    {/* Jenis & Jumlah */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <span
                        className="text-[13px] truncate block"
                        style={{ color: '#acadae', fontFamily: FONT_UI }}
                        title={order.item_name}
                      >
                        {order.item_name}
                      </span>
                      <span className="text-[11px]" style={{ color: '#34353c', fontFamily: FONT_MONO }}>
                        {order.quantity} pcs
                      </span>
                    </td>

                    {/* Deadline */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_MONO }}>
                        {order.due_date ? formatRelativeTime(order.due_date) : '—'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Chevron */}
                    <td className="px-3 py-3 w-8">
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-40 transition-opacity"
                        style={{ color: '#acadae' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────── */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
