import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL\n' +
    'Pastikan file .env.local sudah terisi dengan URL proyek Supabase Anda.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
    'Pastikan file .env.local sudah terisi dengan Anon Key dari dashboard Supabase Anda.'
  );
}

/**
 * Supabase browser client — singleton, typed dengan Database schema.
 *
 * Gunakan instance ini di Client Components untuk operasi publik
 * (tanpa autentikasi pengguna).
 *
 * Contoh penggunaan:
 *   const { data } = await supabase.from('products').select('*');
 *   // data akan diinfer sebagai Product[] secara otomatis
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
