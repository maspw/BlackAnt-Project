/**
 * lib/supabase-server.ts
 *
 * Membuat Supabase client baru setiap kali dipanggil — pola yang benar
 * untuk React Server Components (RSC) agar setiap request mendapat
 * instance yang fresh, tidak berbagi state antar request.
 *
 * Gunakan file ini (bukan lib/supabaseClient.ts) di Server Components
 * dan Server Actions.
 */
import { createClient } from '@supabase/supabase-js';

export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase env vars tidak ditemukan. ' +
      'Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
      'sudah terisi di .env.local'
    );
  }

  return createClient(url, key);
}
