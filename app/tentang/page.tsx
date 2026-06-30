import Image from 'next/image';
import type { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Tentang Kami — Blackant Studio',
  description:
    'Kenali lebih dekat Blackant Studio — studio konveksi kreatif dengan pengalaman lebih dari 8 tahun menghadirkan produk apparel berkualitas tinggi.',
};

/* ─────────────────────────────────────────────────────────────
   Data konten (mudah diedit tanpa menyentuh JSX)
───────────────────────────────────────────────────────────── */
const story = [
  {
    paragraph:
      'Blackant Studio lahir pada 2016 dari sebuah ruang kecil di Jakarta dengan satu mesin jahit dan satu tekad besar: menghadirkan produk apparel yang tidak sekadar layak pakai, tetapi benar-benar membanggakan pemakainya.',
  },
  {
    paragraph:
      'Selama lebih dari delapan tahun, kami telah melayani ratusan klien — mulai dari komunitas kampus, brand lokal rintisan, hingga perusahaan multinasional yang memercayakan seragam dan merchandise mereka kepada tangan-tangan terampil tim kami.',
  },
  {
    paragraph:
      'Setiap helai kain yang masuk ke studio kami diperlakukan dengan standar yang sama: dipotong presisi, dijahit rapi, dan melewati quality-check ketat sebelum sampai ke tangan Anda. Bukan karena kami takut gagal, tetapi karena kami bangga dengan setiap karya yang keluar dari studio ini.',
  },
  {
    paragraph:
      'Kami percaya bahwa pakaian adalah media ekspresi. Maka, tugas kami bukan hanya menjahit — tetapi memastikan bahwa setiap karya menceritakan sesuatu yang bermakna bagi yang memakainya.',
  },
];

const stats = [
  { value: '120+', label: 'Proyek Selesai' },
  { value: '8 Thn', label: 'Pengalaman' },
  { value: '60+', label: 'Klien Puas' },
  { value: '5 Kota', label: 'Jangkauan' },
];

const visiMisi = [
  {
    type: 'Visi',
    heading: 'Menjadi studio konveksi kreatif terpercaya yang mendefinisikan ulang standar kualitas apparel lokal Indonesia.',
    points: [
      'Mengangkat nama produk lokal ke standar internasional',
      'Menjadi mitra jangka panjang bagi brand-brand kreatif Indonesia',
      'Membangun ekosistem industri tekstil yang berkelanjutan dan etis',
    ],
  },
  {
    type: 'Misi',
    heading: 'Menghadirkan produk apparel berkualitas tinggi melalui proses yang transparan, inovatif, dan berorientasi pada kepuasan klien.',
    points: [
      'Menggunakan bahan baku pilihan dengan seleksi ketat tiap batch',
      'Menerapkan quality control berlapis di setiap tahap produksi',
      'Memberikan pelayanan konsultasi yang jujur dan responsif',
      'Terus berinovasi dalam teknik sablon, bordir, dan finishing',
    ],
  },
];

const team = [
  { name: 'Andi Pratama', role: 'Founder & Creative Director' },
  { name: 'Siti Rahayu', role: 'Head of Production' },
  { name: 'Rizki Firmansyah', role: 'Quality Control Lead' },
  { name: 'Maya Dewi', role: 'Client Relations Manager' },
];

