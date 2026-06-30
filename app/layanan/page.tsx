import type { Metadata } from 'next';
import {
  Shirt,
  Scissors,
  Palette,
  PackageCheck,
  Truck,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Layanan Kami — Blackant Studio',
  description:
    'Dari custom printing, sablon, hingga bordir dan pengiriman — Blackant Studio hadir sebagai mitra produksi apparel lengkap untuk kebutuhan Anda.',
};

/* ─────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────── */
const services = [
  {
    icon: Shirt,
    title: 'Custom Apparel',
    desc: 'Produksi kaos, polo, hoodie, dan jaket sesuai spesifikasi Anda — mulai dari pilihan bahan, gramasi, hingga potongan.',
  },
  {
    icon: Palette,
    title: 'Desain & Artwork',
    desc: 'Tim desainer kami siap membantu mengolah konsep mentah Anda menjadi artwork siap cetak dengan resolusi tinggi.',
  },
  {
    icon: Scissors,
    title: 'Jahit & Konveksi',
    desc: 'Jahitan presisi dengan mesin industri modern. Kami mengerjakan order satuan, batch kecil, maupun produksi massal.',
  },
  {
    icon: PackageCheck,
    title: 'Quality Control',
    desc: 'Setiap produk melewati pengecekan berlapis: ukuran, warna, kerapian jahitan, dan kesesuaian dengan sampel yang disetujui.',
  },
  {
    icon: Users,
    title: 'Corporate & Event',
    desc: 'Solusi seragam kantor, merchandise event, dan pakaian komunitas dalam jumlah besar dengan harga kompetitif.',
  },
  {
    icon: Truck,
    title: 'Pengiriman Nasional',
    desc: 'Pengiriman ke seluruh Indonesia dengan packaging aman dan tracking real-time — tepat waktu sesuai jadwal produksi.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Konsultasi',
    desc: 'Ceritakan kebutuhan Anda — jenis produk, jumlah, deadline, dan anggaran. Kami akan memberikan rekomendasi terbaik tanpa biaya awal.',
  },
  {
    number: '02',
    title: 'Desain & Sampling',
    desc: 'Tim kami membuat mockup digital untuk persetujuan. Setelah acc, kami produksi sampel fisik sebelum masuk ke produksi penuh.',
  },
  {
    number: '03',
    title: 'Produksi',
    desc: 'Proses produksi dimulai setelah sampel disetujui dan DP diterima. Anda akan mendapat update progres berkala selama produksi.',
  },
  {
    number: '04',
    title: 'QC & Finishing',
    desc: 'Setiap unit diperiksa satu per satu — jahitan, warna, ukuran, dan kebersihan produk sebelum dikemas.',
  },
  {
    number: '05',
    title: 'Pengiriman',
    desc: 'Produk dikemas rapi dan dikirim via ekspedisi pilihan Anda. Resi tersedia di hari yang sama setelah pengiriman.',
  },
];

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function LayananPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ffffff] pt-16">

        {/* ── Hero kecil ───────────────────────────────────── */}
        <section className="w-full border-b border-[#e5e5e5]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-16 md:py-24 flex flex-col gap-5">
            <span
              className="text-[15px] font-normal text-[#878787] tracking-widest uppercase"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Apa yang Kami Tawarkan
            </span>
            <h1
              className="text-[clamp(32px,5vw,56px)] font-normal text-[#000000] leading-[1.10] max-w-2xl"
              style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
            >
              Layanan Kami
            </h1>
            <p
              className="max-w-lg text-[18px] font-normal text-[#000000] leading-[1.70]"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Dari konsep hingga produk jadi di tangan Anda — kami menangani setiap tahap dengan presisi dan dedikasi penuh.
            </p>
          </div>
        </section>

        {/* ── Grid Layanan ─────────────────────────────────── */}
        <section
          className="mx-auto max-w-[1200px] px-6 md:px-8 py-16 md:py-24"
          aria-label="Daftar layanan"
        >
          <div className="mb-10 md:mb-14">
            <div className="w-full h-px bg-[#e5e5e5]" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <Card
                  key={svc.title}
                  className="group rounded-none border border-[#e5e5e5] shadow-none bg-[#ffffff] p-0 transition-colors duration-200 hover:border-[#000000]"
                >
                  <CardHeader className="px-8 pt-8 pb-0">
                    {/* Icon */}
                    <div className="mb-5 w-10 h-10 flex items-center justify-center border border-[#e5e5e5] group-hover:border-[#000000] transition-colors duration-200">
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className="text-[#000000]"
                        aria-hidden="true"
                      />
                    </div>
                    <CardTitle
                      className="text-[18px] font-bold text-[#000000] leading-snug"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {svc.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-8 pb-8 pt-3">
                    {/* Hairline */}
                    <div className="w-8 h-px bg-[#e5e5e5] mb-4 group-hover:bg-[#000000] transition-colors duration-200" aria-hidden="true" />
                    <p
                      className="text-[15px] font-normal text-[#878787] leading-[1.65]"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {svc.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── Proses Kerja ─────────────────────────────────── */}
        <section className="border-t border-[#e5e5e5] bg-[#ffffff]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-16 md:py-24">

            {/* Section header */}
            <div className="mb-12 md:mb-16">
              <span
                className="block text-[15px] font-normal text-[#878787] tracking-widest uppercase mb-3"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Bagaimana Kami Bekerja
              </span>
              <h2
                className="text-[clamp(24px,3.5vw,40px)] font-normal text-[#000000] leading-[1.10]"
                style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
              >
                Proses Kerja Kami
              </h2>
            </div>

            {/* Timeline steps */}
            <div className="flex flex-col gap-0">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-0 md:gap-8"
                >
                  {/* Left col — number + connector line */}
                  <div className="flex md:flex-col items-start gap-4 md:gap-0 pb-0">
                    {/* Step number */}
                    <span
                      className="shrink-0 text-[32px] font-bold text-[#000000] leading-none"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {step.number}
                    </span>
                    {/* Connector — vertical line on desktop */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block mt-3 ml-[1px] w-px flex-1 bg-[#e5e5e5]" style={{ minHeight: '80px' }} aria-hidden="true" />
                    )}
                  </div>

                  {/* Right col — content */}
                  <div className={`pb-10 md:pb-12 ${index < steps.length - 1 ? 'border-b border-[#e5e5e5] md:border-0' : ''}`}>
                    <div className="pt-[2px] flex flex-col gap-2">
                      <h3
                        className="text-[21px] font-normal text-[#000000] leading-snug"
                        style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-[15px] font-normal text-[#878787] leading-[1.65] max-w-xl"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA strip ────────────────────────────────────── */}
        <section className="border-t border-[#e5e5e5] bg-[#000000]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-14 md:py-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p
                className="text-[21px] font-normal text-[#ffffff] leading-snug"
                style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
              >
                Siap memulai proyek Anda?
              </p>
              <p
                className="text-[15px] font-normal text-[rgba(255,255,255,0.60)]"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Konsultasi gratis, tanpa komitmen — ceritakan kebutuhan Anda sekarang.
              </p>
            </div>
            <a
              href="/#kontak"
              className="shrink-0 inline-flex items-center gap-2 h-12 px-7 text-[15px] font-normal bg-[#ffffff] text-[#000000] hover:bg-[#e5e5e5] transition-colors duration-200"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Hubungi Kami →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
