'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import SubmitButton from './submit-button';
import { submitInquiry, type InquiryActionState } from '@/actions/inquiry';

/* ─── Constants ─────────────────────────────────────────────── */
const WA_NUMBER = '6285731813118';

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

const initialState: InquiryActionState = { status: 'idle' };

/* ─── Field Error ───────────────────────────────────────────── */
function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p
      className="flex items-center gap-1.5 text-[13px] text-red-600 mt-1"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      role="alert"
    >
      <AlertCircle size={13} className="shrink-0" />
      {messages[0]}
    </p>
  );
}

/* ─── Label style ───────────────────────────────────────────── */
const labelClass =
  'text-[13px] font-normal text-[#000000] uppercase tracking-widest';
const inputClass =
  'rounded-none border-[#e5e5e5] focus-visible:ring-0 focus-visible:border-[#000000] text-[15px] h-11 placeholder:text-[#878787]';

/* ─── Page ──────────────────────────────────────────────────── */
export default function KontakPage() {
  const [state, formAction] = useActionState(submitInquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Saat Server Action berhasil → buka WhatsApp di tab baru & reset form
  useEffect(() => {
    if (state.status === 'success' && state.waUrl) {
      window.open(state.waUrl, '_blank', 'noopener,noreferrer');
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ffffff] pt-16">

        {/* ── Hero ────────────────────────────────────────── */}
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

        {/* ── 2 Kolom ─────────────────────────────────────── */}
        <section className="mx-auto max-w-[1200px] px-6 md:px-8 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">

            {/* ── Kiri: Info Kontak ──────────────────────── */}
            <div className="flex flex-col gap-10">
              {/* Contact items */}
              <div className="flex flex-col gap-7">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
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
                            className="text-[15px] font-normal text-[#000000] leading-[1.65] hover:text-[#878787] transition-colors no-underline"
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

              <div className="w-full h-px bg-[#e5e5e5]" aria-hidden="true" />

              {/* Maps */}
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
                  />
                </div>
              </div>

              {/* WA shortcut */}
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 h-12 px-6 bg-[#000000] text-[#ffffff] text-[15px] font-normal hover:bg-[#333] transition-colors self-start"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
                Chat WhatsApp Langsung
              </a>
            </div>

            {/* ── Kanan: Form Inquiry ────────────────────── */}
            <div className="border border-[#e5e5e5] p-8 md:p-10">

              {/* Form header */}
              <div className="flex flex-col gap-2 mb-6">
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
                  Isi form — pesan Anda akan langsung dikirim ke WhatsApp kami.
                </p>
              </div>

              <div className="w-10 h-px bg-[#e5e5e5] mb-6" aria-hidden="true" />

              {/* ── Global error/success banner ─────────── */}
              {state.status === 'error' && state.message && (
                <div
                  className="flex items-start gap-3 p-4 mb-6 border border-red-200 bg-red-50"
                  role="alert"
                >
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <p
                    className="text-[14px] text-red-700"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {state.message}
                  </p>
                </div>
              )}

              {state.status === 'success' && (
                <div
                  className="flex items-start gap-3 p-4 mb-6 border border-green-200 bg-green-50"
                  role="status"
                >
                  <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                  <p
                    className="text-[14px] text-green-700"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Pesan berhasil diformat! WhatsApp akan terbuka sebentar lagi.
                  </p>
                </div>
              )}

              {/* ── Form ────────────────────────────────── */}
              <form
                ref={formRef}
                action={formAction}
                noValidate
                className="flex flex-col gap-5"
              >
                {/* Nama */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="nama" className={labelClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Nama Lengkap <span className="text-[#878787]">*</span>
                  </Label>
                  <Input
                    id="nama"
                    name="nama"
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    autoComplete="name"
                    className={`${inputClass} ${state.fieldErrors?.nama ? 'border-red-400 focus-visible:border-red-400' : ''}`}
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    aria-describedby={state.fieldErrors?.nama ? 'nama-error' : undefined}
                  />
                  <FieldError messages={state.fieldErrors?.nama} />
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="whatsapp" className={labelClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Nomor WhatsApp <span className="text-[#878787]">*</span>
                  </Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    autoComplete="tel"
                    className={`${inputClass} ${state.fieldErrors?.whatsapp ? 'border-red-400 focus-visible:border-red-400' : ''}`}
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  />
                  <FieldError messages={state.fieldErrors?.whatsapp} />
                </div>

                {/* Jenis + Jumlah side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Jenis */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="jenis" className={labelClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Jenis Pakaian <span className="text-[#878787]">*</span>
                    </Label>
                    <Select name="jenis">
                      <SelectTrigger
                        id="jenis"
                        className={`rounded-none h-11 text-[15px] border-[#e5e5e5] focus:ring-0 focus:border-[#000000] data-[placeholder]:text-[#878787] ${state.fieldErrors?.jenis ? 'border-red-400' : ''}`}
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
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
                    <FieldError messages={state.fieldErrors?.jenis} />
                  </div>

                  {/* Jumlah */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="jumlah" className={labelClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Estimasi Jumlah (pcs) <span className="text-[#878787]">*</span>
                    </Label>
                    <Input
                      id="jumlah"
                      name="jumlah"
                      type="number"
                      min="1"
                      placeholder="Contoh: 50"
                      className={`${inputClass} ${state.fieldErrors?.jumlah ? 'border-red-400 focus-visible:border-red-400' : ''}`}
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    />
                    <FieldError messages={state.fieldErrors?.jumlah} />
                  </div>
                </div>

                {/* Detail */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="detail" className={labelClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Detail Pesanan <span className="text-[#878787]">*</span>
                  </Label>
                  <Textarea
                    id="detail"
                    name="detail"
                    rows={5}
                    placeholder="Ceritakan detail: ukuran, warna, bahan, sablon/bordir, deadline, dll."
                    className={`rounded-none border-[#e5e5e5] focus-visible:ring-0 focus-visible:border-[#000000] text-[15px] resize-none placeholder:text-[#878787] ${state.fieldErrors?.detail ? 'border-red-400 focus-visible:border-red-400' : ''}`}
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  />
                  <FieldError messages={state.fieldErrors?.detail} />
                </div>

                {/* Submit */}
                <SubmitButton />

                <p
                  className="text-[13px] font-normal text-[#878787] text-center leading-[1.65]"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Pesan akan terbuka di WhatsApp — tidak ada data yang disimpan di server.
                </p>
              </form>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
