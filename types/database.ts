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
      materials: {
        Row: Material;
        Insert: MaterialInsert;
        Update: MaterialUpdate;
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
      };
      order_materials: {
        Row: OrderMaterial;
        Insert: OrderMaterialInsert;
        Update: OrderMaterialUpdate;
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: JournalEntryInsert;
        Update: JournalEntryUpdate;
      };
      transactions: {
        Row: Transaction;
        Insert: TransactionInsert;
        Update: TransactionUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      transaction_type: TransactionType;
    };
  };
}

/* ══════════════════════════════════════════════════════════════
   ADMIN TABLES
   Tabel-tabel untuk panel administrasi internal Blackant Studio.
══════════════════════════════════════════════════════════════ */

/* ─── Shared enums ───────────────────────────────────────────── */

/**
 * Status siklus hidup sebuah pesanan.
 * pending   → baru masuk, belum dikonfirmasi
 * confirmed → sudah dikonfirmasi, belum produksi
 * process   → sedang dalam proses produksi
 * qc        → quality control
 * shipping  → dikirim ke klien
 * finish    → selesai & lunas
 * cancelled → dibatalkan
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'process'
  | 'qc'
  | 'shipping'
  | 'finish'
  | 'cancelled';

/**
 * Jenis transaksi keuangan.
 * income  → pemasukan (pembayaran klien, dp, pelunasan)
 * expense → pengeluaran (beli bahan baku, ongkir, dll.)
 */
export type TransactionType = 'income' | 'expense';

export type CustomerCategory = 'vip' | 'wholesale' | 'regular' | 'retail';

/* ─── Tabel: customers ───────────────────────────────────────── */
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  category: CustomerCategory;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export type CustomerInsert = Omit<Customer, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string | null;
};

export type CustomerUpdate = Partial<CustomerInsert>;

/* ─── Tabel: materials ───────────────────────────────────────── */
/**
 * Stok bahan baku (kain, benang, sablon, dll.)
 * Digunakan untuk mencatat inventory dan menghitung HPP per order.
 */
export interface Material {
  id: string;
  /** Nama bahan, misal "Kain Cotton Combed 30s" */
  name: string;
  /** Kategori bahan, misal "Kain", "Benang", "Sablon", "Aksesori" */
  category: string | null;
  /** Satuan, misal "meter", "roll", "lusin", "pcs" */
  unit: string;
  /** Stok saat ini */
  stock: number;
  /** Harga beli per satuan (IDR) */
  unit_cost: number | null;
  /** Stok minimum sebelum alert reorder */
  min_stock: number | null;
  /** Catatan tambahan (supplier, kode SKU, dll.) */
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export type MaterialInsert = Omit<Material, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string | null;
};

export type MaterialUpdate = Partial<MaterialInsert>;

/* ─── Tabel: orders ──────────────────────────────────────────── */
/**
 * Master tabel pesanan dari klien.
 * Setiap order memiliki banyak order_materials (detail bahan)
 * dan banyak transactions (riwayat pembayaran).
 */
export interface Order {
  id: string;
  /** Nomor pesanan unik, misal "BLK-2024-0042" */
  order_number: string;
  /** Nama lengkap klien */
  client_name: string;
  /** Nomor WhatsApp klien (format 628xxx) */
  client_wa: string | null;
  /** Nama produk / item yang dipesan */
  item_name: string;
  /** Kategori produk, misal "Kaos", "Polo", "Hoodie" */
  category: string | null;
  /** Total kuantitas (pcs) */
  quantity: number;
  /** Harga jual per pcs (IDR) */
  price_per_unit: number | null;
  /** Total harga jual = quantity × price_per_unit */
  total_price: number | null;
  /** Total yang sudah dibayar (DP + cicilan) */
  total_paid: number;
  /** Status pesanan */
  status: OrderStatus;
  /** Tanggal estimasi selesai produksi */
  due_date: string | null;
  /** Detail / catatan tambahan dari klien */
  notes: string | null;
  /** URL gambar desain / referensi */
  design_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string | null;
};

