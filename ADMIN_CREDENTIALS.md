# 🔐 Kredensial Admin - Website Desa Ngampungan

## 📧 **Email & Password Default**

### **Login Admin:**
- **URL Login**: `http://your-domain.com/login`
- **Email**: `test@example.com`
- **Password**: `password`

> ⚠️ **PENTING**: Segera ganti email dan password default setelah instalasi pertama untuk keamanan!

---

## 🔄 **Cara Mengganti Email & Password Admin**

### **Metode 1: Menggunakan Command Artisan (Rekomendasi)**

Cara paling mudah dan aman untuk mengganti kredensial admin:

```bash
php artisan admin:change-credentials
```

**Atau jika Anda sudah tahu email saat ini:**

```bash
php artisan admin:change-credentials test@example.com
```

**Proses Interactive:**
1. Masukkan email admin saat ini
2. Masukkan email baru (atau enter untuk skip)
3. Pilih apakah ingin mengubah password
4. Jika ya, masukkan password baru (minimal 8 karakter)
5. Konfirmasi password baru
6. Masukkan nama admin baru (atau enter untuk skip)
7. Konfirmasi perubahan
8. ✅ Selesai!

**Contoh Output:**
```
=== Ubah Kredensial Admin ===

User ditemukan: Test User (test@example.com)

Email baru: admin@desangampungan.id
Apakah Anda ingin mengubah password? yes
Password baru: ********
Konfirmasi password baru: ********
Nama admin baru: Admin Desa Ngampungan

=== Ringkasan Perubahan ===
+----------+---------------------+---------------------------+
| Field    | Sebelum             | Sesudah                   |
+----------+---------------------+---------------------------+
| Email    | test@example.com    | admin@desangampungan.id   |
| Nama     | Test User           | Admin Desa Ngampungan     |
| Password | ********            | [AKAN DIUBAH]             |
+----------+---------------------+---------------------------+

Lanjutkan perubahan? yes

✓ Kredensial admin berhasil diperbarui!

Email: admin@desangampungan.id
Nama: Admin Desa Ngampungan
Password: [BERHASIL DIUBAH]
```

---

### **Metode 2: Menggunakan Tinker**

Jika Anda familiar dengan Laravel Tinker:

```bash
php artisan tinker
```

**Kemudian jalankan:**

```php
// Cari user berdasarkan email
$user = App\Models\User::where('email', 'test@example.com')->first();

// Ubah email
$user->email = 'admin@desangampungan.id';

// Ubah nama
$user->name = 'Admin Desa Ngampungan';

// Ubah password
$user->password = bcrypt('password_baru_anda');

// Simpan perubahan
$user->save();

// Output: true (berhasil)
```

---

### **Metode 3: Langsung Edit Database**

Jika Anda memiliki akses ke database:

**Via phpMyAdmin atau database client:**

1. Buka tabel `users`
2. Cari record dengan email `test@example.com`
3. Edit kolom:
   - `email`: Ganti dengan email baru
   - `name`: Ganti dengan nama baru
   - `password`: Untuk password, generate hash terlebih dahulu

**Generate Password Hash:**
```bash
php artisan tinker --execute="echo bcrypt('password_baru_anda');"
```

Copy hash yang dihasilkan (dimulai dengan `$2y$`) dan paste ke kolom `password`.

---

## 🔒 **Tips Keamanan**

### ✅ **DO (Lakukan):**
- Gunakan email yang valid dan aktif
- Gunakan password minimal 12 karakter
- Kombinasikan huruf besar, kecil, angka, dan simbol
- Simpan kredensial di password manager
- Ganti password secara berkala (setiap 3-6 bulan)

### ❌ **DON'T (Jangan):**
- Menggunakan email default `test@example.com` di production
- Menggunakan password default `password`
- Membagikan kredensial admin ke banyak orang
- Menyimpan password di file teks biasa
- Menggunakan password yang mudah ditebak

---

## 🆘 **Lupa Password?**

Jika lupa password, Anda bisa reset dengan command:

```bash
php artisan admin:change-credentials your-email@example.com
```

Masukkan password baru saat diminta.

---

## 👥 **Menambah Admin Baru**

Untuk menambah admin baru (jika diperlukan):

```bash
php artisan tinker
```

```php
App\Models\User::create([
    'name' => 'Admin Baru',
    'email' => 'admin2@desangampungan.id',
    'password' => bcrypt('password_admin_baru'),
    'email_verified_at' => now(),
]);
```

---

## 📞 **Bantuan**

Jika mengalami masalah dengan login atau perubahan kredensial, hubungi developer atau system administrator.

---

**Terakhir diperbarui**: 5 Agustus 2026
