'use client';

import { useState, FormEvent } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

/* ─── Konstanta ─────────────────────────────────────────────── */
const WA_NUMBER = '6285731813118'; // Ganti nomor WA di sini

const contactInfo = [
  {
    icon: MapPin,
    label: 'Alamat',
    value: 'Jl. Raya Konveksi No. 12, Cipadu, Larangan\nTangerang, Banten 15155',
  },
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '+62 857-3181-3118',
    href: `https://wa.me/${WA_NUMBER}`,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@blackantstudio.id',
    href: 'mailto:hello@blackantstudio.id',
  },
  {
    icon: Clock,
    label: 'Jam Operasional',
    value: 'Senin – Sabtu: 08.00 – 17.00 WIB\nMinggu & Libur: Tutup',
  },
];

const jenisOptions = [
  'Kaos / T-Shirt',
  'Polo Shirt',
  'Hoodie / Sweater',
  'Jaket',
  'Kemeja',
  'Seragam Kerja',
  'Jersey Olahraga',
  'Topi / Aksesoris',
  'Lainnya',
];

/* ─── Form ──────────────────────────────────────────────────── */
interface FormData {
  nama: string;
  whatsapp: string;
  jenis: string;
  jumlah: string;
  detail: string;
}

const emptyForm: FormData = {
  nama: '',
  whatsapp: '',
  jenis: '',
  jumlah: '',
  detail: '',
};