/* ─────────────────────────────────────────────────────────────
   Page Component (RSC)
───────────────────────────────────────────────────────────── */
export default function TentangPage() {
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
              Tentang Kami
            </span>
            <h1
              className="text-[clamp(32px,5vw,56px)] font-normal text-[#000000] leading-[1.10] max-w-2xl"
              style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
            >
              Di Balik Setiap Jahitan,<br />Ada Sebuah Cerita.
            </h1>
            <p
              className="max-w-lg text-[18px] font-normal text-[#000000] leading-[1.70]"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Blackant Studio adalah studio konveksi kreatif yang percaya bahwa kualitas bukan sekadar standar — melainkan sebuah komitmen yang dijaga setiap hari.
            </p>

            {/* Stat strip */}
            <div className="flex flex-wrap gap-x-10 gap-y-5 pt-4 border-t border-[#e5e5e5]">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span
                    className="text-[28px] font-bold text-[#000000] leading-none"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[13px] font-normal text-[#878787] uppercase tracking-widest"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cerita Kami — 2 kolom ────────────────────────── */}
        <section className="mx-auto max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Kiri: teks */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span
                  className="text-[15px] font-normal text-[#878787] tracking-widest uppercase"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Cerita Kami
                </span>
                <h2
                  className="text-[clamp(24px,3.5vw,40px)] font-normal text-[#000000] leading-[1.15]"
                  style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
                >
                  Dari Satu Mesin Jahit<br />Menjadi Studio Pilihan
                </h2>
              </div>

              <div className="w-12 h-px bg-[#000000]" aria-hidden="true" />

              <div className="flex flex-col gap-5">
                {story.map((s, i) => (
                  <p
                    key={i}
                    className="text-[18px] font-normal text-[#000000] leading-[1.70]"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {s.paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Kanan: gambar */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              {/* Gambar utama */}
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '115%' }}>
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
                  alt="Mesin jahit di workshop Blackant Studio"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
                {/* Caption editorial */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#000000] px-5 py-3">
                  <span
                    className="text-[13px] font-normal text-[#ffffff] tracking-widest uppercase"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Workshop · Jakarta, 2016–sekarang
                  </span>
                </div>
              </div>

              {/* Gambar kecil kedua */}
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '60%' }}>
                <Image
                  src="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=900&q=80"
                  alt="Proses produksi tekstil di Blackant Studio"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </div>

          </div>
        </section>

        {/* ── Visi & Misi ──────────────────────────────────── */}
        <section className="border-t border-[#e5e5e5] bg-[#ffffff]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-16 md:py-24">

            {/* Header section */}
            <div className="mb-10 md:mb-14">
              <span
                className="block text-[15px] font-normal text-[#878787] tracking-widest uppercase mb-3"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Nilai Kami
              </span>
              <h2
                className="text-[clamp(24px,3.5vw,40px)] font-normal text-[#000000] leading-[1.10]"
                style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
              >
                Visi &amp; Misi
              </h2>
            </div>

            {/* 2 Cards berdampingan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {visiMisi.map((item) => (
                <Card
                  key={item.type}
                  className="rounded-none border border-[#e5e5e5] shadow-none bg-[#ffffff] p-0"
                >
                  <CardHeader className="pb-0 px-8 pt-8">
                    {/* Label Visi / Misi */}
                    <span
                      className="block text-[13px] font-normal text-[#878787] tracking-widest uppercase mb-4"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {item.type}
                    </span>
                    <CardTitle
                      className="text-[21px] font-normal text-[#000000] leading-[1.30]"
                      style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
                    >
                      {item.heading}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-8 pb-8 pt-6">
                    {/* Hairline */}
                    <div className="w-10 h-px bg-[#000000] mb-6" aria-hidden="true" />
                    <ul className="flex flex-col gap-3" role="list">
                      {item.points.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-[15px] font-normal text-[#000000] leading-[1.65]"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          <span
                            className="mt-[6px] w-[5px] h-[5px] shrink-0 bg-[#000000]"
                            aria-hidden="true"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tim Kami ─────────────────────────────────────── */}
        <section className="border-t border-[#e5e5e5]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-16 md:py-24">

            <div className="mb-10 md:mb-14">
              <span
                className="block text-[15px] font-normal text-[#878787] tracking-widest uppercase mb-3"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Orang-orang di Baliknya
              </span>
              <h2
                className="text-[clamp(24px,3.5vw,40px)] font-normal text-[#000000] leading-[1.10]"
                style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
              >
                Tim Kami
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {team.map((member) => (
                <div key={member.name} className="flex flex-col gap-3">
                  {/* Avatar placeholder — monochrome square */}
                  <div className="relative w-full overflow-hidden bg-[#f5f5f5]" style={{ paddingBottom: '100%' }}>
                    <Image
                      src={`https://images.unsplash.com/photo-${
                        member.name === 'Andi Pratama' ? '1507003211169-0a1dd7228f2d' :
                        member.name === 'Siti Rahayu' ? '1494790108377-be9c29b29330' :
                        member.name === 'Rizki Firmansyah' ? '1500648767791-00dcc994a43e' :
                        '1438761681033-6461ffad8d80'
                      }?w=400&q=80&fit=crop&crop=face`}
                      alt={`Foto ${member.name}`}
                      fill
                      className="object-cover grayscale"
                      sizes="(max-width: 640px) 50vw, 25vw"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p
                      className="text-[18px] font-bold text-[#000000] leading-snug"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {member.name}
                    </p>
                    <p
                      className="mt-1 text-[15px] font-normal text-[#878787] leading-[1.65]"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
