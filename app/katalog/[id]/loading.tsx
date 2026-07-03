function Shimmer({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-[#f0f0f0] animate-pulse relative overflow-hidden ${className}`} style={style}>
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white pt-16">

      {/* Breadcrumb skeleton */}
      <div className="border-b border-[#e5e5e5]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-4">
          <Shimmer className="h-4 w-48 rounded-none" />
        </div>
      </div>

      {/* 2-column layout skeleton */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Kiri: Image skeleton — aspect 8:9 */}
          <Shimmer
            className="w-full rounded-none"
            style={{ paddingBottom: '115%', height: 0 }}
          />

          {/* Kanan: Info skeleton */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <Shimmer className="h-5 w-24 rounded-none" />
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Shimmer className="h-9 w-full rounded-none" />
              <Shimmer className="h-9 w-3/4 rounded-none" />
            </div>
            {/* Price */}
            <div className="flex flex-col gap-2">
              <Shimmer className="h-8 w-40 rounded-none" />
              <Shimmer className="h-4 w-48 rounded-none" />
            </div>
            {/* Divider */}
            <div className="w-full h-px bg-[#e5e5e5]" />
            {/* Description */}
            <div className="flex flex-col gap-2">
              <Shimmer className="h-4 w-28 rounded-none" />
              <Shimmer className="h-4 w-full rounded-none" />
              <Shimmer className="h-4 w-full rounded-none" />
              <Shimmer className="h-4 w-5/6 rounded-none" />
              <Shimmer className="h-4 w-4/6 rounded-none" />
            </div>
            {/* Divider */}
            <div className="w-full h-px bg-[#e5e5e5]" />
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Shimmer className="flex-1 h-12 rounded-none" />
              <Shimmer className="flex-1 h-12 rounded-none" />
            </div>
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Shimmer className="h-3 w-20 rounded-none" />
                  <Shimmer className="h-4 w-28 rounded-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products skeleton */}
      <div className="border-t border-[#e5e5e5]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-20">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-10">
            <Shimmer className="h-4 w-24 rounded-none" />
            <Shimmer className="h-7 w-40 rounded-none" />
          </div>
          {/* Grid 3 kartu */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Shimmer
                  className="w-full rounded-none"
                  style={{ paddingBottom: '125%', height: 0 }}
                />
                <Shimmer className="h-3 w-16 rounded-none" />
                <Shimmer className="h-5 w-3/4 rounded-none" />
                <Shimmer className="h-4 w-20 rounded-none" />
              </div>
            ))}
          </div>
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
