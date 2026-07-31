<?php

namespace Database\Seeders;

use App\Models\VillageInstitution;
use App\Models\VillageOfficial;
use Illuminate\Database\Seeder;

class VillageGovernmentSeeder extends Seeder
{
    public function run(): void
    {
        // ── Kepala Desa (root) ──
        $kepalaDesa = VillageOfficial::create([
            'slug' => 'rohan',
            'name' => 'Bapak. Rohan',
            'initials' => 'BR',
            'position' => 'Kepala Desa',
            'unit' => 'Pimpinan Pemerintah Desa',
            'group' => 'leadership',
            'photo_path' => null,
            'term' => '2022–2028',
            'employee_id' => 'Kades-001',
            'summary' => 'Memimpin penyelenggaraan pemerintahan, pembangunan, pembinaan kemasyarakatan, dan pemberdayaan warga Desa Ngampungan.',
            'about' => 'Profil ini merupakan contoh susunan informasi Kepala Desa. Riwayat pendidikan, masa jabatan, dan uraian pengalaman akan disesuaikan setelah dokumen resmi diverifikasi.',
            'responsibilities' => [
                'Menetapkan kebijakan penyelenggaraan pemerintahan desa.',
                'Mengoordinasikan pembangunan dan pemberdayaan masyarakat.',
                'Membina ketenteraman, ketertiban, dan kehidupan sosial warga.',
                'Memastikan tata kelola anggaran berjalan transparan dan akuntabel.',
            ],
            'service_focus' => ['Pelayanan publik', 'Pembangunan partisipatif', 'Transparansi anggaran'],
            'education' => ['Sarjana Ilmu Sosial — data simulasi', 'Pelatihan Kepemimpinan Pemerintahan Desa — data simulasi'],
            'career' => [
                ['period' => '2022–sekarang', 'role' => 'Kepala Desa Ngampungan — simulasi periode'],
                ['period' => 'Sebelum 2022', 'role' => 'Riwayat pengalaman menunggu data resmi'],
            ],
            'sort_order' => 0,
            'parent_id' => null,
            'is_active' => true,
        ]);

        // ── Sekretaris Desa ──
        $sekretaris = VillageOfficial::create([
            'slug' => 'rina-kurniasih',
            'name' => 'Rina Kurniasih, S.E.',
            'initials' => 'RK',
            'position' => 'Sekretaris Desa',
            'unit' => 'Sekretariat Desa',
            'group' => 'secretariat',
            'term' => 'Data belum tersedia',
            'employee_id' => 'Sekdes-001',
            'summary' => 'Mengoordinasikan urusan administrasi umum, perencanaan, dan keuangan pemerintah desa.',
            'about' => 'Data Sekretaris Desa bersifat simulasi dan akan diperbarui setelah verifikasi dokumen resmi.',
            'responsibilities' => [
                'Mengoordinasikan urusan administrasi pemerintah desa.',
                'Menyusun rancangan peraturan dan perencanaan desa.',
                'Mengelola arsip, surat-menyurat, dan dokumentasi resmi.',
            ],
            'service_focus' => ['Administrasi umum', 'Perencanaan', 'Dokumentasi'],
            'education' => ['Sarjana Ekonomi — data simulasi'],
            'career' => [['period' => 'Periode simulasi', 'role' => 'Sekretaris Desa']],
            'sort_order' => 1,
            'parent_id' => $kepalaDesa->id,
            'is_active' => true,
        ]);

        // ── Urusan Sekretariat (children of Sekretaris) ──
        $secretariatStaff = [
            ['slug' => 'dewi-lestari', 'name' => 'Dewi Lestari, S.Ak.', 'initials' => 'DL', 'position' => 'Kaur Keuangan', 'employee_id' => 'Kaur-Keu-001',
                'summary' => 'Mendukung pengelolaan keuangan desa mulai dari penatausahaan hingga pelaporan.',
                'responsibilities' => ['Melaksanakan penatausahaan penerimaan dan pengeluaran desa.', 'Menyiapkan dokumen laporan keuangan pemerintah desa.', 'Mendukung pengendalian administrasi pelaksanaan APBDes.'],
                'service_focus' => ['Penatausahaan', 'Pelaporan keuangan', 'APBDes'],
                'education' => ['Sarjana Akuntansi — data simulasi'],
                'career' => [['period' => 'Periode simulasi', 'role' => 'Kaur Keuangan']],
            ],
            ['slug' => 'agung-prabowo', 'name' => 'Agung Prabowo', 'initials' => 'AP', 'position' => 'Kaur Perencanaan', 'employee_id' => 'Kaur-Plan-001',
                'summary' => 'Menyusun rencana kerja tahunan dan program pembangunan desa.',
                'responsibilities' => ['Menyiapkan rancangan RPJMDes dan RKPDes.', 'Mengoordinasikan musyawarah perencanaan pembangunan desa.', 'Memantau realisasi program yang sudah direncanakan.'],
                'service_focus' => ['Perencanaan', 'Musrenbangdes', 'Program desa'],
                'education' => ['Riwayat pendidikan menunggu data resmi'],
                'career' => [['period' => 'Periode simulasi', 'role' => 'Kaur Perencanaan']],
            ],
            ['slug' => 'siti-nurhaliza', 'name' => 'Siti Nurhaliza', 'initials' => 'SN', 'position' => 'Kaur Tata Usaha & Umum', 'employee_id' => 'Kaur-TU-001',
                'summary' => 'Mengelola ketatausahaan, arsip, inventaris, dan layanan administrasi umum kantor desa.',
                'responsibilities' => ['Mengelola surat-menyurat dan arsip desa.', 'Mendata inventaris aset pemerintah desa.', 'Mendukung pelayanan administrasi umum bagi masyarakat.'],
                'service_focus' => ['Surat-menyurat', 'Kearsipan', 'Inventarisasi'],
                'education' => ['Riwayat pendidikan menunggu data resmi'],
                'career' => [['period' => 'Periode simulasi', 'role' => 'Kaur Tata Usaha & Umum']],
            ],
        ];

        foreach ($secretariatStaff as $idx => $staff) {
            VillageOfficial::create(array_merge($staff, [
                'unit' => 'Sekretariat Desa',
                'group' => 'secretariat',
                'about' => 'Informasi aparatur dan riwayat jabatan pada halaman ini masih berupa simulasi.',
                'sort_order' => $idx,
                'parent_id' => $sekretaris->id,
                'is_active' => true,
            ]));
        }

        // ── Pelaksana Teknis (children of Kepala Desa) ──
        $technicalStaff = [
            ['slug' => 'kusnadi-s-sos', 'name' => 'Kusnadi, S.Sos.', 'initials' => 'KS', 'position' => 'Kasi Pemerintahan', 'employee_id' => 'Kasi-Pem-001',
                'summary' => 'Melaksanakan tugas operasional di bidang tata pemerintahan desa.',
                'responsibilities' => ['Menyusun rancangan peraturan dan keputusan Kepala Desa.', 'Melaksanakan administrasi kependudukan dan pertanahan.', 'Mengoordinasikan kegiatan pemerintahan di tingkat desa.'],
                'service_focus' => ['Tata pemerintahan', 'Kependudukan', 'Pertanahan'],
                'education' => ['Sarjana Sosial — data simulasi'],
                'career' => [['period' => 'Periode simulasi', 'role' => 'Kasi Pemerintahan']],
            ],
            ['slug' => 'bambang-supriyadi', 'name' => 'Bambang Supriyadi', 'initials' => 'BS', 'position' => 'Kasi Kesejahteraan', 'employee_id' => 'Kasi-Kesra-001',
                'summary' => 'Melaksanakan pembangunan sarana prasarana dan program pemberdayaan masyarakat.',
                'responsibilities' => ['Melaksanakan pembangunan sarana dan prasarana desa.', 'Mendukung program pemberdayaan masyarakat dan kesejahteraan sosial.', 'Mengoordinasikan bantuan sosial dan kegiatan kemasyarakatan.'],
                'service_focus' => ['Pembangunan', 'Pemberdayaan', 'Bantuan sosial'],
                'education' => ['Riwayat pendidikan menunggu data resmi'],
                'career' => [['period' => 'Periode simulasi', 'role' => 'Kasi Kesejahteraan']],
            ],
            ['slug' => 'endah-permatasari', 'name' => 'Endah Permatasari', 'initials' => 'EP', 'position' => 'Kasi Pelayanan', 'employee_id' => 'Kasi-Yan-001',
                'summary' => 'Mengoordinasikan pelayanan publik kepada warga desa.',
                'responsibilities' => ['Melaksanakan pelayanan publik di bidang administrasi.', 'Mendukung penyediaan informasi dan pengaduan warga.', 'Mengoordinasikan kegiatan pelayanan terpadu.'],
                'service_focus' => ['Pelayanan publik', 'Informasi warga', 'Administrasi'],
                'education' => ['Riwayat pendidikan menunggu data resmi'],
                'career' => [['period' => 'Periode simulasi', 'role' => 'Kasi Pelayanan']],
            ],
        ];

        foreach ($technicalStaff as $idx => $staff) {
            VillageOfficial::create(array_merge($staff, [
                'unit' => 'Pelaksana Teknis',
                'group' => 'technical',
                'about' => 'Informasi aparatur dan riwayat jabatan pada halaman ini masih berupa simulasi.',
                'sort_order' => $idx,
                'parent_id' => $kepalaDesa->id,
                'is_active' => true,
            ]));
        }

        // ── Pelaksana Kewilayahan (children of Kepala Desa) ──
        $territorialStaff = [
            ['slug' => 'hendra-wijaya', 'name' => 'Hendra Wijaya', 'initials' => 'HW', 'position' => 'Kepala Dusun 01', 'employee_id' => 'Kadus-01'],
            ['slug' => 'yusuf-alamsyah', 'name' => 'Yusuf Alamsyah', 'initials' => 'YA', 'position' => 'Kepala Dusun 02', 'employee_id' => 'Kadus-02'],
            ['slug' => 'novi-rahmawati', 'name' => 'Novi Rahmawati', 'initials' => 'NR', 'position' => 'Kepala Dusun 03', 'employee_id' => 'Kadus-03'],
            ['slug' => 'fitri-handayani', 'name' => 'Fitri Handayani', 'initials' => 'FH', 'position' => 'Kepala Dusun 04', 'employee_id' => 'Kadus-04'],
        ];

        foreach ($territorialStaff as $idx => $staff) {
            VillageOfficial::create(array_merge($staff, [
                'unit' => 'Pelaksana Kewilayahan',
                'group' => 'territorial',
                'summary' => 'Mengoordinasikan penyelenggaraan pemerintahan, pembangunan, dan pembinaan masyarakat di tingkat dusun.',
                'about' => 'Nama dusun dan data aparatur kewilayahan masih berupa simulasi frontend.',
                'responsibilities' => [
                    'Mendukung pelayanan warga di wilayah dusun.',
                    'Mengoordinasikan kegiatan pembangunan kewilayahan.',
                    'Menjaga komunikasi antara warga dan pemerintah desa.',
                ],
                'service_focus' => ['Pelayanan wilayah', 'Koordinasi warga', 'Pembangunan dusun'],
                'education' => ['Riwayat pendidikan menunggu data resmi'],
                'career' => [['period' => 'Periode simulasi', 'role' => $staff['position']]],
                'sort_order' => $idx,
                'parent_id' => $kepalaDesa->id,
                'is_active' => true,
            ]));
        }

        // ── Lembaga Desa ──
        $institutions = [
            [
                'acronym' => 'BPD',
                'name' => 'Badan Permusyawaratan Desa',
                'leader' => 'Bapak Suparman, S.Pd.',
                'member_count' => 7,
                'focus' => 'Permusyawaratan dan pengawasan pemerintahan desa.',
                'description' => 'BPD merupakan lembaga perwujudan demokrasi dalam penyelenggaraan pemerintahan desa yang berfungsi membahas dan menyepakati Peraturan Desa bersama Kepala Desa, menampung dan menyalurkan aspirasi masyarakat, serta melakukan pengawasan kinerja Kepala Desa.',
                'responsibilities' => [
                    'Membahas dan menyepakati rancangan peraturan desa.',
                    'Menampung serta menyalurkan aspirasi masyarakat.',
                    'Melakukan pengawasan kinerja Kepala Desa.',
                ],
                'members' => [
                    ['name' => 'Bapak Suparman, S.Pd.', 'role' => 'Ketua BPD'],
                    ['name' => 'Ibu Tri Wahyuni', 'role' => 'Wakil Ketua'],
                    ['name' => 'Bapak H. Ahmad Subandi', 'role' => 'Sekretaris'],
                    ['name' => 'Bapak Gatot Kaca', 'role' => 'Anggota (Bidang Pemerintahan)'],
                    ['name' => 'Ibu Nani Wijaya', 'role' => 'Anggota (Bidang Pembangunan)'],
                ],
            ],
            [
                'acronym' => 'LPMD',
                'name' => 'Lembaga Pemberdayaan Masyarakat Desa',
                'leader' => 'Bapak Drs. M. Yusuf',
                'member_count' => 12,
                'focus' => 'Partisipasi warga dalam perencanaan dan pembangunan.',
                'description' => 'LPMD bertugas membantu Pemerintah Desa dalam menyerap aspirasi masyarakat terkait pembangunan desa dan menggerakkan swadaya gotong royong masyarakat.',
                'responsibilities' => [
                    'Mendorong partisipasi masyarakat dalam pembangunan.',
                    'Membantu penyusunan rencana pembangunan partisipatif.',
                    'Menggerakkan swadaya dan gotong royong warga.',
                ],
                'members' => [
                    ['name' => 'Bapak Drs. M. Yusuf', 'role' => 'Ketua LPMD'],
                    ['name' => 'Bapak Bambang Hariyanto', 'role' => 'Sekretaris'],
                    ['name' => 'Ibu Rahmawati', 'role' => 'Bendahara'],
                    ['name' => 'Bapak Sugeng Supriadi', 'role' => 'Seksi Pembangunan'],
                ],
            ],
            [
                'acronym' => 'PKK',
                'name' => 'Pemberdayaan dan Kesejahteraan Keluarga',
                'leader' => 'Ibu Hj. Endang Sulastri',
                'member_count' => 24,
                'focus' => 'Pemberdayaan keluarga, kesehatan, dan kesejahteraan.',
                'description' => 'PKK Desa Ngampungan merupakan wadah pemberdayaan wanita yang berperan aktif dalam program kesehatan ibu-anak, posyandu, ketahanan pangan keluarga, dan peningkatan ekonomi kreatif warga.',
                'responsibilities' => [
                    'Mengelola program pemberdayaan keluarga.',
                    'Mendukung kegiatan kesehatan ibu dan anak.',
                    'Mendorong pendidikan serta ekonomi keluarga.',
                ],
                'members' => [
                    ['name' => 'Ibu Hj. Endang Sulastri', 'role' => 'Ketua TP PKK'],
                    ['name' => 'Ibu Siti Aminah', 'role' => 'Sekretaris PKK'],
                    ['name' => 'Ibu Sri Rahayu', 'role' => 'Bendahara PKK'],
                    ['name' => 'Ibu Lilik Suryani', 'role' => 'Ketua Pokja I'],
                    ['name' => 'Ibu Dewanti', 'role' => 'Ketua Pokja II'],
                ],
            ],
            [
                'acronym' => 'KARTAR',
                'name' => 'Karang Taruna Tunas Muda',
                'leader' => 'Aditya Pratama',
                'member_count' => 30,
                'focus' => 'Pengembangan kapasitas, kreativitas, dan kepedulian pemuda.',
                'description' => 'Karang Taruna Desa Ngampungan adalah wadah pengembangan generasi muda desa di bidang olahraga, kebudayaan, keagamaan, dan wirausaha muda.',
                'responsibilities' => [
                    'Mengembangkan kegiatan kepemudaan.',
                    'Mendorong kreativitas dan usaha produktif pemuda.',
                    'Mendukung kegiatan sosial kemasyarakatan.',
                ],
                'members' => [
                    ['name' => 'Aditya Pratama', 'role' => 'Ketua Karang Taruna'],
                    ['name' => 'Rian Hidayat', 'role' => 'Wakil Ketua'],
                    ['name' => 'Dinda Permata', 'role' => 'Sekretaris'],
                    ['name' => 'Fajar Sidik', 'role' => 'Bendahara'],
                    ['name' => 'Bagus Setiawan', 'role' => 'Koordinator Olahraga'],
                ],
            ],
        ];

        foreach ($institutions as $idx => $inst) {
            VillageInstitution::create(array_merge($inst, [
                'sort_order' => $idx,
                'is_active' => true,
            ]));
        }
    }
}
