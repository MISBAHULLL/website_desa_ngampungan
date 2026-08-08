# Fix Infinite Loading saat Upload Video

## Masalah
Video tidak bisa diupload dan loading bar bergerak maju-mundur terus tanpa selesai.

## Penyebab
Konfigurasi PHP memiliki batas upload yang terlalu kecil:
- `upload_max_filesize` = 2MB
- `post_max_size` = 8MB

Sedangkan validasi Laravel mengizinkan video hingga 100MB.

## Solusi

### 1. Edit php.ini
Buka file: `C:\laragon\bin\php\php 8.3\php.ini`

Cari dan ubah nilai berikut:

```ini
; Cari baris ini:
upload_max_filesize = 2M
; Ubah menjadi:
upload_max_filesize = 120M

; Cari baris ini:
post_max_size = 8M
; Ubah menjadi:
post_max_size = 130M

; Cari baris ini (opsional, untuk menghindari timeout):
max_execution_time = 300
; Ubah menjadi:
max_execution_time = 600
```

**PENTING**: 
- `post_max_size` harus **lebih besar** dari `upload_max_filesize`
- Kami set 120MB untuk upload dan 130MB untuk POST agar ada buffer

### 2. Restart Laragon/Apache
Setelah edit php.ini, restart web server Anda:
- Buka Laragon
- Klik "Stop All"
- Klik "Start All"

### 3. Verifikasi
Jalankan command ini untuk memastikan perubahan berhasil:

```bash
php -i | findstr "upload_max_filesize post_max_size max_execution_time"
```

Output yang benar:
```
upload_max_filesize => 120M => 120M
post_max_size => 130M => 130M
max_execution_time => 600 => 600
```

### 4. Test Upload Video
Setelah restart, coba upload video lagi di admin gallery edit page.

## Catatan Tambahan

### Jika masih bermasalah, cek juga nginx (jika pakai):
Buka `C:\laragon\etc\nginx\nginx.conf` dan tambahkan di dalam block `http`:

```nginx
client_max_body_size 130M;
```

### Rekomendasi Ukuran File:
- Video: Max 100MB (sudah divalidasi di Laravel)
- Foto: Max 4MB (sudah divalidasi di Laravel)

## File yang Sudah Diupdate
✅ Frontend sudah ada validasi ukuran file (alert jika > 100MB)
✅ Backend sudah validasi mimes dan size
✅ Video preview sudah berfungsi
✅ Loading indicator sudah ada

Yang kurang hanya konfigurasi PHP server-side.
