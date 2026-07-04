/* ─── Shimmer animation ─────────────────────────────────────── */
function Shimmer({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-[#f0f0f0] animate-pulse relative overflow-hidden ${className}`} style={style}>
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}

/* ─── Single skeleton card ──────────────────────────────────── */
export function ProductSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      {/* Image */}
      <Shimmer className="w-full rounded-none" style={{ paddingBottom: '125%', height: 0 } as React.CSSProperties} />
      {/* Caption */}
      <div className="pt-3 flex flex-col gap-2">
        <Shimmer className="h-4 w-20 rounded-none" />
        <Shimmer className="h-5 w-3/4 rounded-none" />
        <Shimmer className="h-4 w-full rounded-none" />
        <Shimmer className="h-4 w-2/3 rounded-none" />
        <Shimmer className="h-5 w-24 rounded-none mt-1" />
      </div>
    </div>
  );
}

/* ─── Grid of skeletons ─────────────────────────────────────── */
interface ProductSkeletonGridProps {
  count?: number;
}

export function ProductSkeletonGrid({ count = 6 }: ProductSkeletonGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
        {Array.from({ length: count }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  );
}
