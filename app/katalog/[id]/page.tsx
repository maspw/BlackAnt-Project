import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Tag, ShoppingBag } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Product } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

/* ─── Constants ─────────────────────────────────────────────── */
const WA_NUMBER = '6285731813118';

/* ─── Helpers ───────────────────────────────────────────────── */
function formatPrice(price: number | null): string {
  if (price == null) return 'Hubungi kami';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

function buildWaUrl(product: Product): string {
  const price = product.price != null ? formatPrice(product.price) : 'harga sesuai kesepakatan';
  const text = [
    `Halo, saya ingin memesan produk berikut:`,
    ``,
    `🛍️ *${product.name}*`,
    `📂 Kategori: ${product.category}`,
    `💰 Harga: ${price}`,
    ``,
    `Mohon informasi lebih lanjut mengenai ketersediaan dan proses pemesanan.`,
    `Terima kasih!`,
  ].join('\n');
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* ─── Data fetching ─────────────────────────────────────────── */
async function getProduct(id: string): Promise<Product | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Product;
}

async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .limit(3);

  return (data ?? []) as Product[];
}

/* ─── Metadata (dynamic) ────────────────────────────────────── */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan — Blackant Studio',
    };
  }

  return {
    title: `${product.name} — Blackant Studio`,
    description: product.description ?? `${product.name} dari kategori ${product.category}. Pesan custom apparel berkualitas dari Blackant Studio.`,
  };
}

/* ─── Related Product Card ──────────────────────────────────── */
function RelatedCard({ product }: { product: Product }) {
  const src = product.image_url ?? '/images/kaos1.jpeg';

  return (
    <Link
      href={`/katalog/${product.id}`}
      className="group flex flex-col no-underline"
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '125%' }}>
        <Image
          src={src}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={src.startsWith('http')}
        />
      </div>

      {/* Caption */}
      <div className="pt-3 flex flex-col gap-1">
        <span
          className="text-[12px] font-normal text-[#878787] uppercase tracking-widest"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {product.category}
        </span>
        <p
          className="text-[15px] font-bold text-[#000000] leading-snug group-hover:text-[#878787] transition-colors"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {product.name}
        </p>
        {product.price != null && (
          <p
            className="text-[13px] font-normal text-[#878787]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {formatPrice(product.price)}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default async function ProductDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fetch produk — 404 jika tidak ada
  const product = await getProduct(id);
  if (!product) notFound();

  // Fetch produk terkait paralel (non-blocking)
  const related = await getRelatedProducts(product.category, product.id);

  const imageSrc = product.image_url ?? '/images/kaos1.jpeg';
  const isExternal = imageSrc.startsWith('http');

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ffffff] pt-16">

        {/* ── Breadcrumb ───────────────────────────────────── */}
        <div className="border-b border-[#e5e5e5]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-4 flex items-center gap-2">
            <Link
              href="/katalog"
              className="flex items-center gap-1.5 text-[13px] text-[#878787] no-underline hover:text-[#000000] transition-colors"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Kembali ke Katalog
            </Link>
            <span className="text-[13px] text-[#e5e5e5]">/</span>
            <span
              className="text-[13px] text-[#000000] line-clamp-1"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {product.name}
            </span>
          </div>
        </div>

        {/* ── Product Detail — 2 kolom ─────────────────────── */}
        <section className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Kiri: Gambar */}
            <div className="relative w-full overflow-hidden lg:sticky lg:top-24" style={{ paddingBottom: '115%' }}>
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: 'center top' }}
                unoptimized={isExternal}
              />
            </div>

            {/* Kanan: Info */}
            <div className="flex flex-col gap-6 lg:pt-2">

              {/* Category badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="self-start text-[12px] font-normal text-[#878787] border-[#e5e5e5] rounded-none px-2 py-0 uppercase tracking-widest flex items-center gap-1"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <Tag size={10} strokeWidth={1.5} />
                  {product.category}
                </Badge>
              </div>

              {/* Nama produk */}
              <h1
                className="text-[clamp(28px,4vw,44px)] font-normal text-[#000000] leading-[1.10]"
                style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
              >
                {product.name}
              </h1>

              {/* Harga */}
              <div className="flex flex-col gap-1">
                {product.price != null ? (
                  <p
                    className="text-[28px] font-bold text-[#000000] leading-none"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {formatPrice(product.price)}
                  </p>
                ) : (
                  <p
                    className="text-[18px] font-normal text-[#878787] leading-none"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Harga: Hubungi kami untuk penawaran
                  </p>
                )}
                <p
                  className="text-[13px] font-normal text-[#878787]"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  *Harga belum termasuk ongkos kirim
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-[#e5e5e5]" aria-hidden="true" />

              {/* Deskripsi */}
              {product.description && (
                <div className="flex flex-col gap-2">
                  <span
                    className="text-[12px] font-normal text-[#878787] uppercase tracking-widest"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Deskripsi Produk
                  </span>
                  <p
                    className="text-[16px] font-normal text-[#000000] leading-[1.75] whitespace-pre-line"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {product.description}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="w-full h-px bg-[#e5e5e5]" aria-hidden="true" />

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Pesan via WhatsApp */}
                <a
                  href={buildWaUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#000000] text-[#ffffff] text-[15px] font-normal hover:bg-[#333333] transition-colors duration-200"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  Pesan via WhatsApp
                </a>

                {/* Lihat katalog lainnya */}
                <Link
                  href="/katalog"
                  className="flex-1 flex items-center justify-center h-12 border border-[#000000] text-[#000000] text-[15px] font-normal hover:bg-[#f5f5f5] transition-colors duration-200 no-underline"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Lihat Katalog Lain
                </Link>
              </div>

              {/* Info tambahan */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { label: 'Min. Order', value: 'Diskusikan' },
                  { label: 'Estimasi Produksi', value: '7–14 hari kerja' },
                  { label: 'Bahan', value: 'Sesuai request' },
                  { label: 'Pengiriman', value: 'Seluruh Indonesia' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span
                      className="text-[12px] font-normal text-[#878787] uppercase tracking-widest"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-[14px] font-normal text-[#000000]"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Produk Terkait ───────────────────────────────── */}
        {related.length > 0 && (
          <section className="border-t border-[#e5e5e5]">
            <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-20">

              {/* Header */}
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span
                    className="block text-[13px] font-normal text-[#878787] uppercase tracking-widest mb-2"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Kategori {product.category}
                  </span>
                  <h2
                    className="text-[clamp(20px,3vw,32px)] font-normal text-[#000000] leading-[1.10]"
                    style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
                  >
                    Produk Terkait
                  </h2>
                </div>
                <Link
                  href="/katalog"
                  className="text-[14px] font-normal text-[#878787] no-underline hover:text-[#000000] transition-colors hidden sm:block"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Lihat semua →
                </Link>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {related.map((p) => (
                  <RelatedCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
