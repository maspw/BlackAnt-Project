import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ProductNotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ffffff] pt-16 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
          <span
            className="text-[80px] font-normal text-[#e5e5e5] leading-none mb-6"
            style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
            aria-hidden="true"
          >
            404
          </span>
          <h1
            className="text-[clamp(24px,4vw,36px)] font-normal text-[#000000] leading-[1.15] mb-3"
            style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
          >
            Produk Tidak Ditemukan
          </h1>
          <p
            className="text-[16px] font-normal text-[#878787] leading-[1.65] max-w-sm mb-8"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Produk yang Anda cari tidak tersedia atau sudah tidak ada di katalog kami.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/katalog"
              className="flex items-center justify-center h-11 px-7 bg-[#000000] text-[#ffffff] text-[15px] font-normal hover:bg-[#333] transition-colors no-underline"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Lihat Semua Katalog
            </Link>
            <Link
              href="/kontak"
              className="flex items-center justify-center h-11 px-7 border border-[#000000] text-[#000000] text-[15px] font-normal hover:bg-[#f5f5f5] transition-colors no-underline"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
