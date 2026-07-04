/**
 * app/(admin)/admin/dashboard/page.tsx
 * Route: /admin/dashboard — Server Component
 *
 * Trading-terminal style dashboard: dense, data-first, monochrome.
 */
import type { Metadata } from 'next';
import { CheckCircle2, AlertTriangle, ShoppingBag, Package, Wallet, Clock } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { OrderStatus } from '@/types/database';
import {
  formatRupiah,
  formatTanggalIndo,
  formatRelativeTime,
  getStatusColor,
} from '@/lib/utils-admin';

export const metadata: Metadata = { title: 'Dashboard' };

const FONT_UI   = 'Inter, system-ui, sans-serif';
const FONT_MONO = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

/* ══════════════════════════════════════════════════════════════
   Data fetching — semua parallel
══════════════════════════════════════════════════════════════ */
async function fetchDashboardData() {
  const supabase = createServerSupabaseClient();

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { count: totalActive },
    { count: needAction },
    { data: recentOrders },
    { data: lowStockMaterials },
    { data: monthlyIncome },
  ] = await Promise.all([
    // Pesanan aktif (bukan finish / cancelled)
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'confirmed', 'process', 'qc', 'shipping'] as OrderStatus[]),

    // Perlu tindakan: pending saja
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending' as OrderStatus),

    // 5 pesanan terbaru
    supabase
      .from('orders')
      .select('id, order_number, customer_name, product_type, quantity, total_price, dp_amount, status, deadline_date, created_at')
      .order('created_at', { ascending: false })
      .limit(5),

    // Bahan stok < min_stock (dan min_stock tidak null)
    supabase
      .from('materials')
      .select('id, name, unit, stock, min_stock, unit_cost')
      .not('min_stock', 'is', null),

    // Income bulan ini dari transactions
    supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'income')
      .gte('created_at', firstOfMonth),
  ]);

  // Hitung total income bulan ini
  const pendapatanBulanIni = (monthlyIncome ?? []).reduce(
    (sum, t) => sum + (t.amount ?? 0),
    0,
  );

  // Low stock: filter di JS
  const lowStock = (lowStockMaterials ?? [])
    .filter((m) => m.stock < (m.min_stock ?? 0));

  // --- Analytics Data --- //
  
  // 1. Sales 6 Months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('amount, created_at')
    .eq('type', 'income')
    .gte('created_at', sixMonthsAgo.toISOString());

  const salesByMonth: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mStr = d.toLocaleDateString('id-ID', { month: 'short' });
    salesByMonth[mStr] = 0;
  }
  
  (recentTransactions || []).forEach(tx => {
    const d = new Date(tx.created_at);
    const mStr = d.toLocaleDateString('id-ID', { month: 'short' });
    if (salesByMonth[mStr] !== undefined) {
      salesByMonth[mStr] += tx.amount || 0;
    }
  });

  const salesData = Object.entries(salesByMonth).map(([month, total]) => ({ month, total }));

  // 2. Top Customers & Categories
  const { data: allOrders } = await supabase
    .from('orders')
    .select('customer_name, product_type, total_price')
    .in('status', ['process', 'qc', 'shipping', 'finish']);

  const customerSpend: Record<string, number> = {};
  const categoryCount: Record<string, number> = {};

  (allOrders || []).forEach(o => {
    // Customer spend
    if (o.customer_name) {
      customerSpend[o.customer_name] = (customerSpend[o.customer_name] || 0) + (o.total_price || 0);
    }
    // Category count
    if (o.product_type) {
      categoryCount[o.product_type] = (categoryCount[o.product_type] || 0) + 1;
    }
  });

  const topCustomers = Object.entries(customerSpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, total]) => ({ name, total }));

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({ name, count }));

  return {
    totalActive: totalActive ?? 0,
    needAction: needAction ?? 0,
    recentOrders: recentOrders ?? [],
    lowStock,
    pendapatanBulanIni,
    salesData,
    topCustomers,
    topCategories,
  };
}

