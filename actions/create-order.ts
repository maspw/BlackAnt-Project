'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generateOrderNumber } from '@/lib/utils-admin';

/* ─── WA config ─────────────────────────────────────────────── */
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '6285731813118';

/* ─── Schema — sama dengan inquiry tapi simpan ke DB ─────────── */
const CreateOrderSchema = z.object({
  nama: z
    .string({ required_error: 'Nama wajib diisi.' })
    .min(2, 'Nama minimal 2 karakter.')
    .max(100),

  whatsapp: z
    .string({ required_error: 'Nomor WhatsApp wajib diisi.' })
    .min(8, 'Nomor WhatsApp tidak valid.')
    .max(15)
    .regex(/^[0-9+\-\s()]+$/, 'Nomor hanya boleh berisi angka.'),

  jenis: z.string({ required_error: 'Jenis pakaian wajib dipilih.' }).min(1),

  jumlah: z.coerce
    .number({ required_error: 'Jumlah wajib diisi.' })
    .int()
    .positive('Jumlah harus lebih dari 0.'),

  detail: z
    .string({ required_error: 'Detail pesanan wajib diisi.' })
    .min(10, 'Detail minimal 10 karakter.')
    .max(1000),
});

export type CreateOrderFields = z.infer<typeof CreateOrderSchema>;

export type CreateOrderState = {
  status: 'idle' | 'error';
  fieldErrors?: Partial<Record<keyof CreateOrderFields, string[]>>;
  message?: string;
};

/* ─── Normalise nomor WA → format 628xxx ────────────────────── */
function normaliseWa(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (digits.startsWith('62')) return digits;
  return '62' + digits;
}

/* ─── Server Action: createOrder ────────────────────────────── */
/**
 * Flow:
 * 1. Validasi Zod
 * 2. Ambil COUNT orders untuk generate nomor urut
 * 3. INSERT ke tabel orders (status='pending')
 * 4. redirect() ke /kontak/success?order=[ORDER_NUMBER]
 *    (redirect server-side: aman, tidak expose DB id)
 */
export async function createOrder(
  _prev: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> {
  /* ── 1. Validasi ────────────────────────────────────────── */
  const raw = {
    nama:     formData.get('nama'),
    whatsapp: formData.get('whatsapp'),
    jenis:    formData.get('jenis'),
    jumlah:   formData.get('jumlah'),
    detail:   formData.get('detail'),
  };

  const result = CreateOrderSchema.safeParse(raw);

  if (!result.success) {
    return {
      status: 'error',
      fieldErrors: result.error.flatten().fieldErrors as Partial<
        Record<keyof CreateOrderFields, string[]>
      >,
      message: 'Mohon periksa kembali isian form.',
    };
  }

  const { nama, whatsapp, jenis, jumlah, detail } = result.data;
  const supabase = createServerSupabaseClient();

  /* ── 2. Generate order number ───────────────────────────── */
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const sequence    = (count ?? 0) + 1;
  const orderNumber = generateOrderNumber(sequence);
  const clientWa    = normaliseWa(whatsapp);

  /* ── 3. Insert order ────────────────────────────────────── */
  const { error } = await supabase.from('orders').insert({
    order_number:  orderNumber,
    client_name:   nama,
    client_wa:     clientWa,
    item_name:     jenis,
    category:      jenis,
    quantity:      jumlah,
    notes:         detail,
    status:        'pending',
    total_paid:    0,
    price_per_unit:null,
    total_price:   null,
    due_date:      null,
    design_url:    null,
  });

  if (error) {
    return {
      status: 'error',
      message: `Gagal menyimpan pesanan: ${error.message}`,
    };
  }

  /* ── 4. Redirect ke halaman sukses ──────────────────────── */
  // Redirect tidak bisa di dalam try/catch — panggil di luar error block
  redirect(`/kontak/success?order=${encodeURIComponent(orderNumber)}&wa=${clientWa}&item=${encodeURIComponent(jenis)}&qty=${jumlah}`);
}
