/**
 * app/(admin)/admin/page.tsx
 *
 * Placeholder halaman dashboard admin — route: /admin
 */
export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-charcoal">
      {/* Top nav bar — Obsidian */}
      <header className="h-10 bg-obsidian flex items-center px-4 border-b border-iron">
        <span className="text-[14px] font-medium text-paper-white font-ui tracking-tight">
          blackant <span className="text-fog font-normal">admin</span>
        </span>
        <span className="ml-auto text-[12px] text-fog font-mono-data">
          v0.1 — dark terminal
        </span>
      </header>

      {/* Main content area */}
      <main className="max-w-[1440px] mx-auto px-6 py-12">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[32px] font-medium text-paper-white leading-[1.25]">
            Dashboard
          </h1>
          <span className="text-[14px] font-medium text-ice-signal">
            Lihat semua →
          </span>
        </div>

        {/* 3-column card grid demo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Total Produk', value: '—', sub: 'dari Supabase' },
            { label: 'Total Pesanan', value: '—', sub: 'via WhatsApp' },
            { label: 'Kategori Aktif', value: '—', sub: 'di katalog' },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-charcoal p-3 rounded-[8px]"
              style={{ boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}
            >
              <p className="text-[12px] text-fog uppercase tracking-widest mb-2">
                {card.label}
              </p>
              <p className="text-[32px] font-medium text-paper-white font-mono-data leading-none mb-1">
                {card.value}
              </p>
              <p className="text-[12px] text-fog">
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Token preview — untuk verifikasi design system */}
        <div className="mt-12 p-4 bg-graphite rounded-[8px]" style={{ boxShadow: 'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset' }}>
          <p className="text-[12px] text-fog uppercase tracking-widest mb-4">
            Design Token Preview
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'ice-signal', hex: '#83c3ff', cls: 'bg-ice-signal' },
              { name: 'paper-white', hex: '#ffffff', cls: 'bg-paper-white' },
              { name: 'fog', hex: '#acadae', cls: 'bg-fog' },
              { name: 'iron', hex: '#34353c', cls: 'bg-iron' },
              { name: 'slate', hex: '#3c3d40', cls: 'bg-slate' },
              { name: 'graphite', hex: '#26272d', cls: 'bg-graphite' },
              { name: 'charcoal', hex: '#1b1d1f', cls: 'bg-charcoal' },
              { name: 'obsidian', hex: '#141415', cls: 'bg-obsidian' },
              { name: 'void', hex: '#080809', cls: 'bg-void' },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-2 px-2 py-1 rounded-[4px] bg-charcoal border border-iron">
                <div className={`w-3 h-3 rounded-[2px] ${t.cls} border border-iron`} />
                <span className="text-[12px] text-fog font-mono-data">{t.hex}</span>
                <span className="text-[12px] text-paper-white">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