export type OrderUpdate = Partial<OrderInsert>;

/* ─── Tabel: order_materials ─────────────────────────────────── */
/**
 * Bahan baku yang dipakai pada satu pesanan (many-to-many).
 * Memungkinkan perhitungan HPP (Harga Pokok Produksi) per order.
 */
export interface OrderMaterial {
  id: string;
  order_id: string;
  material_id: string;
  /** Jumlah bahan yang digunakan (dalam satuan bahan) */
  quantity_used: number;
  /** Harga beli per satuan saat pencatatan (snapshot — bisa beda dari material.unit_cost saat ini) */
  unit_cost_snapshot: number | null;
  notes: string | null;
  created_at: string;
}

export type OrderMaterialInsert = Omit<OrderMaterial, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type OrderMaterialUpdate = Partial<OrderMaterialInsert>;

/* ─── Tabel: journal_entries ─────────────────────────────────── */
/**
 * Jurnal akuntansi sederhana (single-entry).
 * Setiap baris adalah satu entri debit/kredit untuk tracking
 * arus kas harian.
 *
 * Untuk laporan laba-rugi sederhana:
 *   Laba = SUM(amount WHERE type = 'income') - SUM(amount WHERE type = 'expense')
 */
export interface JournalEntry {
  id: string;
  /** Tanggal entri (YYYY-MM-DD) */
  date: string;
  /** Deskripsi singkat, misal "DP order BLK-2024-0042" */
  description: string;
  /** income atau expense */
  type: TransactionType;
  /** Jumlah (IDR), selalu positif */
  amount: number;
  /** Kategori akun, misal "Penjualan", "Bahan Baku", "Listrik", "Transport" */
  account: string | null;
  /** Referensi ke order terkait (opsional) */
  order_id: string | null;
  /** Referensi ke transaction terkait (opsional) */
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
}

export type JournalEntryInsert = Omit<JournalEntry, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type JournalEntryUpdate = Partial<JournalEntryInsert>;

/* ─── Tabel: transactions ────────────────────────────────────── */
/**
 * Riwayat transaksi keuangan per pesanan.
 * Berbeda dari journal_entries — transactions spesifik ke order
 * dan merekam DP, cicilan, pelunasan, serta refund.
 */
export interface Transaction {
  id: string;
  /** Referensi ke orders.id */
  order_id: string;
  /** income (bayar dari klien) atau expense (pengeluaran terkait order) */
  type: TransactionType;
  /** Jumlah transaksi (IDR) */
  amount: number;
  /** Label tahapan pembayaran, misal "DP 50%", "Pelunasan", "Refund" */
  payment_stage: string | null;
  /**
   * Metode pembayaran.
   * misal: "transfer_bca", "transfer_mandiri", "cash", "qris", "gopay"
   */
  payment_method: string | null;
  /** Nomor referensi / bukti transfer */
  reference_number: string | null;
  /** URL foto bukti transfer */
  proof_url: string | null;
  notes: string | null;
  /** Tanggal transaksi terjadi */
  paid_at: string | null;
  created_at: string;
}

export type TransactionInsert = Omit<Transaction, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type TransactionUpdate = Partial<TransactionInsert>;

/* ─── Relasi / Join types (untuk query dengan relasi) ─────────── */

/** Order lengkap dengan relasi bahan baku dan transaksi */
export interface OrderWithRelations extends Order {
  order_materials?: (OrderMaterial & { material?: Material })[];
  transactions?: Transaction[];
}

/** Order ringkas untuk tampilan list/tabel */
export interface OrderSummary {
  id: string;
  order_number: string;
  client_name: string;
  item_name: string;
  quantity: number;
  total_price: number | null;
  total_paid: number;
  status: OrderStatus;
  due_date: string | null;
  created_at: string;
}

