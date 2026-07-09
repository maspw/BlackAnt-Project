import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import DesainClient from './DesainClient';

export const metadata: Metadata = { title: 'Manajemen Desain' };

export default async function DesainPage() {
  const supabase = createServerSupabaseClient();

  const [
    { data: designs },
    { data: customers },
    { data: orders }
  ] = await Promise.all([
    supabase
      .from('designs')
      .select(`
        *,
        customers (id, name),
        orders (id, order_number)
      `)
      .order('created_at', { ascending: false }),
    
    supabase
      .from('customers')
      .select('id, name')
      .order('name', { ascending: true }),

    supabase
      .from('orders')
      .select('id, order_number, customer_name')
      .order('created_at', { ascending: false })
      .limit(100)
  ]);

  return (
    <DesainClient 
      initialDesigns={designs || []} 
      customers={customers || []}
      orders={orders || []}
    />
  );
}
