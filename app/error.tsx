'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log ke error monitoring (Sentry, dll.) di sini jika ada
    console.error('[RootError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative dash */}
      <span
        className="text-[64px] font-normal text-[#e5e5e5] leading-none mb-6 select-none"
        style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
        aria-hidden="true"
      >
        —
      </span>

      <h1
        className="text-[clamp(22px,4vw,36px)] font-normal text-black leading-[1.15] mb-3"
        style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
      >
        Terjadi Kesalahan
      </h1>

      <p
        className="text-[16px] font-normal text-[#878787] leading-[1.65] max-w-sm mb-2"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        Halaman ini tidak dapat dimuat saat ini. Silakan coba lagi atau kembali ke halaman utama.
      </p>

      {/* Error digest untuk debugging */}
      {error.digest && (
        <p
          className="text-[12px] font-normal text-[#c0c0c0] mb-8 font-mono"
        >
          Kode: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
        <button
          onClick={reset}
          className="flex items-center justify-center h-11 px-7 bg-black text-white text-[15px] font-normal hover:bg-[#333] transition-colors cursor-pointer"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Coba Lagi
        </button>
        <a
          href="/"
          className="flex items-center justify-center h-11 px-7 border border-black text-black text-[15px] font-normal hover:bg-[#f5f5f5] transition-colors no-underline"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
