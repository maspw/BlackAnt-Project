import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Product } from '@/types/database';
import { ProductGrid, CategoryFilter, EmptyState, ProductSkeletonGrid } from '@/components/catalog';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

/* ─── Metadata ──────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Katalog Produk — Blackant Studio',
  description:
    'Jelajahi koleksi produk custom apparel Blackant Studio. Kaos, polo, hoodie, dan lainnya — dibuat dengan kualitas terbaik.',
};

/* ─── Data fetching ─────────────────────────────────────────── */
async function getProducts(category?: string): Promise<Product[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[katalog] Supabase error:', error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

async function getAllCategories(): Promise<string[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('category')
    .order('category');

  if (!data) return [];

  // Deduplicate
  return [...new Set(data.map((r) => r.category).filter(Boolean))];
}

/* ─── Page ──────────────────────────────────────────────────── */
interface KatalogPageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function KatalogPage({ searchParams }: KatalogPageProps) {
  const { kategori } = await searchParams;
  const activeCategory = kategori ?? null;

  // Fetch data paralel
  const [products, categories] = await Promise.all([
    getProducts(activeCategory ?? undefined),
    getAllCategories(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ffffff] pt-16">

        {/* ── Page Header ─────────────────────────────────── */}
        <section className="w-full border-b border-[#e5e5e5]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-14 md:py-20 flex flex-col gap-4">
            <span
              className="text-[14px] font-normal text-[#878787] uppercase tracking-widest"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Koleksi
            </span>
            <h1
              className="text-[clamp(32px,5vw,56px)] font-normal text-[#000000] leading-[1.10]"
              style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
            >
              {activeCategory ? activeCategory : 'Katalog Produk'}
            </h1>
            <p
              className="text-[17px] font-normal text-[#000000] leading-[1.65] max-w-xl"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {activeCategory
                ? `Menampilkan ${products.length} produk dalam kategori ini.`
                : `${products.length} produk custom apparel tersedia — pilih sesuai kebutuhan Anda.`}
            </p>
          </div>
        </section>

        {/* ── Category Filter ──────────────────────────────── */}
        {categories.length > 1 && (
          <div className="w-full border-b border-[#e5e5e5] sticky top-16 z-40 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto max-w-[1200px] px-6 md:px-8">
              <Suspense fallback={null}>
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  totalCount={products.length}
                />
              </Suspense>
            </div>
          </div>
        )}

        {/* ── Product Grid ─────────────────────────────────── */}
        <section className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-20">
          {products.length === 0 ? (
            <EmptyState
              heading={activeCategory ? `Tidak Ada Produk "${activeCategory}"` : 'Belum Ada Produk'}
              description={
                activeCategory
                  ? `Belum ada produk dalam kategori "${activeCategory}". Coba kategori lain.`
                  : 'Katalog produk sedang disiapkan. Hubungi kami untuk informasi lebih lanjut.'
              }
              ctaLabel={activeCategory ? 'Lihat Semua Produk' : 'Hubungi Kami'}
              ctaHref={activeCategory ? '/katalog' : '/kontak'}
            />
          ) : (
            <ProductGrid products={products} />
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}
