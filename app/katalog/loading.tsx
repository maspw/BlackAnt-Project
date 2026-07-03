import { ProductSkeletonGrid } from '@/components/catalog';

export default function KatalogLoading() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header skeleton */}
      <div className="border-b border-[#e5e5e5]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-14 md:py-20 flex flex-col gap-4">
          <div className="h-4 w-20 bg-[#f0f0f0] animate-pulse" />
          <div className="h-12 w-72 bg-[#f0f0f0] animate-pulse" />
          <div className="h-5 w-96 max-w-full bg-[#f0f0f0] animate-pulse" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="border-b border-[#e5e5e5]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-2 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-[#f0f0f0] animate-pulse shrink-0" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-20">
        <ProductSkeletonGrid count={6} />
      </div>
    </div>
  );
}
