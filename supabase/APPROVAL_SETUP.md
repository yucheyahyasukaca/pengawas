# Setup Approval System untuk Pengawas

## 📋 Ringkasan

Sistem approval menambahkan workflow untuk pendaftaran pengawas:
1. Pengawas mendaftar → status: `pending`
2. Pengawas lengkapi profil → tetap status `pending`
3. Admin approve → status: `approved` → bisa akses dashboard
4. Admin reject → status: `rejected` → tidak bisa akses dashboard

## 🚀 Langkah Setup

### Langkah 1: Jalankan Migration SQL

Jalankan script berikut di Supabase SQL Editor:

**File: `supabase/migrations/002_add_pengawas_approval.sql`**

Atau gunakan script yang sudah diupdate di `supabase/QUICK_SETUP.sql` (sudah include kolom `status_approval`)

### Langkah 2: Verifikasi Kolom

Jalankan query ini untuk memastikan kolom `status_approval` sudah ada:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'status_approval';
```

### Langkah 3: Set Default Status untuk Pengawas yang Sudah Ada

Jika ada pengawas yang sudah ada sebelum sistem approval, set mereka sebagai `approved`:

```sql
UPDATE public.users 
SET status_approval = 'approved' 
WHERE role = 'pengawas' AND (status_approval IS NULL OR status_approval = '');
```

## 🔄 Flow Approval

### Untuk Pengawas Baru:

1. **Registrasi** → Status: `pending`
   - User mendaftar di `/auth/register/pengawas`
   - Role di-set sebagai `pengawas`
   - Status approval di-set sebagai `pending`

2. **Lengkapi Profil** → Status: tetap `pending`
   - User login → redirect ke `/pengawas/pending-approval` (karena pending)
   - User bisa akses `/pengawas/lengkapi-profil` untuk melengkapi data
   - Setelah lengkapi profil → tetap redirect ke `/pengawas/pending-approval`

3. **Menunggu Approval** → Status: `pending`
   - User melihat halaman `/pengawas/pending-approval`
   - Menampilkan status "Menunggu Persetujuan Admin"
   - Bisa refresh status untuk check update

4. **Admin Approve** → Status: `approved`
   - Admin buka `/admin/pengguna/approval-pengawas`
   - Review data pengawas
   - Klik "Setujui" → status berubah menjadi `approved`

5. **Akses Dashboard** → Status: `approved`
   - User login → redirect ke `/pengawas`
   - Bisa akses semua fitur dashboard pengawas

### Untuk Admin:

1. **Buka Halaman Approval**
   - Menu: `/admin/pengguna/approval-pengawas`
   - Atau dari sidebar: "Approval Pengawas"

2. **Review Data Pengawas**
   - Lihat daftar pengawas dengan status `pending` atau `rejected`
   - Informasi yang ditampilkan:
     - Nama lengkap
     - Email
     - NIP (jika sudah diisi)
     - Wilayah tugas (jika sudah diisi)
     - Sekolah binaan (jika sudah diisi)
     - Tanggal pendaftaran

3. **Approve atau Reject**
   - Klik "Setujui" → status menjadi `approved`
   - Klik "Tolak" → status menjadi `rejected`
   - Pengawas yang ditolak bisa di-approve kembali

## 📝 Status Approval

| Status | Deskripsi | Akses Dashboard |
|--------|-----------|-----------------|
| `pending` | Menunggu persetujuan admin | ❌ Tidak bisa |
| `approved` | Sudah disetujui | ✅ Bisa akses |
| `rejected` | Ditolak oleh admin | ❌ Tidak bisa |

## 🔐 Security

- Hanya admin yang bisa approve/reject pengawas
- Pengawas dengan status `pending` atau `rejected` tidak bisa akses dashboard
- Function `approve_pengawas()` dan `reject_pengawas()` menggunakan `SECURITY DEFINER`

## 📍 Halaman yang Terkait

- **Registrasi Pengawas**: `/auth/register/pengawas`
- **Lengkapi Profil**: `/pengawas/lengkapi-profil`
- **Pending Approval**: `/pengawas/pending-approval` (untuk pengawas)
- **Approval Management**: `/admin/pengguna/approval-pengawas` (untuk admin)

## ✅ Checklist

- [ ] Kolom `status_approval` sudah ditambahkan ke tabel `users`
- [ ] Index untuk performa sudah dibuat
- [ ] Function `approve_pengawas()` dan `reject_pengawas()` sudah dibuat
- [ ] Halaman approval admin sudah dibuat
- [ ] Halaman pending approval pengawas sudah dibuat
- [ ] Login route sudah check status approval
- [ ] Auth utils sudah check status approved
- [ ] Registrasi sudah set status `pending`

