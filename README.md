## SIP-Kepengawasan Jateng

Sistem Informasi dan Pengelolaan Kepengawasan SMA & SLB Provinsi Jawa Tengah.

### Teknologi Inti

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui components
- React Query, React Hook Form, Zod
- Supabase (Auth, Database, Storage)

### Prasyarat

- Node.js 18.18+ (disarankan 20 LTS)
- npm 10+
- Akun Supabase dengan project aktif

### Konfigurasi Environment

Salin `supabase.env.example` menjadi `.env.local` lalu isi dengan kredensial Supabase Anda:

```bash
cp supabase.env.example .env.local
```

| Variabel | Deskripsi |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key untuk tugas server-side |

> **Catatan:** Service role hanya digunakan di lingkungan server (server actions, cron, dsb). Jangan bagikan nilai ini secara publik.

### Menjalankan Proyek

```bash
npm install
npm run dev
```

Server dev tersedia di [http://localhost:3000](http://localhost:3000).

### Struktur Direktori Awal

- `app/(public)` – halaman publik (landing, profil, dsb)
- `app/providers.tsx` – penyedia global (Theme & React Query)
- `components/layout` – header/footer dan komponen tata letak
- `components/ui` – komponen shadcn/ui
- `config/site.ts` – metadata dan konfigurasi situs
- `lib/supabase` – utilitas Supabase (browser, server, admin)

### Setup Akun Admin

Untuk login sebagai admin, akun admin perlu dibuat terlebih dahulu di Supabase:

**Cara 1: Via Supabase Dashboard (Disarankan)**
1. Buka Supabase Dashboard → Authentication → Users
2. Klik "Add User" → "Create new user"
3. Isi email: `mkps@garuda-21.com`, password: `mkps123`
4. Centang "Auto Confirm User"
5. Klik "Create User"

**Cara 2: Via API Route**
Setelah server berjalan, gunakan Postman atau curl untuk POST ke `/api/auth/create-admin`:
```json
{
  "email": "mkps@garuda-21.com",
  "password": "mkps123"
}
```

**Email Admin yang Dikenali:**
- `mkps@garuda-21.com`
- `admin@sip-mkps.id`

Untuk menambah email admin lain, edit array `ADMIN_EMAILS` di `app/api/auth/login/route.ts`.

### Langkah Lanjutan

1. Selesaikan desain halaman publik (konten aktual, ilustrasi, aset brand).
2. Siapkan skema Supabase (auth, tabel pengawas, sekolah, konten).
3. Bangun modul portal pengawas (dashboard, manajemen data, pelaporan).
4. Integrasikan analitik, notifikasi, dan generator PDF.

Semua langkah lanjutan akan dijalankan bertahap sesuai roadmap pengembangan.
