import Link from 'next/link';
import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  /** Teks heading utama */
  heading?: string;
  /** Teks deskripsi */
  description?: string;
  /** Label CTA button */
  ctaLabel?: string;
  /** Href CTA button */
  ctaHref?: string;
}

export default function EmptyState({
  heading = 'Produk Tidak Ditemukan',
  description = 'Tidak ada produk yang cocok dengan filter yang dipilih. Coba pilih kategori lain.',
  ctaLabel = 'Lihat Semua Produk',
  ctaHref = '/katalog',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center border border-[#e5e5e5] mb-6">
        <PackageSearch size={28} strokeWidth={1} className="text-[#c0c0c0]" aria-hidden="true" />
      </div>

      <h2
        className="text-[22px] font-normal text-[#000000] mb-2"
        style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
      >
        {heading}
      </h2>

      <p
        className="text-[15px] font-normal text-[#878787] leading-[1.65] max-w-sm mb-8"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {description}
      </p>

      <Link
        href={ctaHref}
        className="flex items-center justify-center h-11 px-7 bg-black text-white text-[15px] font-normal hover:bg-[#333] transition-colors no-underline"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
