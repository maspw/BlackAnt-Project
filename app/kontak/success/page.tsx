/**
 * app/kontak/success/page.tsx
 *
 * Halaman konfirmasi setelah form inquiry berhasil disimpan ke DB.
 * Params dari redirect:
 *   ?order=BLK-2024-0042&wa=628...&item=Kaos%20T-Shirt&qty=50
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, ArrowLeft, Package } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Pesanan Diterima — Blackant Studio',
  description: 'Pesanan Anda telah berhasil diterima oleh Blackant Studio.',
};

/* ─── WA message template ───────────────────────────────────── */
function buildWaUrl(wa: string, orderNumber: string, item: string, qty: string): string {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '6285731813118';
  const message  = [
    `Halo Blackant Studio! 👋`,
    ``,
    `Saya sudah mengisi form pesanan di website dengan detail:`,
    ``,
    `📋 *No. Order:* ${orderNumber}`,
    `👕 *Item:* ${item}`,
    `🔢 *Jumlah:* ${qty} pcs`,
    ``,
    `Mohon konfirmasi dan info lebih lanjut. Terima kasih!`,
  ].join('\n');

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

/* ─── Page ──────────────────────────────────────────────────── */
interface PageProps {
  searchParams: Promise<{
    order?: string;
    wa?:    string;
    item?:  string;
    qty?:   string;
  }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { order, wa, item, qty } = await searchParams;

  const orderNumber = order  ? decodeURIComponent(order)  : '—';
  const itemName    = item   ? decodeURIComponent(item)   : '—';
  const quantity    = qty    ?? '—';
  const waUrl       = order && wa ? buildWaUrl(wa, orderNumber, itemName, quantity) : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ffffff] pt-16">

        {/* ── Full-height center ─────────────────────────── */}
        <section className="mx-auto max-w-[680px] px-6 md:px-8 py-20 md:py-32 flex flex-col items-center text-center gap-10">

          {/* Check icon */}
          <div className="w-20 h-20 flex items-center justify-center border border-[#e5e5e5]">
            <CheckCircle2
              size={36}
              strokeWidth={1}
              className="text-[#000000]"
              aria-hidden="true"
            />
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-4">
            <span
              className="text-[14px] font-normal uppercase tracking-widest text-[#878787]"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Pesanan Diterima
            </span>
            <h1
              className="text-[clamp(28px,4vw,44px)] font-normal text-[#000000] leading-[1.15]"
              style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
            >
              Terima Kasih,<br />Pesanan Anda Telah Masuk
            </h1>
            <p
              className="text-[17px] font-normal text-[#000000] leading-[1.70] max-w-md mx-auto"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Tim Blackant Studio akan menghubungi Anda dalam 1×24 jam untuk konfirmasi detail dan penawaran harga.
            </p>
          </div>

          {/* Order number card */}
          <div className="w-full border border-[#e5e5e5] p-8 flex flex-col items-center gap-6">

            {/* No. Order — mono besar */}
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-[13px] font-normal uppercase tracking-widest text-[#878787]"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Nomor Pesanan Anda
              </span>
              <p
                className="text-[clamp(28px,5vw,48px)] font-normal text-[#000000] tracking-tight leading-none select-all"
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" }}
                aria-label={`Nomor pesanan: ${orderNumber}`}
              >
                {orderNumber}
              </p>
              <span
                className="text-[13px] font-normal text-[#878787]"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Simpan nomor ini untuk referensi
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#e5e5e5]" aria-hidden="true" />

            {/* Detail ringkas */}
            <div className="flex flex-col gap-3 w-full">
              {[
                { icon: Package, label: 'Item', value: `${itemName} — ${quantity} pcs` },
                { icon: CheckCircle2, label: 'Status', value: 'Menunggu Konfirmasi' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center border border-[#e5e5e5] shrink-0">
                    <Icon size={14} strokeWidth={1.5} className="text-[#000000]" />
                  </div>
                  <div className="flex items-center gap-2 text-left flex-1">
                    <span
                      className="text-[13px] text-[#878787] w-16 shrink-0"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-[14px] font-normal text-[#000000]"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            {/* Lanjut ke WhatsApp — Primary */}
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 h-12 px-8 bg-[#000000] text-[#ffffff] text-[15px] font-normal hover:bg-[#333] transition-colors flex-1 no-underline"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
                Lanjut ke WhatsApp
              </a>
            ) : (
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '6285731813118'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 h-12 px-8 bg-[#000000] text-[#ffffff] text-[15px] font-normal hover:bg-[#333] transition-colors flex-1 no-underline"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
                Chat WhatsApp
              </a>
            )}

            {/* Kembali ke Home — Secondary */}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-[#e5e5e5] text-[#000000] text-[15px] font-normal hover:bg-[#f5f5f5] transition-colors sm:flex-none no-underline"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </div>

          {/* Sub note */}
          <p
            className="text-[13px] font-normal text-[#878787] leading-[1.65]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Pertanyaan mendesak? Hubungi kami langsung di{' '}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '6285731813118'}`}
              className="text-[#000000] underline underline-offset-2"
            >
              WhatsApp
            </a>{' '}
            atau email{' '}
            <a
              href="mailto:hello@blackantstudio.id"
              className="text-[#000000] underline underline-offset-2"
            >
              hello@blackantstudio.id
            </a>
          </p>

        </section>
      </main>
      <Footer />
    </>
  );
}
