import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import PengaturanClient from './PengaturanClient';

export const metadata: Metadata = { title: 'Pengaturan & Data Management' };

export default async function PengaturanPage() {
  const supabase = createServerSupabaseClient();
  
  const [
    { count: customersCount },
    { count: ordersCount },
    { count: materialsCount },
    { count: transactionsCount }
  ] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('materials').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*', { count: 'exact', head: true })
  ]);

  return (
    <PengaturanClient 
      stats={{
        customers: customersCount || 0,
        orders: ordersCount || 0,
        materials: materialsCount || 0,
        transactions: transactionsCount || 0
      }}
    />
  );
}
