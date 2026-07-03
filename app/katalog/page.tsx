import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Product } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Katalog Produk — Blackant Studio',
  description:
    'Jelajahi koleksi produk custom apparel Blackant Studio. Kaos, polo, hoodie, dan lainnya — dibuat dengan kualitas terbaik.',
};

/* ─── Type — diimport dari @/types/database ─────────────────── */
// Product interface sudah di-export dari types/database.ts

/* ─── Data fetching (Server Component) ─────────────────────── */
async function getProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, description, image_url, price')
    .order('id', { ascending: true });

  if (error) {
    // Lempar error agar Next.js error boundary yang menangani
    throw new Error(`Gagal mengambil data produk: ${error.message}`);
  }

  return (data ?? []) as Product[];
}

/* ─── Product Card ──────────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.image_url ?? '/images/kaos1.jpeg'; // fallback

  return (
    <Link href={`/katalog/${product.id}`} className="group flex flex-col no-underline">
      {/* Image — aspect ratio 4:5 via padded wrapper */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '125%' }}>
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ objectPosition: 'center top' }}
        />
      </div>


      {/* Caption stack */}
      <div className="pt-[13px] flex flex-col gap-[6px]">
        {/* Badge kategori */}
        <Badge
          variant="outline"
          className="self-start text-[13px] font-normal text-[#878787] border-[#e5e5e5] rounded-none px-2 py-0 uppercase tracking-widest"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {product.category}
        </Badge>

        {/* Nama produk */}
        <p
          className="text-[18px] font-bold text-[#000000] leading-snug"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {product.name}
        </p>

        {/* Deskripsi singkat */}
        {product.description && (
          <p
            className="text-[15px] font-normal text-[#878787] leading-[1.65] line-clamp-2"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {product.description}
          </p>
        )}

        {/* Harga (opsional) */}
        {product.price != null && (
          <p
            className="mt-1 text-[15px] font-bold text-[#000000]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(product.price)}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ─── Empty state ───────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center">
      <span
        className="text-[48px] font-normal text-[#e5e5e5]"
        style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
        aria-hidden="true"
      >
        —
      </span>
      <p
        className="text-[21px] font-normal text-[#000000]"
        style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
      >
        Belum ada produk
      </p>
      <p
        className="text-[15px] font-normal text-[#878787] max-w-xs leading-[1.65]"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        Produk akan segera hadir. Hubungi kami untuk informasi lebih lanjut.
      </p>
      <Link
        href="#kontak"
        className="mt-2 text-[15px] font-normal text-[#000000] border-b border-[#000000] pb-[2px] hover:text-[#878787] hover:border-[#878787] transition-colors duration-150"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        Hubungi Kami →
      </Link>
    </div>
  );
}

/* ─── Page (RSC — no 'use client') ─────────────────────────── */
export default async function KatalogPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ffffff] pt-16">

        {/* Page header */}
        <section className="w-full border-b border-[#e5e5e5]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-14 md:py-20 flex flex-col gap-4">
            <span
              className="text-[15px] font-normal text-[#878787] tracking-widest uppercase"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Koleksi Lengkap
            </span>
            <h1
              className="text-[clamp(32px,5vw,56px)] font-normal text-[#000000] leading-[1.10]"
              style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
            >
              Katalog Produk
            </h1>
            <p
              className="max-w-md text-[18px] font-normal text-[#000000] leading-[1.70]"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Semua produk custom apparel kami — dibuat dengan detail, dijahit dengan presisi.
            </p>

            {/* Count */}
            {products.length > 0 && (
              <p
                className="text-[15px] font-normal text-[#878787]"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {products.length} produk tersedia
              </p>
            )}
          </div>
        </section>

        {/* Product grid */}
        <section
          className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-20"
          aria-label="Daftar produk"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
            {products.length === 0 ? (
              <EmptyState />
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-[#e5e5e5]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p
                className="text-[21px] font-normal text-[#000000] leading-snug"
                style={{ fontFamily: "'Old Standard TT', Georgia, serif" }}
              >
                Tidak menemukan yang Anda cari?
              </p>
              <p
                className="mt-1 text-[15px] font-normal text-[#878787]"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Kami juga menerima pesanan custom sesuai kebutuhan Anda.
              </p>
            </div>
            <Link
              href="#kontak"
              className="shrink-0 inline-flex items-center gap-2 h-12 px-7 text-[15px] font-normal bg-[#000000] text-[#ffffff] hover:bg-[#878787] transition-colors duration-200"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Diskusikan Pesanan →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
