'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { QcRecordInsert } from '@/types/database';

export type QcActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export async function submitQcRecord(
  orderId: string,
  qcStatus: 'passed' | 'revised' | 'rejected',
  prevState: QcActionState,
  formData: FormData
): Promise<QcActionState> {
  const supabase = createServerSupabaseClient();
  
  const defectCount = parseInt(formData.get('defect_count') as string) || 0;
  const notes = formData.get('notes') as string || null;
  
  // Extract checklist data
  const checklist_data: Record<string, boolean> = {
    jahitanRapi: formData.get('jahitanRapi') === 'on',
    ukuranSesuai: formData.get('ukuranSesuai') === 'on',
    warnaSesuai: formData.get('warnaSesuai') === 'on',
    tidakAdaNoda: formData.get('tidakAdaNoda') === 'on',
    labelTerpasang: formData.get('labelTerpasang') === 'on',
  };

  const insertData: QcRecordInsert = {
    order_id: orderId,
    check_date: new Date().toISOString().split('T')[0],
    status: qcStatus,
    defect_count: defectCount,
    notes,
    checklist_data,
    inspector_name: 'Admin', // Static for now, can be dynamic based on auth
  };

  // 1. Insert QC Record
  const { error: err1 } = await supabase
    .from('qc_records')
    .insert(insertData);

  if (err1) {
    return { status: 'error', message: `Gagal menyimpan rekaman QC: ${err1.message}` };
  }

  // 2. Update Order qc_status
  const { error: err2 } = await supabase
    .from('orders')
    .update({ qc_status: qcStatus })
    .eq('id', orderId);

  if (err2) {
    return { status: 'error', message: `Gagal update status pesanan: ${err2.message}` };
  }

  revalidatePath('/admin/qc');
  return { status: 'success', message: 'Data QC berhasil disimpan.' };
}
