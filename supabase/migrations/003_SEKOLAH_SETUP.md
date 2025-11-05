# Setup Tabel Sekolah

## Deskripsi
Migration ini membuat tabel `sekolah` untuk menyimpan data sekolah binaan pengawas.

## Cara Menjalankan

1. Buka Supabase Dashboard → SQL Editor
2. Copy seluruh isi file `003_create_sekolah_table.sql`
3. Paste ke SQL Editor
4. Klik "Run" untuk menjalankan migration

## Kolom Tabel

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | UUID | Primary key (auto-generated) |
| `npsn` | TEXT | Nomor Pokok Sekolah Nasional (unique) |
| `nama_sekolah` | TEXT | Nama sekolah |
| `status` | TEXT | Status: 'Negeri' atau 'Swasta' |
| `jenjang` | TEXT | Jenjang: 'SMK', 'SMA', atau 'SLB' |
| `kabupaten_kota` | TEXT | Kabupaten/Kota lokasi sekolah |
| `alamat` | TEXT | Alamat lengkap sekolah |
| `kcd_wilayah` | INTEGER | KCD Wilayah (1-12) |
| `created_at` | TIMESTAMPTZ | Waktu pembuatan |
| `updated_at` | TIMESTAMPTZ | Waktu update terakhir |
| `created_by` | UUID | ID admin yang membuat (nullable) |

## RLS Policies

- **Admin**: Dapat melakukan semua operasi (SELECT, INSERT, UPDATE, DELETE)
- **Pengawas**: Hanya dapat SELECT (read-only)

## Index

- `idx_sekolah_npsn` - Index pada NPSN untuk performa query
- `idx_sekolah_kcd_wilayah` - Index pada KCD Wilayah
- `idx_sekolah_kabupaten_kota` - Index pada Kabupaten/Kota
- `idx_sekolah_status` - Index pada Status
- `idx_sekolah_jenjang` - Index pada Jenjang
- `idx_sekolah_nama` - Full-text search index pada nama sekolah

## Validasi

- NPSN harus unik (UNIQUE constraint)
- Status harus 'Negeri' atau 'Swasta'
- Jenjang harus 'SMK', 'SMA', atau 'SLB'
- KCD Wilayah harus antara 1-12

## Troubleshooting

Jika ada error saat menjalankan migration:
1. Pastikan tabel `users` sudah ada (migration 001)
2. Pastikan tidak ada konflik dengan tabel yang sudah ada
3. Check error message di Supabase SQL Editor