/* ══════════════════════════════════════════════════════════════
   Sub-components (server, no 'use client')
══════════════════════════════════════════════════════════════ */

/* ── Status Badge ──────────────────────────────────────────── */
function StatusBadge({ status }: { status: OrderStatus }) {
  const c = getStatusColor(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-[4px] border whitespace-nowrap"
      style={{
        backgroundColor: c.hex + '18',
        color: c.hex,
        borderColor: c.hex + '40',
        fontFamily: FONT_UI,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: c.hex }}
        aria-hidden="true"
      />
      {c.label}
    </span>
  );
}

/* ── Summary Card ──────────────────────────────────────────── */
interface SummaryCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accentHex: string;
  alert?: boolean;
}

function SummaryCard({ label, value, sub, icon: Icon, accentHex, alert }: SummaryCardProps) {
  return (
    <div
      className="flex flex-col gap-4 p-4 rounded-[8px]"
      style={{
        backgroundColor: '#1b1d1f',
        boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <span
          className="text-[12px] font-medium uppercase tracking-[0.06em] leading-none"
          style={{ color: '#acadae', fontFamily: FONT_UI }}
        >
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: accentHex + '18' }}
        >
          <Icon size={14} strokeWidth={1.5} style={{ color: accentHex }} aria-hidden="true" />
        </div>
      </div>

      {/* Value */}
      <p
        className="text-[32px] font-medium leading-none"
        style={{
          color: alert ? '#f87171' : '#ffffff',
          fontFamily: FONT_MONO,
        }}
      >
        {value}
      </p>

      {/* Sub text */}
      {sub && (
        <p
          className="text-[12px] leading-none"
          style={{ color: '#acadae', fontFamily: FONT_UI }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Page
══════════════════════════════════════════════════════════════ */
export default async function DashboardPage() {
  const { totalActive, needAction, recentOrders, lowStock, pendapatanBulanIni, salesData, topCustomers, topCategories } =
    await fetchDashboardData();

  const summaryCards: SummaryCardProps[] = [
    {
      label: 'Pesanan Aktif',
      value: totalActive,
      sub: 'pending · process · shipping',
      icon: ShoppingBag,
      accentHex: '#83c3ff',
    },
    {
      label: 'Perlu Tindakan',
      value: needAction,
      sub: 'status: pending',
      icon: Clock,
      accentHex: needAction > 0 ? '#f87171' : '#acadae',
      alert: needAction > 0,
    },
    {
      label: 'Stok Menipis',
      value: lowStock.length,
      sub: 'bahan di bawah minimum',
      icon: Package,
      accentHex: lowStock.length > 0 ? '#fbbf24' : '#acadae',
      alert: lowStock.length > 0,
    },
    {
      label: 'Pendapatan Bulan Ini',
      value: formatRupiah(pendapatanBulanIni, { compact: true }),
      sub: `dari transaksi income`,
      icon: Wallet,
      accentHex: '#34d399',
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1200px]">

      {/* ── Page heading ──────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <p
            className="text-[12px] uppercase tracking-widest mb-1.5 font-sans"
            style={{ color: '#acadae' }}
          >
            Overview
          </p>
          <h2
            className="text-[24px] font-medium text-white leading-none"
            style={{ fontFamily: FONT_MONO }}
          >
            Dashboard
          </h2>
        </div>
        <p
          className="text-[12px]"
          style={{
            color: '#acadae',
            fontFamily: FONT_MONO,
          }}
        >
          {formatTanggalIndo(new Date().toISOString(), { withTime: true })}
        </p>
      </div>

      {/* ── Summary cards (4 kolom) ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Bottom grid (2 kolom) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

        {/* ── Kiri: Pesanan Terbaru ──────────────────── */}
        <div
          className="rounded-[8px] overflow-hidden"
          style={{
            backgroundColor: '#1b1d1f',
            boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 h-10"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span
              className="text-[12px] font-medium uppercase tracking-[0.06em]"
              style={{ color: '#acadae', fontFamily: FONT_UI }}
            >
              Pesanan Terbaru
            </span>
            <a
              href="/admin/pesanan"
              className="text-[12px] transition-colors"
              style={{ color: '#83c3ff', fontFamily: FONT_UI }}
            >
              Lihat semua →
            </a>
          </div>

          {/* Table */}
          {recentOrders.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p
                className="text-[14px]"
                style={{ color: '#acadae', fontFamily: FONT_UI }}
              >
                Belum ada pesanan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* thead */}
                <thead>
                  <tr>
                    {['No. Order', 'Klien', 'Item', 'Total', 'Status', 'Due'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.06em] whitespace-nowrap"
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
                  {recentOrders.map((order, i) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: i < recentOrders.length - 1 ? '1px solid #34353c' : 'none',
                      }}
                    >
                      {/* No. Order */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="text-[12px]"
                          style={{
                            color: '#83c3ff',
                            fontFamily: FONT_MONO,
                          }}
                        >
                          {order.order_number ?? '—'}
                        </span>
                      </td>

                      {/* Klien */}
                      <td className="px-4 py-3 max-w-[140px]">
                        <span
                          className="text-[13px] font-medium text-white block truncate"
                          style={{ fontFamily: FONT_UI }}
                          title={order.customer_name}
                        >
                          {order.customer_name}
                        </span>
                      </td>

                      {/* Item */}
                      <td className="px-4 py-3 max-w-[160px]">
                        <span
                          className="text-[13px] block truncate"
                          style={{ color: '#acadae', fontFamily: FONT_UI }}
                          title={`${order.product_type} — ${order.quantity} pcs`}
                        >
                          {order.product_type}
                          <span className="ml-1 text-[11px]" style={{ color: '#34353c' }}>
                            ×{order.quantity}
                          </span>
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="text-[13px] text-white"
                          style={{ fontFamily: FONT_MONO }}
                        >
                          {formatRupiah(order.total_price, { compact: true })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status as OrderStatus} />
                      </td>

                      {/* Due date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[12px]" style={{ color: '#acadae', fontFamily: FONT_MONO }}>
                          {order.deadline_date
                            ? formatRelativeTime(order.deadline_date)
                            : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Kanan: Alert Bahan ─────────────────────── */}
        <div
          className="rounded-[8px] overflow-hidden"
          style={{
            backgroundColor: '#1b1d1f',
            boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 h-10"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span
              className="text-[12px] font-medium uppercase tracking-[0.06em]"
              style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Alert Bahan
            </span>
            {lowStock.length > 0 && (
              <span
                className="flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-[4px]"
                style={{
                  color: '#fbbf24',
                  backgroundColor: 'rgba(251,191,36,0.12)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                <AlertTriangle size={10} aria-hidden="true" />
                {lowStock.length} item
              </span>
            )}
          </div>

          {/* Content */}
          {lowStock.length === 0 ? (
            /* Sistem aman */
            <div className="flex flex-col items-center justify-center gap-3 h-40 px-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(52,211,153,0.12)' }}
              >
                <CheckCircle2 size={20} style={{ color: '#34d399' }} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <p
                className="text-[14px] text-center"
                style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Sistem aman
              </p>
              <p
                className="text-[12px] text-center"
                style={{ color: '#3c3d40', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Semua stok di atas minimum
              </p>
            </div>
          ) : (
            /* Daftar bahan menipis */
            <ul role="list" className="divide-y" style={{ borderColor: '#34353c' }}>
              {lowStock.map((m) => {
                const pct = m.min_stock
                  ? Math.round((m.stock / m.min_stock) * 100)
                  : 0;
                const isZero = m.stock === 0;
                return (
                  <li
                    key={m.id}
                    className="px-4 py-3 flex items-start justify-between gap-3"
                    style={{ borderBottom: '1px solid #34353c' }}
                  >
                    {/* Left */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <span
                        className="text-[13px] font-medium text-white truncate"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        {m.name}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        Min: {m.min_stock} {m.unit}
                      </span>
                    </div>

                    {/* Right: stock + bar */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className="text-[14px] font-medium"
                        style={{
                          color: isZero ? '#f87171' : '#fbbf24',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {m.stock}
                        <span
                          className="text-[11px] ml-1"
                          style={{ color: '#acadae', fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          {m.unit}
                        </span>
                      </span>

                      {/* Progress bar */}
                      <div
                        className="w-20 h-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: '#34353c' }}
                        title={`${pct}% dari minimum`}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, pct)}%`,
                            backgroundColor: isZero ? '#f87171' : '#fbbf24',
                          }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ── ANALYTICS SECTION ──────────────────────────── */}
      <div className="flex flex-col gap-5 pt-4">
        <h3 className="text-[20px] font-medium text-white" style={{ fontFamily: FONT_UI }}>Analytics</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Grafik Penjualan (Bar Chart 6 Bulan) */}
          <div 
            className="lg:col-span-2 p-5 rounded-[8px] flex flex-col gap-6"
            style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
          >
            <h4 className="text-[12px] uppercase text-[#acadae] font-medium tracking-[0.06em]">Pemasukan 6 Bulan Terakhir</h4>
            <div className="flex-1 flex items-end gap-4 h-[200px] p-4 rounded-[6px]" style={{ backgroundColor: '#141415' }}>
              {salesData.map((data, i) => {
                const maxVal = Math.max(...salesData.map(d => d.total), 1);
                const heightPct = (data.total / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 h-full group">
                    {/* Tooltip on hover */}
                    <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-[#acadae] -mb-1">
                      {formatRupiah(data.total, { compact: true })}
                    </span>
                    <div 
                      className="w-full rounded-t-[4px] transition-all duration-500 ease-out hover:opacity-80"
                      style={{ 
                        height: `${Math.max(heightPct, 1)}%`, 
                        backgroundColor: '#83c3ff',
                        minHeight: data.total > 0 ? '4px' : '1px'
                      }}
                    />
                    <span className="text-[11px] text-[#acadae] uppercase tracking-wider">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Top Categories */}
            <div 
              className="p-5 rounded-[8px] flex flex-col gap-4 flex-1"
              style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
            >
              <h4 className="text-[12px] uppercase text-[#acadae] font-medium tracking-[0.06em]">Kategori Terlaris</h4>
              <div className="flex flex-col gap-3">
                {topCategories.length === 0 ? (
                  <span className="text-[12px] text-[#acadae] italic">Belum ada data...</span>
                ) : topCategories.map((cat, i) => {
                  const maxCount = Math.max(...topCategories.map(c => c.count), 1);
                  const widthPct = (cat.count / maxCount) * 100;
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="text-white font-medium">{cat.name}</span>
                        <span className="text-[#acadae] font-mono">{cat.count} order</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#141415] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${widthPct}%`, backgroundColor: i === 0 ? '#34d399' : '#83c3ff' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Customers */}
            <div 
              className="p-5 rounded-[8px] flex flex-col gap-4 flex-1"
              style={{ backgroundColor: '#1b1d1f', boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
            >
              <h4 className="text-[12px] uppercase text-[#acadae] font-medium tracking-[0.06em]">Top Customers</h4>
              <div className="flex flex-col gap-3">
                {topCustomers.length === 0 ? (
                  <span className="text-[12px] text-[#acadae] italic">Belum ada data...</span>
                ) : topCustomers.map((cust, i) => {
                  const initials = cust.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{ backgroundColor: 'rgba(131,195,255,0.15)', color: '#83c3ff' }}
                      >
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[13px] text-white font-medium truncate">{cust.name}</span>
                        <span className="text-[12px] text-[#34d399]" style={{ fontFamily: FONT_MONO }}>
                          {formatRupiah(cust.total)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
