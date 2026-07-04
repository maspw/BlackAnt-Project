/**
 * app/(admin)/admin/qc/page.tsx
 * Route: /admin/qc — Server Component
 */
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import QcClient from './QcClient';
import type { Order, QcRecord } from '@/types/database';

export const metadata: Metadata = { title: 'Quality Control (QC)' };

export default async function QcPage() {
  const supabase = createServerSupabaseClient();
  
  // 1. Ambil order dengan status finish/shipping (atau qc jika user men-set status ke qc)
  // Untuk amannya, kita fetch yang statusnya berpotensi sudah beres dijahit/diproduksi
  const { data: orders, error: errOrders } = await supabase
    .from('orders')
    .select('*')
    .in('status', ['process', 'qc', 'finish', 'shipping'])
    .order('created_at', { ascending: false });

  if (errOrders) console.error('[qc] fetch orders error:', errOrders.message);

  // 2. Ambil riwayat QC
  const { data: records, error: errRecords } = await supabase
    .from('qc_records')
    .select('*')
    .order('created_at', { ascending: false });

  if (errRecords) console.error('[qc] fetch records error:', errRecords.message);

  return (
    <div className="w-full flex flex-col gap-5 pb-10 min-h-[calc(100vh-100px)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-semibold text-white tracking-tight">Quality Control & Inspeksi</h1>
        <p className="text-[13px] text-[#acadae]">Evaluasi kualitas produk sebelum pengiriman ke pelanggan.</p>
      </div>

      <QcClient 
        orders={(orders ?? []) as Order[]} 
        qcRecords={(records ?? []) as QcRecord[]} 
      />
    </div>
  );
}
