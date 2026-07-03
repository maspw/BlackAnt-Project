/**
 * lib/supabase-server.ts
 *
 * Factory function untuk Supabase client di React Server Components (RSC).
 *
 * Membuat instance BARU setiap kali dipanggil — ini pola yang benar untuk RSC
 * agar tidak ada shared state antar request yang masuk secara bersamaan.
 *
 * Jangan gunakan singleton (lib/supabaseClient.ts) di Server Components.
 *
 * Contoh penggunaan di RSC:
 *   const supabase = createServerSupabaseClient();
 *   const { data } = await supabase.from('products').select('*');
 *   // data diinfer sebagai Product[] secara otomatis
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

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

  return createClient<Database>(url, key);
}
