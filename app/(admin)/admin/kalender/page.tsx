/**
 * app/(admin)/admin/kalender/page.tsx
 * Route: /admin/kalender — Server Component
 */
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import KalenderClient from './KalenderClient';
import type { Order } from '@/types/database';

export const metadata: Metadata = { title: 'Kalender Produksi' };

export default async function KalenderPage() {
  const supabase = createServerSupabaseClient();
  
  // Ambil order yang memiliki deadline_date
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, product_type, quantity, status, deadline_date')
    .not('deadline_date', 'is', null);

  if (error) {
    console.error('[kalender] fetch error:', error.message);
  }

  return (
    <div className="w-full flex flex-col gap-5 pb-10 h-full min-h-[calc(100vh-100px)]">
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-[20px] font-semibold text-white tracking-tight">Kalender Produksi</h1>
        <p className="text-[13px] text-[#acadae]">Jadwal produksi dan tenggat waktu pesanan.</p>
      </div>

      <KalenderClient orders={(orders ?? []) as Order[]} />
    </div>
  );
}
