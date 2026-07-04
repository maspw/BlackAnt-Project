'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PortfolioItem {
  id: number;
  src: string;
  alt: string;
  nama: string;
  kategori: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    src: '/images/kaos1.jpeg',
    alt: 'Kaos custom printing blackant studio',
    nama: 'Kaos Printing Premium',
    kategori: 'Custom Apparel',
  },
  {
    id: 2,
    src: '/images/kaos2.jpeg',
    alt: 'Kaos sablon manual blackant studio',
    nama: 'Sablon Manual Series',
    kategori: 'Screen Printing',
  },
  {
    id: 3,
    src: '/images/kaos3.jpeg',
    alt: 'Kaos distro blackant studio',
    nama: 'Distro Collection',
    kategori: 'Ready to Wear',
  },
  {
    id: 4,
    src: '/images/kaos4.jpeg',
    alt: 'Kaos polo blackant studio',
    nama: 'Polo Series',
    kategori: 'Corporate Wear',
  },
  {
    id: 5,
    src: '/images/kaos5.jpeg',
    alt: 'Kaos oversize blackant studio',
    nama: 'Oversize Collection',
    kategori: 'Streetwear',
  },
  {
    id: 6,
    src: '/images/kaos6.jpeg',
    alt: 'Kaos tie-dye blackant studio',
    nama: 'Tie-Dye Series',
    kategori: 'Custom Dyeing',
  },
  {
    id: 7,
    src: '/images/kaos7.jpeg',
    alt: 'Kaos bordir blackant studio',
    nama: 'Bordir Premium',
    kategori: 'Embroidery',
  },
  {
    id: 8,
    src: '/images/kaos8.jpeg',
    alt: 'Kaos komunitas blackant studio',
    nama: 'Community Tee',
    kategori: 'Batch Order',
  },
  {
    id: 9,
    src: '/images/kaos9.jpeg',
    alt: 'Kaos event blackant studio',
    nama: 'Event Edition',
    kategori: 'Limited Run',
  },
  {
    id: 10,
    src: '/images/kaos10.jpeg',
    alt: 'Kaos couple blackant studio',
    nama: 'Couple Series',
    kategori: 'Custom Print',
  },
];

function PortfolioTile({ item }: { item: PortfolioItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image wrapper — padded-bottom trick for consistent 4:5 aspect ratio */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '125%' }}>
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ objectPosition: 'center top' }}
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-5 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.10) 60%, transparent 100%)',
            opacity: hovered ? 1 : 0,
          }}
          aria-hidden="true"
        >
          <span
            className="block text-[18px] font-bold text-[#ffffff] leading-tight mb-1"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {item.nama}
          </span>
          <span
            className="block text-[13px] font-normal text-[rgba(255,255,255,0.70)] tracking-widest uppercase"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {item.kategori}
          </span>
        </div>
      </div>

      {/* Caption stack — always visible beneath tile */}
      <div className="pt-[13px]">
        <p
          className="text-[18px] font-bold text-[#000000] leading-snug"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {item.nama}
        </p>
        <p
          className="mt-[4px] text-[15px] font-normal text-[#878787] leading-[1.65]"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {item.kategori}
        </p>
      </div>
    </article>
  );
}

export default function PortfolioSection() {
  return (
    <section
      id="portofolio"
      className="w-full bg-[#ffffff] py-16 md:py-24 lg:py-32"
      aria-labelledby="portfolio-heading"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">

        {/* Section header */}
        <div className="mb-12 md:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span
              className="block text-[15px] font-normal text-[#878787] tracking-widest uppercase mb-3"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Portofolio
            </span>
            <h2
              id="portfolio-heading"
              className="text-[clamp(28px,4vw,48px)] font-normal text-[#000000] leading-[1.10]"
              style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
            >
              Hasil Karya Kami
            </h2>
          </div>

          <p
            className="max-w-xs text-[15px] font-normal text-[#878787] leading-[1.65] sm:text-right"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Setiap jahitan adalah cerita. Setiap karya adalah bukti komitmen kami terhadap kualitas.
          </p>
        </div>

        {/* Hairline divider */}
        <div className="w-full h-px bg-[#e5e5e5] mb-10 md:mb-12" aria-hidden="true" />

        {/* Portfolio grid — 1 col mobile / 2 col tablet / 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-14">
          {portfolioItems.map((item) => (
            <PortfolioTile key={item.id} item={item} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 md:mt-20 flex justify-center">
          <a
            href="/kontak"
            className="inline-flex items-center gap-3 text-[15px] font-normal text-[#000000] border-b border-[#000000] pb-[2px] hover:text-[#878787] hover:border-[#878787] transition-colors duration-200"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Pesan Karya Anda Sekarang
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
