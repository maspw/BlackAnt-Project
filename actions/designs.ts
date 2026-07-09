'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const CreateDesignSchema = z.object({
  name: z.string().min(1, 'Nama desain wajib diisi.'),
  file_url: z.string().url('URL file tidak valid.'),
  file_type: z.enum(['Logo', 'Mockup', 'Pattern', 'Reference']),
  customer_id: z.string().uuid('Customer wajib dipilih.'),
  order_id: z.string().uuid().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type DesignActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export async function createDesignRecord(
  _prev: DesignActionState,
  formData: FormData,
): Promise<DesignActionState> {
  const result = CreateDesignSchema.safeParse({
    name: formData.get('name'),
    file_url: formData.get('file_url'),
    file_type: formData.get('file_type'),
    customer_id: formData.get('customer_id'),
    order_id: formData.get('order_id') || undefined,
    notes: formData.get('notes') || undefined,
  });

  if (!result.success) {
    const msg = result.error.flatten().fieldErrors;
    return { status: 'error', message: Object.values(msg).flat()[0] ?? 'Input tidak valid.' };
  }

  const data = result.data;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('designs').insert({
    name: data.name,
    file_url: data.file_url,
    file_type: data.file_type,
    customer_id: data.customer_id,
    order_id: data.order_id || null,
    notes: data.notes || null,
    file_size: null,
  });

  if (error) {
    return { status: 'error', message: `Gagal menyimpan metadata: ${error.message}` };
  }

  revalidatePath('/admin/desain');
  return { status: 'success', message: 'Desain berhasil ditambahkan.' };
}

export async function deleteDesign(id: string, fileUrl: string) {
  const supabase = createServerSupabaseClient();
  
  // Hapus baris dari DB
  const { error } = await supabase.from('designs').delete().eq('id', id);
  if (error) {
    return { success: false, message: error.message };
  }

  // Ekstrak nama file dari URL
  const urlObj = new URL(fileUrl);
  const pathParts = urlObj.pathname.split('/');
  // Supabase storage format: /storage/v1/object/public/designs/filename.ext
  const bucketIndex = pathParts.indexOf('designs');
  if (bucketIndex !== -1) {
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    await supabase.storage.from('designs').remove([filePath]);
  }

  revalidatePath('/admin/desain');
  return { success: true };
}
