'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/tentang', label: 'Tentang' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/#portofolio', label: 'Portofolio' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tutup menu saat navigasi
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll saat menu terbuka
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* ── Navbar bar ────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-[100] bg-white transition-all duration-300 ${
          scrolled ? 'border-b border-[#e5e5e5]' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-8">

          {/* Logo */}
          <Link
            href="/"
            onClick={close}
            className="flex items-baseline gap-2 select-none"
            aria-label="Blackant Studio"
          >
            <span
              className="text-[22px] font-bold text-black leading-none"
              style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
            >
              blackant
            </span>
            <span
              className="hidden sm:block text-[14px] text-[#878787] leading-none"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              studio
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-5 py-1 text-[14px] text-black no-underline hover:underline underline-offset-4 transition-all"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA + hamburger */}
          <div className="flex items-center gap-2">
            <Link
              href="/kontak"
              className="hidden md:flex items-center h-9 px-5 bg-black text-white text-[14px] font-normal hover:bg-[#333] transition-colors"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Hubungi Kami
            </Link>

            {/* Hamburger — HANYA useState, zero library */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={open}
              className="md:hidden flex items-center justify-center w-10 h-10 text-black"
            >
              {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-screen mobile overlay ─────────────────────── */}
      {/*
          Overlay ini di-render di luar <header> sehingga tidak ada
          z-index conflict. Animasi pakai CSS transition pada opacity
          dan translateY — tidak butuh library apapun.
      */}
      <div
        aria-hidden={!open}
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '64px', // tinggi navbar
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <nav
          className="flex flex-col px-6 pt-4"
          aria-label="Navigasi mobile"
        >
          {navLinks.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={`py-5 text-[20px] font-normal text-black no-underline hover:text-[#878787] transition-colors ${
                i < navLinks.length - 1 ? 'border-b border-[#efefef]' : ''
              }`}
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pt-6">
          <Link
            href="/kontak"
            onClick={close}
            className="flex items-center justify-center h-12 w-full bg-black text-white text-[15px] font-normal hover:bg-[#333] transition-colors"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </>
  );
}