export default function KontakPage() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!form.nama.trim()) newErrors.nama = 'Nama wajib diisi.';
    if (!form.whatsapp.trim()) newErrors.whatsapp = 'Nomor WhatsApp wajib diisi.';
    if (!form.jenis) newErrors.jenis = 'Pilih jenis pakaian.';
    if (!form.jumlah.trim()) newErrors.jumlah = 'Estimasi jumlah wajib diisi.';
    if (!form.detail.trim()) newErrors.detail = 'Detail pesanan wajib diisi.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const text = [
      `Halo, saya *${form.nama}*.`,
      ``,
      `Saya ingin memesan *${form.jenis}* sebanyak *${form.jumlah} pcs*.`,
      ``,
      `📋 *Detail Pesanan:*`,
      form.detail,
      ``,
      `📞 Nomor saya: ${form.whatsapp}`,
    ].join('\n');

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
  }

  function field(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

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
              Mulai Percakapan
            </span>
            <h1
              className="text-[clamp(32px,5vw,56px)] font-normal text-[#000000] leading-[1.10] max-w-2xl"
              style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
            >
              Hubungi Kami
            </h1>
            <p
              className="max-w-lg text-[18px] font-normal text-[#000000] leading-[1.70]"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Ceritakan kebutuhan Anda — kami akan respon dalam 1×24 jam dan siapkan penawaran terbaik.
            </p>
          </div>
        </section>

        {/* ── 2 Kolom utama ────────────────────────────────── */}
        <section className="mx-auto max-w-[1200px] px-6 md:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">

            {/* ── Kolom Kiri: Info Kontak ─────────────────── */}
            <div className="flex flex-col gap-10">

              {/* Info items */}
              <div className="flex flex-col gap-7">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      {/* Icon box */}
                      <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-[#e5e5e5]">
                        <Icon size={16} strokeWidth={1.5} className="text-[#000000]" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <span
                          className="text-[13px] font-normal text-[#878787] uppercase tracking-widest"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          {item.label}
                        </span>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[15px] font-normal text-[#000000] leading-[1.65] hover:text-[#878787] transition-colors duration-150 no-underline"
                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p
                            className="text-[15px] font-normal text-[#000000] leading-[1.65] whitespace-pre-line"
                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                          >
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hairline */}
              <div className="w-full h-px bg-[#e5e5e5]" aria-hidden="true" />

              {/* Google Maps embed */}
              <div className="flex flex-col gap-3">
                <span
                  className="text-[13px] font-normal text-[#878787] uppercase tracking-widest"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Lokasi
                </span>
                <div className="relative w-full overflow-hidden border border-[#e5e5e5]" style={{ paddingBottom: '65%' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0899!2d106.7270!3d-6.2300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnNDgiLjAiUyAxMDbCsDQzJzM3LjIiRQ!5e0!3m2!1sid!2sid!4v1680000000000!5m2!1sid!2sid"
                    className="absolute inset-0 w-full h-full border-0 grayscale"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Blackant Studio"
                    aria-label="Peta lokasi Blackant Studio"
                  />
                </div>
              </div>

              {/* WA shortcut */}
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 h-12 px-6 bg-[#000000] text-[#ffffff] text-[15px] font-normal hover:bg-[#878787] transition-colors duration-200 self-start"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
                Chat WhatsApp Langsung
              </a>
            </div>

            {/* ── Kolom Kanan: Form Inquiry ───────────────── */}
            <div className="flex flex-col gap-0">
              <div className="border border-[#e5e5e5] p-8 md:p-10">

                {/* Form header */}
                <div className="flex flex-col gap-2 mb-8">
                  <h2
                    className="text-[21px] font-normal text-[#000000] leading-snug"
                    style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
                  >
                    Form Inquiry Pesanan
                  </h2>
                  <p
                    className="text-[15px] font-normal text-[#878787] leading-[1.65]"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Isi form di bawah — pesan Anda akan langsung dikirim ke WhatsApp kami.
                  </p>
                </div>

                <div className="w-10 h-px bg-[#e5e5e5] mb-8" aria-hidden="true" />

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

                  {/* Nama Lengkap */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="nama"
                      className="text-[13px] font-normal text-[#000000] uppercase tracking-widest"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      Nama Lengkap <span className="text-[#878787]">*</span>
                    </Label>
                    <Input
                      id="nama"
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={form.nama}
                      onChange={(e) => field('nama', e.target.value)}
                      className="rounded-none border-[#e5e5e5] focus-visible:ring-0 focus-visible:border-[#000000] text-[15px] h-11 placeholder:text-[#878787]"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      aria-describedby={errors.nama ? 'nama-error' : undefined}
                    />
                    {errors.nama && (
                      <p id="nama-error" className="text-[13px] text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {errors.nama}
                      </p>
                    )}
                  </div>

                  {/* Nomor WhatsApp */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="whatsapp"
                      className="text-[13px] font-normal text-[#000000] uppercase tracking-widest"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      Nomor WhatsApp <span className="text-[#878787]">*</span>
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={form.whatsapp}
                      onChange={(e) => field('whatsapp', e.target.value)}
                      className="rounded-none border-[#e5e5e5] focus-visible:ring-0 focus-visible:border-[#000000] text-[15px] h-11 placeholder:text-[#878787]"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      aria-describedby={errors.whatsapp ? 'wa-error' : undefined}
                    />
                    {errors.whatsapp && (
                      <p id="wa-error" className="text-[13px] text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>

                  {/* Jenis Pakaian + Estimasi Jumlah — side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* Jenis Pakaian */}
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="jenis"
                        className="text-[13px] font-normal text-[#000000] uppercase tracking-widest"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        Jenis Pakaian <span className="text-[#878787]">*</span>
                      </Label>
                      <Select
                        value={form.jenis}
                        onValueChange={(val) => field('jenis', val)}
                      >
                        <SelectTrigger
                          id="jenis"
                          className="rounded-none border-[#e5e5e5] focus:ring-0 focus:border-[#000000] text-[15px] h-11 data-[placeholder]:text-[#878787]"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                          aria-describedby={errors.jenis ? 'jenis-error' : undefined}
                        >
                          <SelectValue placeholder="Pilih jenis..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-[#e5e5e5]">
                          {jenisOptions.map((opt) => (
                            <SelectItem
                              key={opt}
                              value={opt}
                              className="text-[15px] rounded-none cursor-pointer"
                              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                            >
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.jenis && (
                        <p id="jenis-error" className="text-[13px] text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {errors.jenis}
                        </p>
                      )}
                    </div>

                    {/* Estimasi Jumlah */}
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="jumlah"
                        className="text-[13px] font-normal text-[#000000] uppercase tracking-widest"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        Estimasi Jumlah (pcs) <span className="text-[#878787]">*</span>
                      </Label>
                      <Input
                        id="jumlah"
                        type="number"
                        min="1"
                        placeholder="Contoh: 50"
                        value={form.jumlah}
                        onChange={(e) => field('jumlah', e.target.value)}
                        className="rounded-none border-[#e5e5e5] focus-visible:ring-0 focus-visible:border-[#000000] text-[15px] h-11 placeholder:text-[#878787]"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        aria-describedby={errors.jumlah ? 'jumlah-error' : undefined}
                      />
                      {errors.jumlah && (
                        <p id="jumlah-error" className="text-[13px] text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {errors.jumlah}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detail Pesanan */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="detail"
                      className="text-[13px] font-normal text-[#000000] uppercase tracking-widest"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      Detail Pesanan <span className="text-[#878787]">*</span>
                    </Label>
                    <Textarea
                      id="detail"
                      placeholder="Ceritakan detail kebutuhan Anda: ukuran, warna, bahan, sablon/bordir, deadline, dll."
                      rows={5}
                      value={form.detail}
                      onChange={(e) => field('detail', e.target.value)}
                      className="rounded-none border-[#e5e5e5] focus-visible:ring-0 focus-visible:border-[#000000] text-[15px] resize-none placeholder:text-[#878787]"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      aria-describedby={errors.detail ? 'detail-error' : undefined}
                    />
                    {errors.detail && (
                      <p id="detail-error" className="text-[13px] text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {errors.detail}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-none bg-[#000000] text-[#ffffff] text-[15px] font-normal hover:bg-[#878787] transition-colors duration-200 flex items-center justify-center gap-3 cursor-pointer"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    <Send size={16} strokeWidth={1.5} aria-hidden="true" />
                    Kirim via WhatsApp
                  </Button>

                  <p
                    className="text-[13px] font-normal text-[#878787] text-center leading-[1.65]"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Pesan akan terbuka di WhatsApp — tidak ada data yang disimpan di server.
                  </p>
                </form>
              </div>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
