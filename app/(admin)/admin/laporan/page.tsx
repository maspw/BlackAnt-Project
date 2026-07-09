import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import LaporanClient from './LaporanClient';

export const metadata: Metadata = { title: 'Laporan & Analytics' };

export default async function LaporanPage() {
  const supabase = createServerSupabaseClient();
  
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id, 
      created_at, 
      status, 
      total_price, 
      product_type, 
      quantity, 
      customer_name,
      order_materials ( total_cost )
    `)
    .order('created_at', { ascending: false });

  return <LaporanClient initialOrders={orders || []} />;
}
