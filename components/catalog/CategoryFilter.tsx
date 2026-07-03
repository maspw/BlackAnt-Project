'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  totalCount: number;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  totalCount,
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setCategory = useCallback(
    (cat: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cat) {
        params.set('kategori', cat);
      } else {
        params.delete('kategori');
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const tabs = [
    { label: 'Semua', value: null, count: totalCount },
    ...categories.map((cat) => ({ label: cat, value: cat, count: null })),
  ];

  return (
    <div className="flex items-center gap-0 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="Filter kategori">
      {tabs.map(({ label, value, count }) => {
        const isActive = value === activeCategory;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setCategory(value)}
            className={`
              shrink-0 flex items-center gap-1.5
              px-4 py-2 text-[14px] font-normal
              border-b-2 transition-all duration-150
              whitespace-nowrap
              ${isActive
                ? 'border-[#000000] text-[#000000]'
                : 'border-transparent text-[#878787] hover:text-[#000000] hover:border-[#e5e5e5]'
              }
            `}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {label}
            {count !== null && (
              <span
                className={`text-[12px] ${isActive ? 'text-[#878787]' : 'text-[#c0c0c0]'}`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
