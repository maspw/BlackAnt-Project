'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { checkAndCreateStockAlerts } from './notifications';

/* ══════════════════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════════════ */
export type ActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

/* ══════════════════════════════════════════════════════════════
   restockMaterial
   1. Tambah stock di tabel materials
   2. Insert journal_entry sebagai expense (karena transactions
      membutuhkan order_id, restock lebih tepat di journal_entries)
══════════════════════════════════════════════════════════════ */
const RestockSchema = z.object({
  materialId:  z.string().uuid('ID bahan tidak valid.'),
  materialName:z.string().min(1),
  qty:         z.coerce.number().int().positive('Jumlah harus bilangan bulat positif.'),
  unitCost:    z.coerce.number().nonnegative().optional(),
  notes:       z.string().max(200).optional(),
});

export async function restockMaterial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = RestockSchema.safeParse({
    materialId:   formData.get('materialId'),
    materialName: formData.get('materialName'),
    qty:          formData.get('qty'),
    unitCost:     formData.get('unitCost') || undefined,
    notes:        formData.get('notes') || undefined,
  });

  if (!result.success) {
    const msg = result.error.flatten().fieldErrors;
    return { status: 'error', message: Object.values(msg).flat()[0] ?? 'Input tidak valid.' };
  }

  const { materialId, materialName, qty, unitCost, notes } = result.data;
  const supabase = createServerSupabaseClient();

  // 1. Ambil stok saat ini
  const { data: mat, error: fetchErr } = await supabase
    .from('materials')
    .select('stock, unit_cost')
    .eq('id', materialId)
    .single();

  if (fetchErr || !mat) {
    return { status: 'error', message: 'Bahan tidak ditemukan.' };
  }

  const newStock  = mat.stock + qty;
  const costPer   = unitCost ?? mat.unit_cost ?? 0;
  const totalCost = qty * costPer;

  // 2. Update stok material
  const { error: updateErr } = await supabase
    .from('materials')
    .update({ stock: newStock, updated_at: new Date().toISOString() })
    .eq('id', materialId);

  if (updateErr) {
    return { status: 'error', message: `Gagal update stok: ${updateErr.message}` };
  }

  // 3. Insert journal entry (expense) — restock tidak terkait order
  if (totalCost > 0) {
    const { error: journalErr } = await supabase.from('journal_entries').insert({
      date:        new Date().toISOString().split('T')[0],
      description: `Restock: ${materialName} (+${qty} unit)`,
      type:        'expense',
      amount:      totalCost,
      account:     'Bahan Baku',
      order_id:    null,
      transaction_id: null,
      notes:       notes ?? `Auto-insert dari fitur Restock panel admin`,
    });

    if (journalErr) {
      // Tidak rollback stok, tapi beri warning
      return {
        status: 'success',
        message: `Stok diperbarui, tapi jurnal gagal dicatat: ${journalErr.message}`,
      };
    }
  }

  // 4. Trigger stock alerts
  await checkAndCreateStockAlerts();

  revalidatePath('/admin/bahan');
  revalidatePath('/admin/dashboard');

  return {
    status: 'success',
    message: `+${qty} unit berhasil ditambahkan. Stok sekarang: ${newStock}`,
  };
}

/* ══════════════════════════════════════════════════════════════
   addMaterial
   Insert bahan baru ke tabel materials
══════════════════════════════════════════════════════════════ */
const AddMaterialSchema = z.object({
  name:     z.string().min(2, 'Nama minimal 2 karakter.').max(100),
  category: z.string().max(50).optional(),
  unit:     z.string().min(1, 'Satuan wajib diisi.').max(20),
  stock:    z.coerce.number().nonnegative().default(0),
  unitCost: z.coerce.number().nonnegative().optional(),
  minStock: z.coerce.number().nonnegative().optional(),
  notes:    z.string().max(300).optional(),
});

export async function addMaterial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = AddMaterialSchema.safeParse({
    name:     formData.get('name'),
    category: formData.get('category') || undefined,
    unit:     formData.get('unit'),
    stock:    formData.get('stock') || 0,
    unitCost: formData.get('unitCost') || undefined,
    minStock: formData.get('minStock') || undefined,
    notes:    formData.get('notes') || undefined,
  });

  if (!result.success) {
    const msg = result.error.flatten().fieldErrors;
    return { status: 'error', message: Object.values(msg).flat()[0] ?? 'Input tidak valid.' };
  }

  const { name, category, unit, stock, unitCost, minStock, notes } = result.data;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('materials').insert({
    name,
    category:  category ?? null,
    unit,
    stock,
    unit_cost: unitCost ?? null,
    min_stock: minStock ?? null,
    notes:     notes ?? null,
  });

  if (error) {
    return { status: 'error', message: `Gagal menyimpan: ${error.message}` };
  }

  revalidatePath('/admin/bahan');
  // Trigger stock alerts
  await checkAndCreateStockAlerts();

  revalidatePath('/admin/bahan');
  return { status: 'success', message: 'Data bahan berhasil diperbarui.' };
}
