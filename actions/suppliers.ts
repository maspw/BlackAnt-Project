'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Supplier, SupplierInsert, SupplierUpdate } from '@/types/database';

/* ══════════════════════════════════════════════════════════════
   TYPES & SCHEMAS
══════════════════════════════════════════════════════════════ */
export type SupplierActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  data?: Supplier;
};

const SupplierSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.').max(100),
  contact_person: z.string().max(100).optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  email: z.string().email('Format email tidak valid.').optional().or(z.literal('')),
  address: z.string().max(300).optional().or(z.literal('')),
  category: z.string().max(100).optional().or(z.literal('')),
  rating: z.coerce.number().min(1).max(5).default(5),
  notes: z.string().max(500).optional().or(z.literal('')),
});

/* ══════════════════════════════════════════════════════════════
   FETCH FUNCTIONS
══════════════════════════════════════════════════════════════ */

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('[suppliers] fetch error:', error.message);
    return [];
  }
  return data as Supplier[];
}

/* ══════════════════════════════════════════════════════════════
   MUTATION FUNCTIONS
══════════════════════════════════════════════════════════════ */

export async function createSupplier(
  prevState: SupplierActionState,
  formData: FormData
): Promise<SupplierActionState> {
  const raw = {
    name: formData.get('name'),
    contact_person: formData.get('contact_person'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
    category: formData.get('category'),
    rating: formData.get('rating'),
    notes: formData.get('notes'),
  };

  const parsed = SupplierSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message || 'Input tidak valid',
    };
  }

  const supabase = createServerSupabaseClient();
  const insertData: SupplierInsert = {
    name: parsed.data.name,
    contact_person: parsed.data.contact_person || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    address: parsed.data.address || null,
    category: parsed.data.category || null,
    rating: parsed.data.rating,
    notes: parsed.data.notes || null,
  };

  const { data, error } = await supabase
    .from('suppliers')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return { status: 'error', message: `Gagal menyimpan: ${error.message}` };
  }

  revalidatePath('/admin/supplier');
  return { status: 'success', message: 'Supplier berhasil ditambahkan!', data: data as Supplier };
}

export async function updateSupplier(
  id: string,
  prevState: SupplierActionState,
  formData: FormData
): Promise<SupplierActionState> {
  const raw = {
    name: formData.get('name'),
    contact_person: formData.get('contact_person'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
    category: formData.get('category'),
    rating: formData.get('rating'),
    notes: formData.get('notes'),
  };

  const parsed = SupplierSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message || 'Input tidak valid',
    };
  }

  const supabase = createServerSupabaseClient();
  const updateData: SupplierUpdate = {
    name: parsed.data.name,
    contact_person: parsed.data.contact_person || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    address: parsed.data.address || null,
    category: parsed.data.category || null,
    rating: parsed.data.rating,
    notes: parsed.data.notes || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('suppliers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { status: 'error', message: `Gagal memperbarui: ${error.message}` };
  }

  revalidatePath('/admin/supplier');
  return { status: 'success', message: 'Supplier berhasil diperbarui!', data: data as Supplier };
}

export async function deleteSupplier(id: string): Promise<SupplierActionState> {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) {
    return { status: 'error', message: `Gagal menghapus: ${error.message}` };
  }

  revalidatePath('/admin/supplier');
  return { status: 'success', message: 'Supplier berhasil dihapus!' };
}
