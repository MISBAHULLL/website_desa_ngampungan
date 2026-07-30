<?php

namespace Database\Seeders;

use App\Models\GalleryPhoto;
use Illuminate\Database\Seeder;

class GalleryPhotoSeeder extends Seeder
{
    public function run(): void
    {
        $photos = [
            [
                'title' => 'Panen Raya Padi Organik',
                'category' => 'Alam & Pertanian',
                'album' => 'Panen Raya 2026',
                'caption' => 'Kebersamaan petani saat panen raya sekaligus evaluasi musim tanam.',
                'image_path' => 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Petani bekerja di area persawahan saat panen',
                'is_featured' => true,
                'captured_at' => '2026-07-24',
            ],
            [
                'title' => 'Musyawarah Warga',
                'category' => 'Kegiatan Desa',
                'album' => 'Musyawarah Desa',
                'caption' => 'Warga dan pemerintah desa berdiskusi menentukan prioritas pembangunan.',
                'image_path' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Peserta mengikuti pertemuan dan diskusi bersama',
                'is_featured' => true,
            ],
            [
                'title' => 'Perbaikan Jalan Lingkungan',
                'category' => 'Pembangunan',
                'album' => 'Infrastruktur Desa',
                'caption' => 'Pengerjaan jalan dan saluran air dilakukan bertahap pada titik prioritas.',
                'image_path' => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Pekerja menyelesaikan proyek infrastruktur',
                'is_featured' => true,
            ],
            [
                'title' => 'Produk Anyaman Bambu',
                'category' => 'UMKM',
                'album' => 'Produk Warga',
                'caption' => 'Koleksi produk kerajinan warga yang dipasarkan ke luar daerah.',
                'image_path' => 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Kerajinan anyaman berbahan alami',
                'is_featured' => false,
            ],
            [
                'title' => 'Pelayanan Posyandu',
                'category' => 'Kegiatan Desa',
                'album' => 'Pelayanan Kesehatan',
                'caption' => 'Pemeriksaan rutin tumbuh kembang dan konsultasi kesehatan keluarga.',
                'image_path' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Tenaga kesehatan memberikan pelayanan kepada warga',
                'is_featured' => false,
            ],
            [
                'title' => 'Lahan Pertanian Desa',
                'category' => 'Alam & Pertanian',
                'album' => 'Bentang Ngampungan',
                'caption' => 'Hamparan lahan produktif yang menjadi salah satu penopang ekonomi warga.',
                'image_path' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
                'image_alt' => 'Hamparan lahan pertanian hijau',
                'is_featured' => false,
            ],
        ];

        foreach ($photos as $data) {
            GalleryPhoto::firstOrCreate(
                ['title' => $data['title']],
                [
                    'slug' => GalleryPhoto::generateUniqueSlug($data['title']),
                    'category' => $data['category'],
                    'album' => $data['album'],
                    'caption' => $data['caption'],
                    'image_path' => $data['image_path'],
                    'image_alt' => $data['image_alt'],
                    'is_featured' => $data['is_featured'],
                    'captured_at' => $data['captured_at'] ?? now(),
                ]
            );
        }
    }
}
