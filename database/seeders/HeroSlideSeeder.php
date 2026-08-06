<?php

namespace Database\Seeders;

use App\Models\HeroSlide;
use Illuminate\Database\Seeder;

class HeroSlideSeeder extends Seeder
{
    public function run(): void
    {
        HeroSlide::create([
            'title' => 'Harmoni Warga,',
            'subtitle' => 'Kemajuan Bersama.',
            'description' => 'Website resmi Desa Ngampungan. Melayani kebutuhan administrasi warga dan menyajikan informasi terkini seputar potensi, budaya, dan pembangunan desa.',
            'primary_cta_text' => 'Kenali Desa',
            'primary_cta_url' => '#potensi',
            'secondary_cta_text' => 'Lihat Layanan',
            'secondary_cta_url' => '#layanan',
            'order' => 1,
            'is_active' => true,
        ]);

        HeroSlide::create([
            'title' => 'Pelayanan Digital,',
            'subtitle' => 'Lebih Cepat dan Mudah.',
            'description' => 'Ajukan surat-surat administrasi desa secara online kapan saja, tanpa perlu antre. Proses lebih transparan dan efisien untuk kemudahan warga.',
            'primary_cta_text' => 'Ajukan Surat',
            'primary_cta_url' => '/layanan',
            'secondary_cta_text' => 'Lacak Status',
            'secondary_cta_url' => '/lacak-pengajuan',
            'order' => 2,
            'is_active' => true,
        ]);

        HeroSlide::create([
            'title' => 'Potensi UMKM,',
            'subtitle' => 'Produk Unggulan Desa.',
            'description' => 'Dukung produk lokal dari usaha mikro kecil menengah warga Desa Ngampungan. Kualitas terjaga, harga bersahabat, dan membantu ekonomi desa berkembang.',
            'primary_cta_text' => 'Jelajahi UMKM',
            'primary_cta_url' => '/potensi?category=umkm',
            'secondary_cta_text' => 'Lihat Semua Potensi',
            'secondary_cta_url' => '/potensi',
            'order' => 3,
            'is_active' => true,
        ]);
    }
}
