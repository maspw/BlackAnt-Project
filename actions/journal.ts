'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export type ActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

/* ─── Validation ─────────────────────────────────────────────── */
const JournalSchema = z.object({
  date:        z.string().min(1, 'Tanggal wajib diisi.'),
  description: z.string().min(2, 'Keterangan minimal 2 karakter.').max(200),
  type:        z.enum(['income', 'expense']),
  amount:      z.coerce.number().positive('Jumlah harus lebih dari 0.'),
  account:     z.string().max(60).optional(),
  notes:       z.string().max(300).optional(),
});

/* ─── addJournalEntry ─────────────────────────────────────────── */
export async function addJournalEntry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = JournalSchema.safeParse({
    date:        formData.get('date'),
    description: formData.get('description'),
    type:        formData.get('type'),
    amount:      formData.get('amount'),
    account:     formData.get('account') || undefined,
    notes:       formData.get('notes')   || undefined,
  });

  if (!result.success) {
    const msgs = result.error.flatten().fieldErrors;
    return { status: 'error', message: Object.values(msgs).flat()[0] ?? 'Input tidak valid.' };
  }

  const { date, description, type, amount, account, notes } = result.data;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('journal_entries').insert({
    date,
    description,
    type,
    amount,
    account:        account ?? null,
    order_id:       null,
    transaction_id: null,
    notes:          notes ?? null,
  });

  if (error) {
    return { status: 'error', message: `Gagal menyimpan: ${error.message}` };
  }

  revalidatePath('/admin/keuangan');
  revalidatePath('/admin/dashboard');

  return {
    status:  'success',
    message: `Entri "${description}" berhasil dicatat.`,
  };
}
