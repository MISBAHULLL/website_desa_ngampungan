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
            'total_hamlets' => 4,
            'total_area_hectares' => 450,
            'boundary_north' => 'Desa Pakel, Kecamatan Bareng',
            'boundary_east' => 'Desa Jatigedong, Kecamatan Bareng',
            'boundary_south' => 'Desa Banjaragung, Kecamatan Bareng',
            'boundary_west' => 'Desa Pulosari, Kecamatan Bareng',
            'hamlets' => [
                [
                    'code' => 'D-01',
                    'name' => 'Dusun Krajan',
                    'rw' => 3,
                    'rt' => 8,
                    'households' => 286,
                    'note' => 'Pusat pemerintahan dan pelayanan desa',
                ],
                [
                    'code' => 'D-02',
                    'name' => 'Dusun Ngampungan',
                    'rw' => 3,
                    'rt' => 9,
                    'households' => 302,
                    'note' => 'Kawasan pertanian utama dan perkebunan',
                ],
                [
                    'code' => 'D-03',
                    'name' => 'Dusun Sumber',
                    'rw' => 2,
                    'rt' => 7,
                    'households' => 254,
                    'note' => 'Wilayah sumber mata air dan perikanan',
                ],
                [
                    'code' => 'D-04',
                    'name' => 'Dusun Ngandat',
                    'rw' => 3,
                    'rt' => 8,
                    'households' => 278,
                    'note' => 'Sentra UMKM dan kerajinan warga',
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
        ];
    }
}
