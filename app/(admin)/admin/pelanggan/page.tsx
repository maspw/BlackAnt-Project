/**
 * app/(admin)/admin/pelanggan/page.tsx
 * Route: /admin/pelanggan — Server Component
 */
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Customer } from '@/types/database';
import PelangganClient, { type CustomerWithStats } from './PelangganClient';

export const metadata: Metadata = { title: 'Pelanggan (CRM)' };

const FONT_UI = 'Inter, system-ui, sans-serif';

/* ─── Helper untuk nomor telp ───────────────────────────────── */
function normalizeWa(wa: string | null): string {
  if (!wa) return '';
  const digits = wa.replace(/\D/g, '');
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (digits.startsWith('62')) return digits;
  return '62' + digits;
}

/* ─── Data Fetching ─────────────────────────────────────────── */
async function getCustomerCRMData(): Promise<CustomerWithStats[]> {
  const supabase = createServerSupabaseClient();

  // 1. Fetch Customers
  const { data: customersData, error: errC } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (errC) {
    console.error('[crm] getCustomers error:', errC.message);
    return [];
  }
  const customers = (customersData ?? []) as Customer[];

  // 2. Fetch Orders untuk stats
  // Hanya ambil field yang diperlukan untuk efisiensi
  const { data: ordersData, error: errO } = await supabase
    .from('orders')
    .select('customer_wa, total_price, created_at, status');

  if (errO) {
    console.error('[crm] getOrders error:', errO.message);
  }
  const orders = ordersData ?? [];

  // 3. Gabungkan dan hitung statistik
  const crmData: CustomerWithStats[] = customers.map((c) => {
    const cPhone = normalizeWa(c.phone);
    const customerOrders = orders.filter(
      (o) => normalizeWa(o.customer_wa) === cPhone
    );

    const validOrders = customerOrders.filter((o) => o.status !== 'cancelled');

    const total_order = validOrders.length;
    const total_belanja = validOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
    
    // Sort by created_at DESC untuk mendapatkan last order
    const lastOrderDate = customerOrders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]?.created_at || null;

    return {
      ...c,
      total_order,
      total_belanja,
      last_order: lastOrderDate,
    };
  });

  return crmData;
}

/* ─── Page ──────────────────────────────────────────────────── */
export default async function PelangganPage() {
  const customers = await getCustomerCRMData();

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">

      {/* ── Page header ──────────────────────────────── */}
      <div>
        <p className="text-[12px] uppercase tracking-widest mb-1" style={{ color: '#acadae', fontFamily: FONT_UI }}>
          CRM & Relasi
        </p>
        <h2 className="text-[24px] font-medium text-white leading-none" style={{ fontFamily: FONT_UI }}>
          Manajemen Pelanggan
        </h2>
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

      {/* ── Client Component ──────────────────────────── */}
      <PelangganClient data={customers} />

    </div>
  );
}
