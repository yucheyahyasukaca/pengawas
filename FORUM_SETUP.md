# Setup Forum Komunikasi Pengawas

Dokumen ini menjelaskan fitur forum komunikasi yang telah dibuat dan cara setup-nya.

## Fitur yang Telah Dibuat

### 1. Database Schema
- **forum_threads**: Tabel untuk thread utama
- **forum_replies**: Tabel untuk balasan thread
- **forum_attachments**: Tabel untuk lampiran gambar

### 2. API Routes
- `GET /api/forum/threads` - List semua thread
- `POST /api/forum/threads` - Buat thread baru
- `GET /api/forum/threads/[id]` - Detail thread dengan replies
- `PUT /api/forum/threads/[id]` - Edit thread
- `DELETE /api/forum/threads/[id]` - Hapus thread (soft delete)
- `POST /api/forum/threads/[id]/replies` - Buat reply
- `PUT /api/forum/replies/[id]` - Edit reply
- `DELETE /api/forum/replies/[id]` - Hapus reply (soft delete)
- `POST /api/forum/upload` - Upload gambar

### 3. UI Pages
- `/pengawas/forum` - Halaman list thread
- `/pengawas/forum/buat` - Halaman buat thread baru
- `/pengawas/forum/[id]` - Halaman detail thread dengan replies

### 4. Fitur Utama
- ✅ Pengawas dapat posting thread
- ✅ Thread dapat di-reply oleh pengawas lain
- ✅ Gambar dapat dilampirkan di thread maupun reply
- ✅ Admin dapat mengedit/hapus thread yang dibuat pengawas
- ✅ Tampilan menarik, ringan, dan mobile-friendly
- ✅ Search dan filter thread
- ✅ Soft delete untuk menjaga integritas data

## Setup Instructions

### 1. Jalankan Database Migration

Jalankan migration SQL di Supabase:
```sql
-- File: supabase/migrations/008_create_forum_tables.sql
```

Cara menjalankan:
1. Buka Supabase Dashboard → SQL Editor
2. Copy-paste isi file `supabase/migrations/008_create_forum_tables.sql`
3. Klik "Run" untuk menjalankan migration

### 2. Setup Supabase Storage Bucket

1. Buka Supabase Dashboard → Storage
2. Klik "New bucket"
3. Isi form:
   - **Name**: `forum-attachments`
   - **Public bucket**: ✅ YES (agar gambar bisa diakses)
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
4. Klik "Create bucket"

### 3. Setup Storage Policies

Setelah bucket dibuat, buat policies di Storage → Policies:

#### Policy 1: "Pengawas can upload files"
- **Operation**: INSERT
- **Policy name**: "Pengawas can upload files"
- **Policy definition** (gunakan salah satu format berikut):

**Format 1 (Recommended)**:
```sql
(bucket_id = 'forum-attachments' AND EXISTS (
  SELECT 1 FROM public.users
  WHERE users.id = auth.uid()
  AND users.role = 'pengawas'
  AND users.status_approval = 'approved'
))
```

**Format 2 (Alternatif jika Format 1 error)**:
```sql
(bucket_id = 'forum-attachments' AND 
 (SELECT role FROM public.users WHERE id = auth.uid()) = 'pengawas' AND
 (SELECT status_approval FROM public.users WHERE id = auth.uid()) = 'approved')
```

**Format 3 (Paling sederhana - jika masih error)**:
```sql
EXISTS (
  SELECT 1 FROM public.users
  WHERE users.id = auth.uid()
  AND users.role = 'pengawas'
  AND users.status_approval = 'approved'
)
```

#### Policy 2: "Anyone can view files"
- **Operation**: SELECT
- **Policy name**: "Anyone can view files"
- **Policy definition**: 
  - Jika bucket sudah public: kosongkan atau gunakan `bucket_id = 'forum-attachments'`
  - Jika bucket private: `bucket_id = 'forum-attachments'`

### 4. Verifikasi Setup

1. Login sebagai pengawas yang sudah approved
2. Buka menu "Forum Komunikasi" di sidebar
3. Coba buat thread baru dengan gambar
4. Coba reply thread dengan gambar
5. Login sebagai admin dan coba edit/hapus thread

## Struktur File

```
app/
├── (pengawas)/
│   └── pengawas/
│       └── forum/
│           ├── page.tsx              # List thread
│           ├── buat/
│           │   └── page.tsx          # Buat thread baru
│           └── [id]/
│               ├── page.tsx          # Detail thread
│               └── edit-modal.tsx     # Modal edit thread
├── api/
│   └── forum/
│       ├── threads/
│       │   ├── route.ts              # GET/POST threads
│       │   └── [id]/
│       │       ├── route.ts           # GET/PUT/DELETE thread
│       │       └── replies/
│       │           └── route.ts       # POST reply
│       ├── replies/
│       │   └── [id]/
│       │       └── route.ts           # PUT/DELETE reply
│       └── upload/
│           └── route.ts               # POST upload image

supabase/
└── migrations/
    └── 008_create_forum_tables.sql    # Database migration

config/
└── pengawas.ts                        # Navigation config (updated)
```

## Catatan Penting

1. **Akses Forum**: Hanya pengawas dengan status `approved` yang dapat mengakses forum
2. **Moderasi Admin**: Admin dapat mengedit dan menghapus semua thread/reply
3. **Soft Delete**: Thread dan reply yang dihapus tidak benar-benar dihapus, hanya ditandai sebagai deleted
4. **Image Upload**: Maksimal 5MB per gambar, format: JPEG, PNG, GIF, WebP
5. **Mobile Friendly**: Semua halaman sudah responsive dan mobile-friendly

## Troubleshooting

### Error: "Storage bucket not found"
- Pastikan bucket `forum-attachments` sudah dibuat di Supabase Storage
- Pastikan nama bucket sesuai dengan yang digunakan di API (`app/api/forum/upload/route.ts`)

### Error: "Unauthorized: Pengawas access required"
- Pastikan user sudah login sebagai pengawas
- Pastikan status approval pengawas adalah `approved`
- Cek di tabel `users` apakah role dan status_approval sudah benar

### Error: "Gagal mengupload file"
- Pastikan storage policies sudah dibuat dengan benar
- Pastikan bucket `forum-attachments` adalah public bucket
- Cek ukuran file tidak melebihi 5MB

### Thread tidak muncul
- Pastikan migration sudah dijalankan
- Cek apakah thread sudah di-soft delete (is_deleted = false)
- Pastikan user yang login adalah pengawas yang approved

## Fitur Tambahan yang Bisa Dikembangkan

- [ ] Notifikasi saat ada reply baru di thread yang diikuti
- [ ] Like/upvote untuk thread dan reply
- [ ] Tag/kategori untuk thread
- [ ] Pinned thread
- [ ] Rich text editor untuk formatting
- [ ] Quote reply
- [ ] Thread following/bookmark
- [ ] Search dengan filter advanced
- [ ] Pagination untuk list thread

