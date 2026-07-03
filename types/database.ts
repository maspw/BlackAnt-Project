/**
 * types/database.ts
 *
 * TypeScript interfaces yang merefleksikan schema tabel Supabase.
 * Update file ini setiap kali ada perubahan schema di Supabase dashboard.
 *
 * Pola penamaan mengikuti konvensi Supabase:
 * - Row  = data yang dikembalikan dari SELECT
 * - Insert = data yang dikirim saat INSERT (semua optional field jadi opsional)
 * - Update = data untuk UPDATE (semua field opsional)
 */

/* ─── Tabel: products ───────────────────────────────────────── */
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  /** Disimpan sebagai numeric di Supabase, bisa null jika belum diset */
  price: number | null;
  created_at: string;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type ProductUpdate = Partial<ProductInsert>;

/* ─── Tabel: portfolio ──────────────────────────────────────── */
export interface Portfolio {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  /** Urutan tampil di halaman */
  sort_order: number | null;
  created_at: string;
}

export type PortfolioInsert = Omit<Portfolio, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type PortfolioUpdate = Partial<PortfolioInsert>;

/* ─── Tipe Database — digunakan di createClient<Database>() ─── */
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      portfolio: {
        Row: Portfolio;
        Insert: PortfolioInsert;
        Update: PortfolioUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
