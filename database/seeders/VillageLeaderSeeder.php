<?php

namespace Database\Seeders;

use App\Models\VillageLeader;
use Illuminate\Database\Seeder;

class VillageLeaderSeeder extends Seeder
{
    public function run(): void
    {
        VillageLeader::create([
            'name' => 'Budi Santoso, S.Sos',
            'position' => 'Kepala Desa Ngampungan',
            'welcome_message' => 'Assalamu\'alaikum warahmatullahi wabarakatuh. Salam sejahtera untuk kita semua.

Puji syukur kita panjatkan kepada Allah SWT atas segala limpahan rahmat dan karunia-Nya. Website resmi Desa Ngampungan hadir sebagai wujud komitmen kami dalam memberikan pelayanan terbaik kepada seluruh warga.

Melalui platform digital ini, kami berharap dapat memudahkan akses informasi, mempercepat layanan administrasi, dan meningkatkan transparansi pengelolaan desa. Setiap aspirasi, kritik, dan saran dari warga sangat kami harapkan demi kemajuan bersama.

Mari kita bersama-sama membangun Desa Ngampungan yang lebih maju, mandiri, dan sejahtera. Dengan semangat gotong royong dan kebersamaan, saya yakin cita-cita kita untuk mewujudkan desa yang lebih baik akan tercapai.

Wassalamu\'alaikum warahmatullahi wabarakatuh.',
            'vision' => 'Terwujudnya Desa Ngampungan yang maju, mandiri, dan sejahtera berlandaskan nilai-nilai gotong royong dan kearifan lokal.',
            'mission' => '1. Meningkatkan kualitas pelayanan publik yang cepat, mudah, dan transparan
2. Memberdayakan ekonomi masyarakat melalui pengembangan UMKM dan potensi lokal
3. Meningkatkan kualitas infrastruktur dan fasilitas umum desa
4. Melestarikan budaya dan tradisi lokal sebagai identitas desa
5. Mendorong partisipasi aktif masyarakat dalam pembangunan desa',
            'started_at' => '2020-01-15',
            'is_active' => true,
        ]);
    }
}
