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
