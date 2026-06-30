import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hubungi Kami — Blackant Studio',
  description:
    'Konsultasikan kebutuhan custom apparel Anda dengan tim Blackant Studio. Isi form inquiry dan kami akan respon via WhatsApp dalam 1×24 jam.',
};

export default function KontakLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

