import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      {/* Big 404 */}
      <span
        className="text-[clamp(80px,15vw,160px)] font-normal text-[#f0f0f0] leading-none select-none"
        style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
        aria-hidden="true"
      >
        404
      </span>

      <h1
        className="text-[clamp(22px,4vw,36px)] font-normal text-black leading-[1.15] mt-2 mb-3"
        style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
      >
        Halaman Tidak Ditemukan
      </h1>

      <p
        className="text-[16px] font-normal text-[#878787] leading-[1.65] max-w-sm mb-8"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        Halaman yang Anda cari tidak ada atau telah dipindahkan ke alamat lain.
      </p>

      {/* Hairline */}
      <div className="w-16 h-px bg-[#e5e5e5] mb-8" aria-hidden="true" />

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="flex items-center justify-center h-11 px-7 bg-black text-white text-[15px] font-normal hover:bg-[#333] transition-colors no-underline"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/katalog"
          className="flex items-center justify-center h-11 px-7 border border-black text-black text-[15px] font-normal hover:bg-[#f5f5f5] transition-colors no-underline"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Lihat Katalog
        </Link>
      </div>
    </div>
  );
}
