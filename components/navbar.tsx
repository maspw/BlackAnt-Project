'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '#tentang', label: 'Tentang' },
  { href: '#layanan', label: 'Layanan' },
  { href: '#katalog', label: 'Katalog' },
  { href: '#portofolio', label: 'Portofolio' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full bg-[#ffffff] transition-all duration-300 ${
        isScrolled ? 'border-b border-[#e5e5e5]' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Blackant Home">
          <span
            className="text-[23px] font-bold tracking-tight text-[#000000] select-none"
            style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
          >
            blackant
          </span>
          <span
            className="hidden sm:inline-block text-[15px] font-normal text-[#878787] leading-none"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            studio
          </span>
        </Link>

        {/* Desktop Nav — center */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-[26px] py-[3px] text-[15px] font-normal text-[#000000] no-underline transition-all duration-150 hover:underline underline-offset-4"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile Trigger */}
        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <Button
            asChild
            className="hidden md:inline-flex h-10 px-5 text-[15px] font-normal bg-[#000000] text-[#ffffff] rounded-none border-0 hover:bg-[#878787] transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            <Link href="#kontak">Hubungi Kami</Link>
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Buka menu"
                className="md:hidden flex items-center justify-center w-10 h-10 text-[#000000] hover:text-[#878787] transition-colors"
              >
                {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] bg-[#ffffff] border-l border-[#e5e5e5] p-0"
            >
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-[#e5e5e5]">
                <SheetTitle
                  className="text-left text-[21px] font-normal text-[#000000]"
                  style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
                >
                  blackant
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col px-6 py-4 gap-0" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-4 text-[18px] font-normal text-[#000000] border-b border-[#e5e5e5] hover:text-[#878787] transition-colors duration-150 no-underline"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="px-6 pt-6">
                <Button
                  asChild
                  className="w-full h-12 text-[15px] font-normal bg-[#000000] text-[#ffffff] rounded-none border-0 hover:bg-[#878787] transition-colors duration-200"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  <Link href="#kontak" onClick={() => setMobileOpen(false)}>
                    Hubungi Kami
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
