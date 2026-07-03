# Blackant Studio

Website company profile & katalog produk untuk **Blackant Studio** — konveksi custom apparel.

Built with **Next.js 16 App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, dan **Supabase**.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Validasi | Zod |
| Deploy | Vercel (recommended) |

---

## Struktur Halaman

| Route | Halaman |
|---|---|
| `/` | Home — Hero + Portfolio grid |
| `/katalog` | Daftar produk dari Supabase |
| `/katalog/[id]` | Detail produk + Produk terkait |
| `/tentang` | Tentang studio |
| `/layanan` | Layanan & proses kerja |
| `/kontak` | Form inquiry → WhatsApp redirect |

---

## Setup Lokal

### 1. Clone & install dependencies

```bash
git clone https://github.com/maspw/BlackAnt-Project.git
cd BlackAnt-Project
npm install
```

### 2. Setup Environment Variables

Copy file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Lalu isi nilai-nilainya (lihat bagian [Environment Variables](#environment-variables) di bawah).

### 3. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Environment Variables

Semua variabel disimpan di `.env.local` — **tidak pernah di-commit ke Git**.
Template tersedia di [`.env.example`](./.env.example).

### `NEXT_PUBLIC_SUPABASE_URL`

URL proyek Supabase Anda.

**Cara mendapatkan:**
1. Buka [supabase.com/dashboard](https://supabase.com/dashboard)
2. Pilih project → **Project Settings** → **API**
3. Copy nilai **Project URL**

```
NEXT_PUBLIC_SUPABASE_URL=https://xyzabcdef.supabase.co
```

---

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

API key publik (anon) Supabase — aman di client side karena dilindungi Row Level Security (RLS).

**Cara mendapatkan:**
1. Buka [supabase.com/dashboard](https://supabase.com/dashboard)
2. Pilih project → **Project Settings** → **API**
3. Copy nilai **anon** / **public** key

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ Jangan gunakan `service_role` key di sini.

---

### `NEXT_PUBLIC_WHATSAPP_NUMBER`

Nomor WhatsApp penerima pesan dari form inquiry & tombol floating.

**Format:** kode negara + nomor tanpa `+` atau spasi.

```
# Indonesia (+62), nomor 0857-3181-3118 → 6285731813118
NEXT_PUBLIC_WHATSAPP_NUMBER=6285731813118
```

---

### `NEXT_PUBLIC_APP_NAME` & `NEXT_PUBLIC_APP_URL`

```
NEXT_PUBLIC_APP_NAME=Blackant Studio
NEXT_PUBLIC_APP_URL=http://localhost:3000   # ganti ke domain production saat deploy
```

---

## Setup Supabase

Jalankan SQL berikut di **Supabase SQL Editor** ([app.supabase.com](https://app.supabase.com) → SQL Editor):

```sql
-- Tabel produk
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null,
  description text,
  image_url   text,
  price       numeric,
  created_at  timestamptz default now()
);

-- Tabel portfolio (opsional)
create table if not exists portfolio (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null,
  description text,
  image_url   text,
  sort_order  integer,
  created_at  timestamptz default now()
);

-- Row Level Security — izinkan baca publik
alter table products enable row level security;
create policy "Allow public read" on products for select using (true);

alter table portfolio enable row level security;
create policy "Allow public read" on portfolio for select using (true);
```

---

## Scripts

```bash
npm run dev      # Dev server dengan Turbopack
npm run build    # Production build
npm run start    # Jalankan production build
npm run lint     # ESLint check
```

---

## Struktur Folder

```
blackant/
├── actions/           # Server Actions (form + Zod validation)
│   └── inquiry.ts
├── app/               # Next.js App Router
│   ├── katalog/
│   │   └── [id]/      # Dynamic route detail produk
│   ├── kontak/
│   ├── layanan/
│   ├── tentang/
│   ├── error.tsx      # Error boundary global
│   ├── loading.tsx    # Loading state global
│   └── not-found.tsx  # 404 global
├── components/        # Komponen React
│   ├── ui/            # shadcn/ui components
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── hero-section.tsx
│   └── FloatingWhatsApp.tsx
├── lib/               # Supabase clients
│   ├── supabaseClient.ts   # Browser client (singleton)
│   └── supabase-server.ts  # Server client (factory — untuk RSC)
├── types/             # TypeScript interfaces
│   └── database.ts    # Supabase table types (Row/Insert/Update)
├── public/images/     # Foto produk lokal
├── .env.example       # Template env vars ✅ di-commit
└── .env.local         # Nilai env sebenarnya ❌ JANGAN commit
```

---

## Deploy ke Vercel

1. Push ke GitHub
2. Import repo di [vercel.com/new](https://vercel.com/new)
3. Tambahkan semua env vars ke **Project Settings → Environment Variables**
4. Klik Deploy — Vercel otomatis detect Next.js

---

## Lisensi

Private project — © Blackant Studio. All rights reserved.
