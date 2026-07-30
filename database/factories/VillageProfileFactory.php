<?php

namespace Database\Factories;

use App\Models\VillageProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VillageProfile>
 */
class VillageProfileFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'total_population' => 3420,
            'total_families' => 1120,
            'total_hamlets' => 3,
            'total_area_hectares' => 450,
            'boundary_north' => 'Desa Pakel, Kecamatan Bareng',
            'boundary_east' => 'Desa Jatigedong, Kecamatan Bareng',
            'boundary_south' => 'Desa Banjaragung, Kecamatan Bareng',
            'boundary_west' => 'Desa Pulosari, Kecamatan Bareng',
            'hamlets' => [
                [
                    'code' => 'D-01',
                    'name' => 'Dusun Ngampungan',
                    'rw' => 4,
                    'rt' => 12,
                    'households' => 410,
                    'note' => 'Pusat pemerintahan, pertanian, dan pelayanan desa',
                ],
                [
                    'code' => 'D-02',
                    'name' => 'Dusun Sumberdadi',
                    'rw' => 3,
                    'rt' => 10,
                    'households' => 360,
                    'note' => 'Kawasan pertanian produktif dan perkebunan',
                ],
                [
                    'code' => 'D-03',
                    'name' => 'Dusun Wungurejo',
                    'rw' => 3,
                    'rt' => 8,
                    'households' => 350,
                    'note' => 'Sentra UMKM, perikanan, dan potensi lokal',
                ],
            ],
            'land_use' => [
                [
                    'key' => 'agriculture',
                    'label' => 'Pertanian dan perkebunan',
                    'hectares' => 234,
                    'percentage' => 52,
                ],
                [
                    'key' => 'settlement',
                    'label' => 'Permukiman',
                    'hectares' => 126,
                    'percentage' => 28,
                ],
                [
                    'key' => 'openSpace',
                    'label' => 'Ruang terbuka dan hijau',
                    'hectares' => 54,
                    'percentage' => 12,
                ],
                [
                    'key' => 'publicFacilities',
                    'label' => 'Fasilitas umum',
                    'hectares' => 36,
                    'percentage' => 8,
                ],
            ],
            'demographics' => [
                [
                    'key' => 'gender',
                    'label' => 'Jenis Kelamin',
                    'shortLabel' => 'Jenis Kelamin',
                    'description' => 'Komposisi penduduk berdasarkan jenis kelamin.',
                    'unit' => 'jiwa',
                    'total' => 3420,
                    'items' => [
                        ['label' => 'Laki-laki', 'value' => 1728],
                        ['label' => 'Perempuan', 'value' => 1692],
                    ],
                ],
                [
                    'key' => 'age',
                    'label' => 'Kelompok Usia',
                    'shortLabel' => 'Usia',
                    'description' => 'Sebaran penduduk menurut kelompok usia.',
                    'unit' => 'jiwa',
                    'total' => 3420,
                    'items' => [
                        ['label' => '0–14 tahun', 'value' => 720],
                        ['label' => '15–24 tahun', 'value' => 560],
                        ['label' => '25–44 tahun', 'value' => 1010],
                        ['label' => '45–64 tahun', 'value' => 790],
                        ['label' => '65 tahun ke atas', 'value' => 340],
                    ],
                ],
                [
                    'key' => 'education',
                    'label' => 'Tingkat Pendidikan',
                    'shortLabel' => 'Pendidikan',
                    'description' => 'Pendidikan terakhir yang tercatat pada data kependudukan.',
                    'unit' => 'jiwa',
                    'total' => 3420,
                    'items' => [
                        ['label' => 'Belum/tidak sekolah', 'value' => 280],
                        ['label' => 'SD/sederajat', 'value' => 890],
                        ['label' => 'SMP/sederajat', 'value' => 720],
                        ['label' => 'SMA/sederajat', 'value' => 1060],
                        ['label' => 'Diploma/Sarjana', 'value' => 420],
                        ['label' => 'Pascasarjana', 'value' => 50],
                    ],
                ],
                [
                    'key' => 'occupation',
                    'label' => 'Jenis Pekerjaan',
                    'shortLabel' => 'Pekerjaan',
                    'description' => 'Komposisi kegiatan utama penduduk.',
                    'unit' => 'jiwa',
                    'total' => 3420,
                    'items' => [
                        ['label' => 'Pelajar/belum bekerja', 'value' => 1360],
                        ['label' => 'Petani dan peternak', 'value' => 720],
                        ['label' => 'Buruh', 'value' => 540],
                        ['label' => 'Pedagang dan UMKM', 'value' => 380],
                        ['label' => 'Karyawan swasta', 'value' => 290],
                        ['label' => 'ASN/TNI/Polri', 'value' => 70],
                        ['label' => 'Lainnya', 'value' => 60],
                    ],
                ],
                [
                    'key' => 'religion',
                    'label' => 'Agama',
                    'shortLabel' => 'Agama',
                    'description' => 'Komposisi penduduk berdasarkan agama yang tercatat.',
                    'unit' => 'jiwa',
                    'total' => 3420,
                    'items' => [
                        ['label' => 'Islam', 'value' => 3360],
                        ['label' => 'Kristen', 'value' => 38],
                        ['label' => 'Katolik', 'value' => 18],
                        ['label' => 'Hindu', 'value' => 2],
                        ['label' => 'Buddha', 'value' => 2],
                    ],
                ],
                [
                    'key' => 'residency',
                    'label' => 'Status Kependudukan',
                    'shortLabel' => 'Status',
                    'description' => 'Status administrasi penduduk pada data kependudukan.',
                    'unit' => 'jiwa',
                    'total' => 3420,
                    'items' => [
                        ['label' => 'Penduduk tetap', 'value' => 3310],
                        ['label' => 'Penduduk sementara', 'value' => 72],
                        ['label' => 'Mutasi dalam proses', 'value' => 38],
                    ],
                ],
            ],
            'map_latitude' => -7.6749,
            'map_longitude' => 112.3385,
            'map_zoom' => 14,
            'map_google_url' => 'https://maps.google.com/?q=-7.6749,112.3385',
            'map_hd_file_url' => null,
        ];
    }
}
