# KarirHub

> **Platform rekrutmen digital** yang menghubungkan pencari kerja dengan perusahaan di Indonesia secara efisien dan transparan.

[![Tech Stack](https://img.shields.io/badge/React_Router-v7-blue)](https://reactrouter.com)
[![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-v3-38B2AC)](https://tailwindcss.com)
[![Tech Stack](https://img.shields.io/badge/Hono-Runtime-orange)](https://hono.dev)

---

## Deskripsi

KarirHub adalah sebuah **platform rekrutmen digital** berbasis web yang dirancang sebagai Final Project untuk mata kuliah **Manajemen Basis Data D** di Institut Teknologi Sepuluh Nopember (ITS). Platform ini menghubungkan tiga pihak utama:

- **Pencari Kerja (Job Seeker)** — mencari lowongan, melamar pekerjaan, melacak status lamaran, dan mengelola profil.
- **Perusahaan (Company)** — memposting lowongan, mengelola pelamar, menjadwalkan wawancara, dan memantau proses rekrutmen.
- **Admin** — memverifikasi akun perusahaan, mengelola master data skill, dan memantau aktivitas platform.

---

## Fitur Utama

### Untuk Pencari Kerja

- 🔍 Pencarian lowongan dengan filter (kata kunci, kota, tipe pekerjaan, tipe kerja)
- 📋 Melamar pekerjaan dengan cover letter
- 📊 Dashboard dengan statistik lamaran
- 🔔 Notifikasi status lamaran
- 👤 Profil dengan pendidikan, pengalaman kerja, dan skill

### Untuk Perusahaan

- 📝 Membuat, mengedit, dan mengelola lowongan pekerjaan
- 👥 Melihat dan mengelola pelamar
- ✅ Menyaring pelamar melalui tahapan rekrutmen
- 📅 Menjadwalkan wawancara (online/onsite)
- 🔔 Notifikasi pelamar baru

### Untuk Admin

- 📈 Dashboard platform dengan statistik keseluruhan
- ✅ Verifikasi akun perusahaan
- 🏷️ Kelola master data skill
- 📋 Pantau aktivitas platform

---

## Teknologi

| Kategori            | Teknologi                               |
| ------------------- | --------------------------------------- |
| **Framework**       | React Router v7 (Framework Mode)        |
| **UI**              | React 18, Tailwind CSS v3, Lucide Icons |
| **Server**          | Hono + `react-router-hono-server`       |
| **Database**        | Neon Postgres                           |
| **Auth**            | Auth.js (Credentials Provider)          |
| **Build Tool**      | Vite 6                                  |
| **Package Manager** | npm                                     |
| **Testing**         | Vitest + jsdom + Testing Library        |
| **Type Checking**   | TypeScript                              |

---

## Struktur Direktori

```
├── src/
│   ├── app/                    # File-based routing (mimic Next.js App Router)
│   │   ├── layout.jsx          # Root layout (Navbar + Footer + MobileBottomNav)
│   │   ├── root.tsx            # HTML document root (SSR entry)
│   │   ├── page.jsx            # Landing page
│   │   ├── routes.ts           # Route tree generator
│   │   ├── global.css          # Tailwind directives
│   │   ├── login/              # Halaman login
│   │   ├── register/           # Halaman registrasi
│   │   ├── jobs/               # Daftar lowongan & detail
│   │   ├── companies/          # Profil perusahaan
│   │   ├── seeker/             # Dashboard, profil, lamaran (job seeker)
│   │   ├── company/            # Dashboard, lowongan, pelamar (company)
│   │   ├── admin/              # Dashboard, verifikasi, skill (admin)
│   │   └── api/                # API routes (auth token, etc.)
│   ├── components/
│   │   ├── layout/             # Navbar, Sidebar, Footer, MobileBottomNav
│   │   ├── jobs/               # JobCard
│   │   ├── applications/       # StageTimeline
│   │   └── shared/             # StatusBadge, SkillBadge
│   ├── context/
│   │   └── AppContext.jsx      # Auth state & role management
│   ├── data/                   # Mock data (jobs, companies, applications, etc.)
│   ├── lib/
│   │   └── utils.js            # Formatting helpers (salary, date, etc.)
│   └── utils/                  # Custom hooks (useAuth, useUser, etc.)
├── __create/                   # Server entry & infrastructure
│   └── index.ts                # Hono server (Auth.js, Neon, API routing)
├── plugins/                    # Custom Vite plugins
├── public/                     # Static assets (PWA manifest, service worker, icons)
├── test/                       # Test setup
├── vite.config.ts              # Vite configuration
├── react-router.config.ts      # React Router configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies & scripts
```

---

## Memulai

### Prasyarat

- Node.js 20+ (untuk compatibility)
- npm 10+ (disarankan)

### Instalasi

```bash
# Clone repository
git clone <repository-url>
cd Final-Project-MBD-KarirHub

# Install dependencies
npm install
```

### Menjalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:4000`.

### Type Checking

```bash
npm run typecheck
```

### Testing

```bash
# Run all tests
npx vitest run

# Run specific test pattern
npx vitest run <pattern>
```

---

## Lisensi

Proyek ini dibuat untuk keperluan akademik.

---

> **Catatan:** Proyek ini merupakan prototype dengan data mock yang dirancang untuk mendemonstrasikan konsep platform rekrutmen digital dan skema database yang lengkap. Server-side (Hono + Neon Postgres + Auth.js) telah dikonfigurasi untuk deployment production.
