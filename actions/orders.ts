'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { OrderStatus } from '@/types/database';
import { checkAndCreateDeadlineAlerts, checkAndCreateStockAlerts } from './notifications';

/* ─── Validation ─────────────────────────────────────────────── */
const UpdateStatusSchema = z.object({
  orderId:    z.string().uuid('ID order tidak valid.'),
  status:     z.enum(['pending', 'confirmed', 'process', 'qc', 'shipping', 'finish', 'cancelled']),
  totalPrice: z.coerce.number().positive('Harga harus lebih dari 0.').optional(),
});

export type UpdateStatusState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

/* ─── Server Action: updateOrderStatus ───────────────────────── */
export async function updateOrderStatus(
  _prev: UpdateStatusState,
  formData: FormData,
): Promise<UpdateStatusState> {
  const raw = {
    orderId:    formData.get('orderId'),
    status:     formData.get('status'),
    totalPrice: formData.get('totalPrice') || undefined,
  };

  const result = UpdateStatusSchema.safeParse(raw);
  if (!result.success) {
    const msg = result.error.flatten().fieldErrors;
    return {
      status: 'error',
      message: Object.values(msg).flat()[0] ?? 'Input tidak valid.',
    };
  }

  const { orderId, status, totalPrice } = result.data;

  const supabase = createServerSupabaseClient();

  const updatePayload: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  // Jika finish dan totalPrice diisi, update total_price
  if (status === 'finish' && totalPrice != null) {
    updatePayload.total_price = totalPrice;
  }

  const { error } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId);

  if (error) {
    return { status: 'error', message: `Gagal update: ${error.message}` };
  }

  // Check alerts
  if (status === 'process' || status === 'qc' || status === 'pending') {
    await checkAndCreateDeadlineAlerts();
  }

  // Invalidate halaman pesanan
  revalidatePath('/admin/pesanan');
  revalidatePath('/admin/dashboard');

  return { status: 'success', message: `Status berhasil diubah ke "${status}".` };
}
