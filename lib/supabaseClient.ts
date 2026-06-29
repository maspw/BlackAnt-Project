import { createClient } from '@supabase/supabase-js';

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
 * Supabase browser client — singleton.
 *
 * Gunakan instance ini di Client Components dan Server Components (RSC)
 * untuk operasi yang tidak memerlukan autentikasi pengguna (public data).
 *
 * Untuk operasi yang memerlukan session/auth cookie, gunakan createServerClient
 * dari @supabase/ssr sebagai gantinya.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
