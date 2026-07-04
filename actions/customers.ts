'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Customer, CustomerCategory, CustomerInsert, CustomerUpdate } from '@/types/database';

/* ══════════════════════════════════════════════════════════════
   TYPES & SCHEMAS
══════════════════════════════════════════════════════════════ */
export type CustomerActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  data?: Customer;
};

const CustomerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.').max(100),
  phone: z.string().min(8, 'Nomor HP tidak valid.').max(20),
  email: z.string().email('Format email tidak valid.').optional().or(z.literal('')),
  address: z.string().max(300).optional(),
  category: z.enum(['vip', 'wholesale', 'regular', 'retail'] as const),
  notes: z.string().max(500).optional(),
});

/* ══════════════════════════════════════════════════════════════
   FETCH FUNCTIONS
══════════════════════════════════════════════════════════════ */

/**
 * getCustomers()
 * Fetch semua customers, diurutkan berdasarkan nama
 */
export async function getCustomers(): Promise<Customer[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('[customers] fetch error:', error.message);
    return [];
  }
  return data as Customer[];
}

/**
 * getCustomerByPhone()
 * Cari customer berdasarkan nomor WA
 */
export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error) return null;
  return data as Customer;
}

/* ══════════════════════════════════════════════════════════════
   MUTATION FUNCTIONS (Server Actions)
══════════════════════════════════════════════════════════════ */

/**
 * createCustomer()
 * Tambah customer baru
 */
export async function createCustomer(
  _prev: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const result = CustomerSchema.safeParse({
    name:     formData.get('name'),
    phone:    formData.get('phone'),
    email:    formData.get('email') || undefined,
    address:  formData.get('address') || undefined,
    category: formData.get('category'),
    notes:    formData.get('notes') || undefined,
  });

  if (!result.success) {
    const msgs = result.error.flatten().fieldErrors;
    return { status: 'error', message: Object.values(msgs).flat()[0] ?? 'Input tidak valid.' };
  }

  const payload: CustomerInsert = {
    ...result.data,
    email: result.data.email || null,
    address: result.data.address || null,
    notes: result.data.notes || null,
  };

  const supabase = createServerSupabaseClient();
  
  // Check nomor hp unik
  const existing = await getCustomerByPhone(payload.phone);
  if (existing) {
    return { status: 'error', message: 'Nomor WhatsApp sudah terdaftar.' };
  }

  const { data, error } = await supabase
    .from('customers')
    .insert(payload)
    .select()
    .single();

  if (error) {
    return { status: 'error', message: `Gagal menyimpan: ${error.message}` };
  }

  revalidatePath('/admin/customers'); // Asumsi path untuk manajemen customer nanti
  revalidatePath('/admin/pesanan');

  return {
    status: 'success',
    message: `Customer "${data.name}" berhasil ditambahkan.`,
    data: data as Customer,
  };
}

/**
 * updateCustomer()
 * Update data customer
 */
export async function updateCustomer(
  id: string,
  _prev: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const result = CustomerSchema.safeParse({
    name:     formData.get('name'),
    phone:    formData.get('phone'),
    email:    formData.get('email') || undefined,
    address:  formData.get('address') || undefined,
    category: formData.get('category'),
    notes:    formData.get('notes') || undefined,
  });

  if (!result.success) {
    const msgs = result.error.flatten().fieldErrors;
    return { status: 'error', message: Object.values(msgs).flat()[0] ?? 'Input tidak valid.' };
  }

  const payload: CustomerUpdate = {
    ...result.data,
    email: result.data.email || null,
    address: result.data.address || null,
    notes: result.data.notes || null,
    updated_at: new Date().toISOString(),
  };

  const supabase = createServerSupabaseClient();

  // Check nomor hp jika diganti
  const existing = await getCustomerByPhone(payload.phone!);
  if (existing && existing.id !== id) {
    return { status: 'error', message: 'Nomor WhatsApp sudah digunakan pelanggan lain.' };
  }

  const { data, error } = await supabase
    .from('customers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { status: 'error', message: `Gagal update: ${error.message}` };
  }

  revalidatePath('/admin/customers');
  revalidatePath('/admin/pesanan');

  return {
    status: 'success',
    message: `Data pelanggan berhasil diperbarui.`,
    data: data as Customer,
  };
}

/**
 * deleteCustomer()
 * Hapus customer berdasarkan ID
 */
export async function deleteCustomer(id: string): Promise<{ success: boolean; message?: string }> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('customers').delete().eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/customers');
  return { success: true };
}
