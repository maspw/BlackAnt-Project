import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="w-full min-h-screen flex items-center bg-[#ffffff] pt-16"
      aria-label="Hero section"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Text Content */}
          <div className="flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">

            {/* Eyebrow label */}
            <span
              className="inline-block text-[15px] font-normal text-[#878787] tracking-widest uppercase"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Creative Studio
            </span>

            {/* Main Headline */}
            <h1
              className="text-[clamp(36px,5.5vw,64px)] font-normal text-[#000000] leading-[1.08] tracking-tight"
              style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
            >
              Kami Buat Karya
              <br />
              yang Bicara
              <br />
              <em className="not-italic text-[#000000]">Sendiri.</em>
            </h1>

            {/* Hairline divider */}
            <div className="w-16 h-px bg-[#000000]" aria-hidden="true" />

            {/* Sub-headline */}
            <p
              className="max-w-md text-[21px] font-normal text-[#000000] leading-[1.30]"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Blackant adalah studio kreatif yang menghadirkan visual, strategi, dan kampanye yang meninggalkan kesan — bukan hanya tayangan.
            </p>

            {/* Secondary descriptor */}
            <p
              className="max-w-sm text-[15px] font-normal text-[#878787] leading-[1.65]"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Dari editorial fotografi hingga identitas merek — setiap proyek adalah halaman yang kami tulis bersama klien kami.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                asChild
                className="inline-flex items-center gap-2 h-12 px-7 text-[15px] font-normal bg-[#000000] text-[#ffffff] rounded-none border-0 hover:bg-[#878787] transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <Link href="#katalog">
                  Lihat Katalog
                  <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="inline-flex items-center gap-2 h-12 px-7 text-[15px] font-normal bg-transparent text-[#000000] rounded-none border border-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <Link href="#portofolio">
                  Portofolio Kami
                </Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 pt-4 border-t border-[#e5e5e5]">
              {[
                { value: '120+', label: 'Proyek Selesai' },
                { value: '8 Thn', label: 'Pengalaman' },
                { value: '60+', label: 'Klien Puas' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span
                    className="text-[23px] font-bold text-[#000000] leading-none"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[13px] font-normal text-[#878787] leading-none"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Illustration */}
          <div className="relative flex items-center justify-center order-1 lg:order-2">
            {/* Subtle background grid texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `
                  linear-gradient(#000 1px, transparent 1px),
                  linear-gradient(90deg, #000 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
              aria-hidden="true"
            />

            {/* Large number watermark */}
            <span
              className="absolute top-0 right-0 text-[clamp(120px,14vw,200px)] font-bold text-[#000000] opacity-[0.04] leading-none select-none pointer-events-none"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              aria-hidden="true"
            >
              01
            </span>

            {/* Main illustration container */}
            <div className="relative w-full max-w-[520px] aspect-square">
              {/* Offset border frame — editorial feel */}
              <div
                className="absolute top-4 left-4 right-[-16px] bottom-[-16px] border border-[#e5e5e5]"
                aria-hidden="true"
              />

              {/* Image */}
              <div className="relative w-full h-full overflow-hidden border border-[#e5e5e5]">
                <Image
                  src="/hero-illustration.png"
                  alt="Blackant Studio — Editorial photography and creative work"
                  fill
                  className="object-cover grayscale"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-[#ffffff] opacity-[0.06]" aria-hidden="true" />
              </div>

              {/* Caption badge */}
              <div
                className="absolute bottom-[-32px] left-0 flex items-center gap-3 bg-[#000000] px-4 py-3"
              >
                <span
                  className="w-2 h-2 rounded-full bg-[#ffffff] animate-pulse"
                  aria-hidden="true"
                />
                <span
                  className="text-[13px] font-normal text-[#ffffff] tracking-widest uppercase"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Available for Projects
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
