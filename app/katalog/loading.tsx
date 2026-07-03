/* ─── Shimmer base ────────────────────────────────────────────
   Semua skeleton menggunakan kelas 'shimmer' yang didefinisikan
   via Tailwind animate-pulse + gradient untuk efek shimmer.
─────────────────────────────────────────────────────────────── */

function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`bg-[#f0f0f0] animate-pulse relative overflow-hidden ${className}`}
    >
      {/* Shimmer sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}

/* ─── Skeleton kartu produk ─────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="flex flex-col">
      {/* Image placeholder — aspect 4:5 */}
      <Shimmer className="w-full" style={{ paddingBottom: '125%', height: 0 } as React.CSSProperties} />

      {/* Caption */}
      <div className="pt-3 flex flex-col gap-2">
        <Shimmer className="h-4 w-20 rounded-none" />   {/* badge */}
        <Shimmer className="h-5 w-3/4 rounded-none" />  {/* name */}
        <Shimmer className="h-4 w-full rounded-none" /> {/* desc line 1 */}
        <Shimmer className="h-4 w-2/3 rounded-none" />  {/* desc line 2 */}
      </div>
    </div>
  );
}

/* ─── Katalog loading ───────────────────────────────────────── */
export default function KatalogLoading() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Page header skeleton */}
      <div className="border-b border-[#e5e5e5]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-14 md:py-20 flex flex-col gap-4">
          <Shimmer className="h-4 w-28 rounded-none" />  {/* eyebrow */}
          <Shimmer className="h-10 w-64 rounded-none" /> {/* heading */}
          <Shimmer className="h-5 w-96 max-w-full rounded-none" /> {/* sub */}
          <Shimmer className="h-4 w-32 rounded-none" />  {/* count */}
        </div>
      </div>

      {/* Grid skeleton — 1→2→3 col */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
