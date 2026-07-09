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
export type Product = {
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
export type Portfolio = {
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
        Relationships: never[];
      };
      portfolio: {
        Row: Portfolio;
        Insert: PortfolioInsert;
        Update: PortfolioUpdate;
        Relationships: never[];
      };
      materials: {
        Row: Material;
        Insert: MaterialInsert;
        Update: MaterialUpdate;
        Relationships: never[];
      };
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
        Relationships: never[];
      };
      order_materials: {
        Row: OrderMaterial;
        Insert: OrderMaterialInsert;
        Update: OrderMaterialUpdate;
        Relationships: never[];
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: JournalEntryInsert;
        Update: JournalEntryUpdate;
        Relationships: never[];
      };
      transactions: {
        Row: Transaction;
        Insert: TransactionInsert;
        Update: TransactionUpdate;
        Relationships: never[];
      };
      customers: {
        Row: Customer;
        Insert: CustomerInsert;
        Update: CustomerUpdate;
        Relationships: never[];
      };
      suppliers: {
        Row: Supplier;
        Insert: SupplierInsert;
        Update: SupplierUpdate;
        Relationships: never[];
      };
      qc_records: {
        Row: QcRecord;
        Insert: QcRecordInsert;
        Update: QcRecordUpdate;
        Relationships: never[];
      };
      notifications: {
        Row: Notification;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
        Relationships: never[];
      };
      designs: {
        Row: Design;
        Insert: DesignInsert;
        Update: DesignUpdate;
        Relationships: [
          { foreignKeyName: "designs_customer_id_fkey"; columns: ["customer_id"]; referencedRelation: "customers"; referencedColumns: ["id"]; },
          { foreignKeyName: "designs_order_id_fkey"; columns: ["order_id"]; referencedRelation: "orders"; referencedColumns: ["id"]; }
        ];
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: ActivityLogInsert;
        Update: ActivityLogUpdate;
        Relationships: never[];
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
export type Customer = {
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

/* ─── Tabel: suppliers ───────────────────────────────────────── */
export type Supplier = {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  category: string | null;
  rating: number;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type SupplierInsert = Omit<Supplier, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string | null;
};

export type SupplierUpdate = Partial<SupplierInsert>;

/* ─── Tabel: materials ───────────────────────────────────────── */
/**
 * Stok bahan baku (kain, benang, sablon, dll.)
 * Digunakan untuk mencatat inventory dan menghitung HPP per order.
 */
export type Material = {
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
export type Order = {
  id: string;
  /** Nomor pesanan unik, misal "BLK-2024-0042" */
  order_number: string;
  /** Nama lengkap klien */
  customer_name: string;
  /** Nomor WhatsApp klien (format 628xxx) */
  customer_phone: string | null;
  /** Nama produk / item yang dipesan */
  product_type: string;
  /** Total harga (Rupiah) */
  total_price: number | null;
  /** Kuantitas */
  quantity: number;
  /** Jumlah yang sudah dibayar (IDR) */
  dp_amount: number;
  /** Status pesanan */
  status: OrderStatus;
  qc_status?: 'pending' | 'passed' | 'revised' | 'rejected' | null;
  priority?: string | null;
  source?: string | null;
  /** Tanggal estimasi selesai produksi */
  deadline_date: string | null;
  /** Detail / catatan tambahan dari klien */
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string | null;
};

export type OrderUpdate = Partial<OrderInsert>;

/* ─── Tabel: qc_records ──────────────────────────────────────── */
export type QcRecord = {
  id: string;
  order_id: string | null;
  inspector_name: string | null;
  check_date: string | null;
  status: 'pending' | 'passed' | 'revised' | 'rejected';
  defect_count: number;
  notes: string | null;
  checklist_data: Record<string, boolean> | null;
  created_at: string;
}

export type QcRecordInsert = Omit<QcRecord, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type QcRecordUpdate = Partial<QcRecordInsert>;

/* ─── Tabel: notifications ───────────────────────────────────── */
export type Notification = {
  id: string;
  user_id: string | null;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  metadata: Record<string, any> | null;
  is_read: boolean;
  priority: 'normal' | 'urgent';
  created_at: string;
};

export type NotificationInsert = Omit<Notification, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type NotificationUpdate = Partial<NotificationInsert>;

/* ─── Tabel: designs ─────────────────────────────────────────── */
export type Design = {
  id: string;
  order_id: string | null;
  customer_id: string | null;
  name: string;
  file_url: string;
  file_type: string | null; // Logo, Mockup, Pattern, dll.
  file_size: number | null;
  version: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DesignInsert = Omit<Design, 'id' | 'created_at' | 'updated_at' | 'version'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  version?: number;
};

export type DesignUpdate = Partial<DesignInsert>;

/* ─── Tabel: activity_logs ───────────────────────────────────── */
export type ActivityLog = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: any | null;
  new_values: any | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type ActivityLogInsert = Omit<ActivityLog, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type ActivityLogUpdate = Partial<ActivityLogInsert>;

/* ─── Tabel: order_materials ─────────────────────────────────── */
/**
 * Bahan baku yang dipakai pada satu pesanan (many-to-many).
 * Memungkinkan perhitungan HPP (Harga Pokok Produksi) per order.
 */
export type OrderMaterial = {
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
export type JournalEntry = {
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
export type Transaction = {
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
export type OrderWithRelations = Order & {
  order_materials?: (OrderMaterial & { material?: Material })[];
  transactions?: Transaction[];
}

/** Order ringkas untuk tampilan list/tabel */
export type OrderSummary = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone?: string | null;
  product_type: string;
  quantity: number;
  total_price: number | null;
  dp_amount: number;
  status: OrderStatus;
  deadline_date: string | null;
  created_at: string;
}

