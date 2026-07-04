'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

const FONT_UI = 'Inter, system-ui, sans-serif';

export default function AddOrderButton() {
  return (
    <Link
      href="/admin/pesanan/tambah"
      className="inline-flex items-center gap-2 h-9 px-4 text-[13px] font-medium rounded-[4px] transition-all duration-150 whitespace-nowrap"
      style={{
        border: '1px solid #83c3ff',
        color: '#ffffff',
        backgroundColor: 'transparent',
        fontFamily: FONT_UI,
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#83c3ff';
        e.currentTarget.style.color = '#080809';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#ffffff';
      }}
    >
      <Plus size={14} strokeWidth={2} aria-hidden="true" />
      Tambah Order
    </Link>
  );
}
