/**
 * lib/utils-admin.ts
 *
 * Helper functions khusus untuk panel admin Blackant Studio.
 * Semua fungsi ini pure (no side effects) dan aman di server maupun client.
 */

import type { OrderStatus } from '@/types/database';

/* ══════════════════════════════════════════════════════════════
   ORDER NUMBER
══════════════════════════════════════════════════════════════ */

/**
 * generateOrderNumber()
 *
 * Format: BLK-YYYY-NNNN
 * Contoh: BLK-2024-0042
 *
 * @param sequence  Nomor urut pesanan (integer, misal dari COUNT di DB)
 * @param date      Tanggal referensi (default: hari ini)
 * @returns         Nomor pesanan yang sudah diformat
 *
 * @example
 *   generateOrderNumber(42)           // "BLK-2024-0042"
 *   generateOrderNumber(1, new Date('2025-03-15'))  // "BLK-2025-0001"
 */
export function generateOrderNumber(sequence: number, date: Date = new Date()): string {
  const year = date.getFullYear();
  const paddedSeq = String(sequence).padStart(4, '0');
  return `BLK-${year}-${paddedSeq}`;
}

/* ══════════════════════════════════════════════════════════════
   CURRENCY FORMATTING
══════════════════════════════════════════════════════════════ */

/**
 * formatRupiah()
 *
 * Format angka ke representasi Rupiah Indonesia.
 * Gunakan dengan class `font-mono-data` di UI untuk alignment kolom.
 *
 * @param amount    Jumlah dalam IDR (number atau string numerik)
 * @param opts.compact    Jika true, tampilkan versi ringkas (Rp 1,5 Jt)
 * @param opts.showSymbol Jika false, hilangkan prefix "Rp" (default: true)
 * @returns Contoh: "Rp 1.500.000" atau "Rp 1,5 Jt"
 *
 * @example
 *   formatRupiah(1500000)                    // "Rp 1.500.000"
 *   formatRupiah(1500000, { compact: true }) // "Rp 1,5 Jt"
 *   formatRupiah(75000, { showSymbol: false })// "75.000"
 *   formatRupiah(null)                       // "—"
 */
