'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function markAsRead(id: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (!error) {
    revalidatePath('/admin', 'layout');
  }
}

export async function markAllAsRead() {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false);

  if (!error) {
    revalidatePath('/admin', 'layout');
  }
}

// ─── Automated Notification Logic ──────────────────────────────────────────

export async function createNotification(
  type: 'order' | 'deadline' | 'stock' | 'system',
  title: string,
  message: string,
  referenceType: string,
  referenceId: string,
  priority: 'normal' | 'urgent' = 'normal'
) {
  const supabase = createServerSupabaseClient();
  
  // Anti-spam: Cek apakah ada notifikasi untuk entitas yang sama dalam 24 jam terakhir
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { data: existing } = await supabase
    .from('notifications')
    .select('id')
    .eq('type', type)
    .eq('metadata->>referenceType', referenceType)
    .eq('metadata->>referenceId', referenceId)
    .gte('created_at', oneDayAgo)
    .limit(1);

  if (existing && existing.length > 0) {
    // Sudah ada notifikasi serupa dalam 24 jam terakhir, skip
    return null;
  }

  const { error } = await supabase
    .from('notifications')
    .insert({
      type,
      title,
      message,
      priority,
      metadata: { referenceType, referenceId },
      is_read: false,
      user_id: null,
      link: null
    });

  if (error) console.error('[Notification Error]', error.message);
  return error ? null : true;
}

export async function checkAndCreateDeadlineAlerts() {
  const supabase = createServerSupabaseClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Ambil order yang statusnya masih aktif (belum selesai)
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, deadline_date, status')
    .in('status', ['pending', 'process', 'qc'])
    .not('deadline_date', 'is', null);

  if (!orders) return;

  for (const order of orders) {
    const deadline = new Date(order.deadline_date!);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 3 || diffDays === 1) {
      await createNotification(
        'deadline',
        `Tenggat Waktu: H-${diffDays} (${order.order_number})`,
        `Pesanan ${order.customer_name} mendekati batas waktu pengiriman pada ${deadline.toLocaleDateString('id-ID')}.`,
        'order',
        order.id,
        diffDays === 1 ? 'urgent' : 'normal'
      );
    }
  }
}

export async function checkAndCreateStockAlerts() {
  const supabase = createServerSupabaseClient();
  
  const { data: materials } = await supabase
    .from('materials')
    .select('id, name, stock, min_stock, unit')
    .not('min_stock', 'is', null);

  if (!materials) return;

  for (const mat of materials) {
    if (mat.stock <= (mat.min_stock || 0)) {
      await createNotification(
        'stock',
        `Peringatan Stok Tipis: ${mat.name}`,
        `Stok saat ini ${mat.stock} ${mat.unit} (Minimum: ${mat.min_stock} ${mat.unit}). Silakan lakukan pengadaan bahan.`,
        'material',
        mat.id,
        'urgent'
      );
    }
  }
}

export async function createNewOrderNotification(orderId: string, customerName: string, orderNumber: string) {
  await createNotification(
    'order',
    'Pesanan Baru Masuk',
    `Pesanan ${orderNumber} dari ${customerName} membutuhkan konfirmasi Anda.`,
    'order',
    orderId,
    'normal'
  );
}
