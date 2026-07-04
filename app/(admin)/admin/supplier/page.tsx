/**
 * app/(admin)/admin/supplier/page.tsx
 * Route: /admin/supplier — Server Component
 */
import type { Metadata } from 'next';
import { getSuppliers } from '@/actions/suppliers';
import SupplierClient from './SupplierClient';

export const metadata: Metadata = { title: 'Manajemen Pemasok (Supplier)' };

export default async function SupplierPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="w-full flex flex-col gap-5 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-semibold text-white tracking-tight">Manajemen Pemasok</h1>
        <p className="text-[13px] text-[#acadae]">Kelola data supplier dan riwayat bahan baku.</p>
      </div>

      <SupplierClient data={suppliers} />
    </div>
  );
}