export function formatRupiah(
  amount: number | string | null | undefined,
  opts: { compact?: boolean; showSymbol?: boolean } = {},
): string {
  const { compact = false, showSymbol = true } = opts;

  if (amount == null || amount === '') return '—';

  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.-]/g, '')) : amount;

  if (isNaN(num)) return '—';

  if (compact) {
    // Versi ringkas: Jt / M
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    let value: string;
    if (absNum >= 1_000_000_000) {
      value = `${sign}${(absNum / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
    } else if (absNum >= 1_000_000) {
      value = `${sign}${(absNum / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`;
    } else if (absNum >= 1_000) {
      value = `${sign}${(absNum / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Rb`;
    } else {
      value = `${sign}${absNum.toLocaleString('id-ID')}`;
    }

    return showSymbol ? `Rp ${value}` : value;
  }

  // Format penuh
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);

  if (!showSymbol) {
    // Hapus "Rp" dan spasi leading
    return formatted.replace(/^Rp\s?/, '').trim();
  }

  return formatted;
}

/* ══════════════════════════════════════════════════════════════
   DATE FORMATTING
══════════════════════════════════════════════════════════════ */

/**
 * formatTanggalIndo()
 *
 * Format tanggal ke Bahasa Indonesia yang human-readable.
 *
 * @param dateInput  ISO string, Date object, atau null
 * @param opts.withTime   Sertakan jam:menit (default: false)
 * @param opts.short      Format pendek: "4 Jul 2024" (default: false)
 * @returns Contoh: "4 Juli 2024" atau "4 Juli 2024, 14:30" atau "—"
 *
 * @example
 *   formatTanggalIndo('2024-07-04')                        // "4 Juli 2024"
 *   formatTanggalIndo('2024-07-04T14:30:00', { withTime: true }) // "4 Juli 2024, 14:30"
 *   formatTanggalIndo('2024-07-04', { short: true })       // "4 Jul 2024"
 *   formatTanggalIndo(null)                                // "—"
 */
export function formatTanggalIndo(
  dateInput: string | Date | null | undefined,
  opts: { withTime?: boolean; short?: boolean } = {},
): string {
  const { withTime = false, short = false } = opts;

  if (!dateInput) return '—';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) return '—';

  const dateFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: short ? 'short' : 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);

  if (!withTime) return dateFormatted;

  const timeFormatted = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(date);

  return `${dateFormatted}, ${timeFormatted}`;
}

/**
 * formatRelativeTime()
 *
 * Format waktu relatif berbahasa Indonesia.
 * Contoh: "3 hari lagi", "Kemarin", "2 jam yang lalu"
 *
 * @example
 *   formatRelativeTime('2024-07-01') // "3 hari yang lalu" (jika hari ini 4 Jul)
 */
export function formatRelativeTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '—';

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  const absDays = Math.abs(diffDays);
  const absHours = Math.abs(diffHours);
  const absMinutes = Math.abs(diffMinutes);

  if (diffDays === 0) {
    if (absHours === 0) {
      return absMinutes < 2 ? 'Baru saja' : `${absMinutes} menit ${diffMinutes > 0 ? 'lagi' : 'yang lalu'}`;
    }
    return `${absHours} jam ${diffHours > 0 ? 'lagi' : 'yang lalu'}`;
  }
  if (diffDays === 1) return 'Besok';
  if (diffDays === -1) return 'Kemarin';
  if (diffDays > 0) return `${absDays} hari lagi`;
  return `${absDays} hari yang lalu`;
}

/* ══════════════════════════════════════════════════════════════
   STATUS COLORS
   Selaras dengan admin design system (docs/admin-design.md):
   - pending/cancelled → Vermilion (merah)
   - confirmed         → Fog (abu netral — menunggu)
   - process/qc        → Ice Signal (biru — aktif)
   - shipping          → Amber (kuning — transisi)
   - finish            → Emerald (hijau — selesai)
══════════════════════════════════════════════════════════════ */

export type StatusColorSet = {
  /** Tailwind background color class */
  bg: string;
  /** Tailwind text color class */
  text: string;
  /** Tailwind border color class */
  border: string;
  /** Hex color untuk inline styles jika diperlukan */
  hex: string;
  /** Label tampilan dalam Bahasa Indonesia */
  label: string;
  /** Tailwind dot/indicator color class */
  dot: string;
};

/**
 * getStatusColor()
 *
 * Mengembalikan set Tailwind classes dan hex color untuk badge status order.
 * Warna mengikuti admin design system (OpenSea dark theme).
 *
 * @param status  OrderStatus string
 * @returns       StatusColorSet — gunakan .bg, .text, .border untuk styling badge
 *
 * @example
 *   const colors = getStatusColor('process');
 *   // <span className={`${colors.bg} ${colors.text} ${colors.border}`}>
 *   //   {colors.label}
 *   // </span>
 */
export function getStatusColor(status: OrderStatus): StatusColorSet {
  const map: Record<OrderStatus, StatusColorSet> = {
    pending: {
      bg:     'bg-red-500/10',
      text:   'text-red-400',
      border: 'border-red-500/30',
      dot:    'bg-red-400',
      hex:    '#f87171',
      label:  'Menunggu',
    },
    confirmed: {
      bg:     'bg-[#acadae]/10',
      text:   'text-[#acadae]',
      border: 'border-[#acadae]/30',
      dot:    'bg-[#acadae]',
      hex:    '#acadae',
      label:  'Dikonfirmasi',
    },
    process: {
      bg:     'bg-[#83c3ff]/10',
      text:   'text-[#83c3ff]',
      border: 'border-[#83c3ff]/30',
      dot:    'bg-[#83c3ff]',
      hex:    '#83c3ff',
      label:  'Produksi',
    },
    qc: {
      bg:     'bg-amber-500/10',
      text:   'text-amber-400',
      border: 'border-amber-500/30',
      dot:    'bg-amber-400',
      hex:    '#fbbf24',
      label:  'Quality Check',
    },
    shipping: {
      bg:     'bg-purple-500/10',
      text:   'text-purple-400',
      border: 'border-purple-500/30',
      dot:    'bg-purple-400',
      hex:    '#c084fc',
      label:  'Dikirim',
    },
    finish: {
      bg:     'bg-emerald-500/10',
      text:   'text-emerald-400',
      border: 'border-emerald-500/30',
      dot:    'bg-emerald-400',
      hex:    '#34d399',
      label:  'Selesai',
    },
    cancelled: {
      bg:     'bg-red-900/20',
      text:   'text-red-500',
      border: 'border-red-900/40',
      dot:    'bg-red-500',
      hex:    '#ef4444',
      label:  'Dibatalkan',
    },
  };

  return map[status] ?? map['pending'];
}

/**
 * getStatusLabel()
 * Shortcut untuk ambil label saja.
 */
export function getStatusLabel(status: OrderStatus): string {
  return getStatusColor(status).label;
}

/* ══════════════════════════════════════════════════════════════
   MISC HELPERS
══════════════════════════════════════════════════════════════ */

/**
 * calcSisa()
 * Hitung sisa pembayaran dari total_price - total_paid.
 */
export function calcSisa(totalPrice: number | null, totalPaid: number): number {
  if (totalPrice == null) return 0;
  return Math.max(0, totalPrice - totalPaid);
}

/**
 * calcPaymentProgress()
 * Persentase pembayaran (0–100).
 */
export function calcPaymentProgress(totalPrice: number | null, totalPaid: number): number {
  if (!totalPrice || totalPrice === 0) return 0;
  return Math.min(100, Math.round((totalPaid / totalPrice) * 100));
}

/**
 * calcHPP()
 * Hitung Harga Pokok Produksi dari daftar bahan yang dipakai.
 */
export function calcHPP(
  materials: Array<{ quantity_used: number; unit_cost_snapshot: number | null }>,
): number {
  return materials.reduce((sum, m) => {
    if (m.unit_cost_snapshot == null) return sum;
    return sum + m.quantity_used * m.unit_cost_snapshot;
  }, 0);
}

/**
 * truncateWa()
 * Tampilkan nomor WA dalam format singkat: 0858...3118
 */
export function truncateWa(wa: string | null): string {
  if (!wa) return '—';
  // Konversi 628xxx → 08xxx
  const normalized = wa.startsWith('62') ? '0' + wa.slice(2) : wa;
  if (normalized.length <= 8) return normalized;
  return `${normalized.slice(0, 4)}...${normalized.slice(-4)}`;
}

/**
 * getCategoryBadgeColor()
 * Mengembalikan set Tailwind classes dan hex color untuk badge kategori customer.
 */
export function getCategoryBadgeColor(category: string): StatusColorSet {
  const map: Record<string, StatusColorSet> = {
    vip: {
      bg:     'bg-yellow-500/10',
      text:   'text-yellow-400',
      border: 'border-yellow-500/30',
      dot:    'bg-yellow-400',
      hex:    '#facc15',
      label:  'VIP',
    },
    wholesale: {
      bg:     'bg-[#83c3ff]/10',
      text:   'text-[#83c3ff]',
      border: 'border-[#83c3ff]/30',
      dot:    'bg-[#83c3ff]',
      hex:    '#83c3ff',
      label:  'Wholesale',
    },
    regular: {
      bg:     'bg-[#acadae]/10',
      text:   'text-[#acadae]',
      border: 'border-[#acadae]/30',
      dot:    'bg-[#acadae]',
      hex:    '#acadae',
      label:  'Regular',
    },
    retail: {
      bg:     'bg-emerald-500/10',
      text:   'text-emerald-400',
      border: 'border-emerald-500/30',
      dot:    'bg-emerald-400',
      hex:    '#34d399',
      label:  'Retail',
    },
  };

  return map[category] ?? map['regular'];
}
