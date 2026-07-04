/**
 * app/(admin)/admin/quotation/page.tsx
 * Route: /admin/quotation
 */
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import QuotationClient from './QuotationClient';

export const metadata: Metadata = { title: 'Surat Penawaran Harga' };

export default async function QuotationPage() {
  const supabase = createServerSupabaseClient();
  const { data: customers } = await supabase.from('customers').select('id, name, phone, email, address').order('name');
  
  return (
    <div className="w-full flex flex-col gap-5 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-semibold text-white tracking-tight">Surat Penawaran Harga (Quotation)</h1>
        <p className="text-[13px] text-[#acadae]">Buat dan kelola penawaran harga untuk klien.</p>
      </div>

      <QuotationClient customers={customers ?? []} />
    </div>
  );
}
