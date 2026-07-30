<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $announcements = [
            [
                'title' => 'Penutupan Sementara Jembatan Penghubung Dusun',
                'slug' => 'penutupan-sementara-jembatan-penghubung-dusun',
                'summary' => 'Jembatan ditutup sementara selama pemeriksaan struktur. Warga diminta mengikuti jalur alternatif yang telah ditandai.',
                'content' => [
                    'Jembatan utama penghubung antar dusun di Desa Ngampungan ditutup sementara waktu mulai tanggal 25 Juli 2026.',
                    'Penutupan dilakukan guna mendukung audit teknis dan pemeriksaan ketahanan struktur oleh tim teknis pekerjaan umum.',
                    'Pengendara roda dua dan empat diimbau menggunakan rute alternatif melalui jalur timur yang telah dilengkapi rambu petunjuk.',
                ],
                'priority' => 'emergency',
                'status' => 'active',
                'is_pinned' => true,
                'starts_at' => '2026-07-25 08:00:00',
                'ends_at' => '2026-07-30 18:00:00',
            ],
            [
                'title' => 'Perubahan Jadwal Pelayanan Administrasi Kependudukan',
                'slug' => 'perubahan-jadwal-pelayanan-administrasi-kependudukan',
                'summary' => 'Pelayanan administrasi pada hari Jumat dibuka pukul 08.00–10.30 WIB karena agenda koordinasi kecamatan.',
                'content' => [
                    'Diberitahukan kepada seluruh warga Desa Ngampungan bahwa pelayanan administrasi kependudukan pada hari Jumat disesuaikan.',
                    'Pelayanan tatap muka di Kantor Desa hanya dilayani pukul 08.00 hingga 10.30 WIB dikarenakan adanya rapat koordinasi berkala tingkat kecamatan.',
                    'Layanan akan kembali normal sesuai jadwal operasional biasa pada hari kerja berikutnya.',
                ],
                'priority' => 'important',
                'status' => 'active',
                'is_pinned' => true,
                'starts_at' => '2026-07-22 08:00:00',
                'ends_at' => '2026-08-02 15:00:00',
            ],
            [
                'title' => 'Jadwal Posyandu Balita Bulan Agustus',
                'slug' => 'jadwal-posyandu-balita-bulan-agustus',
                'summary' => 'Orang tua diminta membawa buku KIA dan hadir sesuai jadwal masing-masing dusun.',
                'content' => [
                    'Kegiatan pemeriksaan kesehatan balita, penimbangan berat badan, serta pemberian vitamin A akan dilaksanakan serentak bulan ini.',
                    'Jadwal posyandu terbagi menjadi 3 sesi dusun untuk mencegah penumpukan antrean warga.',
                    'Mohon membawa buku KIA dan memastikan balita dalam kondisi sehat saat mendatangi posyandu.',
                ],
                'priority' => 'normal',
                'status' => 'active',
                'is_pinned' => false,
                'starts_at' => '2026-07-20 08:00:00',
                'ends_at' => '2026-08-20 12:00:00',
            ],
            [
                'title' => 'Pendaftaran Peserta Pelatihan UMKM',
                'slug' => 'pendaftaran-peserta-pelatihan-umkm',
                'summary' => 'Pendaftaran dibuka untuk pelaku usaha makanan, kerajinan, pertanian olahan, dan jasa di Desa Ngampungan.',
                'content' => [
                    'Pemerintah Desa Ngampungan membuka pendaftaran pelatihan digitalisasi usaha mikro bagi warga.',
                    'Materi pelatihan meliputi branding produk, pemanfaatan media sosial, serta manajemen keuangan sederhana.',
                    'Pendaftaran tidak dipungut biaya dan dapat dilakukan langsung di Balai Desa atau melalui pos pelayanan warga.',
                ],
                'priority' => 'normal',
                'status' => 'active',
                'is_pinned' => false,
                'starts_at' => '2026-07-18 08:00:00',
                'ends_at' => '2026-08-10 16:00:00',
            ],
            [
                'title' => 'Distribusi Bantuan Benih Padi',
                'slug' => 'distribusi-bantuan-benih-padi',
                'summary' => 'Pengambilan bantuan benih telah selesai dilaksanakan melalui kelompok tani penerima.',
                'content' => [
                    'Penyaluran bantuan benih padi unggul musim tanam ketiga telah selesai dilaksanakan.',
                    'Seluruh kelompok tani penerima manfaat telah mengambil alokasi benih sesuai daftar verifikasi.',
                ],
                'priority' => 'important',
                'status' => 'archived',
                'is_pinned' => false,
                'starts_at' => '2026-06-10 08:00:00',
                'ends_at' => '2026-06-25 15:00:00',
            ],
        ];

        foreach ($announcements as $data) {
            Announcement::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
