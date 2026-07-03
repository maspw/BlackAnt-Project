'use server';

import { z } from 'zod';

/* ─── Constants ─────────────────────────────────────────────── */
const WA_NUMBER = '6285731813118';

/* ─── Zod Schema ────────────────────────────────────────────── */
const InquirySchema = z.object({
  nama: z
    .string({ required_error: 'Nama wajib diisi.' })
    .min(2, 'Nama minimal 2 karakter.')
    .max(100, 'Nama terlalu panjang.'),

  whatsapp: z
    .string({ required_error: 'Nomor WhatsApp wajib diisi.' })
    .min(8, 'Nomor WhatsApp tidak valid.')
    .max(15, 'Nomor WhatsApp tidak valid.')
    .regex(/^[0-9+\-\s()]+$/, 'Nomor WhatsApp hanya boleh berisi angka.'),

  jenis: z
    .string({ required_error: 'Jenis pakaian wajib dipilih.' })
    .min(1, 'Jenis pakaian wajib dipilih.'),

  jumlah: z
    .string({ required_error: 'Estimasi jumlah wajib diisi.' })
    .min(1, 'Estimasi jumlah wajib diisi.')
    .refine((val) => {
      const n = Number(val);
      return !isNaN(n) && n > 0;
    }, 'Jumlah harus berupa angka lebih dari 0.'),

  detail: z
    .string({ required_error: 'Detail pesanan wajib diisi.' })
    .min(10, 'Detail pesanan minimal 10 karakter.')
    .max(1000, 'Detail pesanan maksimal 1000 karakter.'),
});

/* ─── Types ─────────────────────────────────────────────────── */
export type InquiryFormFields = z.infer<typeof InquirySchema>;

export type InquiryActionState = {
  status: 'idle' | 'success' | 'error';
  /** URL WhatsApp yang siap dibuka di client (hanya saat status = 'success') */
  waUrl?: string;
  /** Error per-field dari validasi Zod */
  fieldErrors?: Partial<Record<keyof InquiryFormFields, string[]>>;
  /** Error umum (non-field) */
  message?: string;
};

/* ─── Helper: format pesan WhatsApp ────────────────────────── */
function formatWaMessage(data: InquiryFormFields): string {
  return [
    `Halo, saya *${data.nama}*.`,
    ``,
    `Saya ingin memesan *${data.jenis}* sebanyak *${data.jumlah} pcs*.`,
    ``,
    `📋 *Detail Pesanan:*`,
    data.detail,
    ``,
    `📞 Nomor saya: ${data.whatsapp}`,
  ].join('\n');
}

/* ─── Server Action ─────────────────────────────────────────── */
/**
 * submitInquiry — Server Action yang digunakan bersama useActionState.
 *
 * Flow:
 * 1. Parse FormData ke object
 * 2. Validasi dengan Zod
 * 3. Format pesan WhatsApp
 * 4. Return { status: 'success', waUrl } → client buka via window.open()
 *
 * Kenapa tidak redirect() ke WhatsApp langsung?
 * Server Actions tidak bisa redirect ke URL eksternal (keamanan).
 * Kita return URL-nya ke client, lalu client yang membuka.
 */
export async function submitInquiry(
  _prevState: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  // 1. Ambil semua field dari FormData
  const raw = {
    nama:      formData.get('nama'),
    whatsapp:  formData.get('whatsapp'),
    jenis:     formData.get('jenis'),
    jumlah:    formData.get('jumlah'),
    detail:    formData.get('detail'),
  };

  // 2. Validasi dengan Zod
  const result = InquirySchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors as Partial<
      Record<keyof InquiryFormFields, string[]>
    >;
    return {
      status: 'error',
      fieldErrors,
      message: 'Mohon periksa kembali isian form di atas.',
    };
  }

  // 3. Format pesan dan build URL
  const message = formatWaMessage(result.data);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  // 4. Return URL ke client
  return { status: 'success', waUrl };
}
