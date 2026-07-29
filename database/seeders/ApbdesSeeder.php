<?php

namespace Database\Seeders;

use App\Models\ApbdesActivityItem;
use App\Models\ApbdesDocument;
use App\Models\ApbdesIncomeSource;
use App\Models\ApbdesSummary;
use Illuminate\Database\Seeder;

class ApbdesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // TA 2026
        $summary2026 = ApbdesSummary::updateOrCreate(
            ['year' => '2026'],
            [
                'updated_date' => '2026-07-20',
                'net_financing' => 30000000,
            ]
        );

        $income2026 = [
            [
                'code' => '4.1',
                'label' => 'Dana Desa (DD - APBN)',
                'amount' => 1120000000,
                'description' => 'Transfer pemerintah pusat untuk pembangunan & BLT',
            ],
            [
                'code' => '4.2',
                'label' => 'Alokasi Dana Desa (ADD - Kabupaten)',
                'amount' => 680000000,
                'description' => 'Penghasilan tetap perdes & operasional kantor',
            ],
            [
                'code' => '4.3',
                'label' => 'Bagi Hasil Pajak & Retribusi (PBH)',
                'amount' => 180000000,
                'description' => 'Bagi hasil pajak daerah Kabupaten Jombang',
            ],
            [
                'code' => '4.4',
                'label' => 'Pendapatan Asli Desa (PADes)',
                'amount' => 110000000,
                'description' => 'Hasil sewa tanah kas desa & bagi hasil BUMDes',
            ],
            [
                'code' => '4.5',
                'label' => 'Bantuan Keuangan Provinsi / Kab',
                'amount' => 50000000,
                'description' => 'Bantuan khusus program infrastruktur',
            ],
        ];

        foreach ($income2026 as $inc) {
            ApbdesIncomeSource::updateOrCreate(
                ['apbdes_summary_id' => $summary2026->id, 'code' => $inc['code']],
                $inc
            );
        }

        $activities2026 = [
            [
                'code' => '2.1.01',
                'name' => 'Pembangunan Pavingisasi Jalan Usaha Tani',
                'category' => 'pembangunan',
                'budget' => 185000000,
                'realized' => 145000000,
                'location' => 'Dusun Ngampungan',
                'status' => 'berjalan',
            ],
            [
                'code' => '2.1.02',
                'name' => 'Rehabilitasi Drainase Pemukiman RT 03/RW 01',
                'category' => 'pembangunan',
                'budget' => 120000000,
                'realized' => 120000000,
                'location' => 'Dusun Wates',
                'status' => 'selesai',
            ],
            [
                'code' => '1.1.01',
                'name' => 'Penghasilan Tetap & Tunjangan Aparatur Desa',
                'category' => 'pemerintahan',
                'budget' => 480000000,
                'realized' => 360000000,
                'location' => 'Kantor Desa',
                'status' => 'berjalan',
            ],
            [
                'code' => '4.1.01',
                'name' => 'Pelatihan & Pendampingan UMKM Keripik Pisang',
                'category' => 'pemberdayaan',
                'budget' => 65000000,
                'realized' => 65000000,
                'location' => 'Balai Desa',
                'status' => 'selesai',
            ],
            [
                'code' => '3.1.01',
                'name' => 'Penyelenggaraan Festival Budaya & Sedekah Bumi',
                'category' => 'pembinaan',
                'budget' => 45000000,
                'realized' => 45000000,
                'location' => 'Lapangan Desa',
                'status' => 'selesai',
            ],
            [
                'code' => '5.1.01',
                'name' => 'Penyaluran Bantuan Langsung Tunai (BLT-DD)',
                'category' => 'darurat',
                'budget' => 120000000,
                'realized' => 90000000,
                'location' => 'Semua Dusun',
                'status' => 'berjalan',
            ],
        ];

        foreach ($activities2026 as $act) {
            ApbdesActivityItem::updateOrCreate(
                ['apbdes_summary_id' => $summary2026->id, 'code' => $act['code']],
                $act
            );
        }

        // Seed Public Documents
        $documents = [
            [
                'title' => 'Laporan Realisasi APBDes Semester I Tahun 2026',
                'category' => 'Laporan Realisasi',
                'year' => '2026',
                'document_date' => '2026-07-20',
                'file_path' => null,
                'file_size' => '3,1 MB',
            ],
            [
                'title' => 'APBDes Desa Ngampungan Tahun Anggaran 2026',
                'category' => 'APBDes',
                'year' => '2026',
                'document_date' => '2026-01-10',
                'file_path' => null,
                'file_size' => '2,4 MB',
            ],
            [
                'title' => 'Peraturan Desa tentang Penetapan APBDes Tahun 2026',
                'category' => 'Peraturan Desa',
                'year' => '2026',
                'document_date' => '2026-01-08',
                'file_path' => null,
                'file_size' => '1,8 MB',
            ],
        ];

        foreach ($documents as $doc) {
            ApbdesDocument::updateOrCreate(
                ['title' => $doc['title']],
                $doc
            );
        }
    }
}
