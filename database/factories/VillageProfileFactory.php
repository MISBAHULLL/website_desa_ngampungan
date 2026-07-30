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
        ];
    }
}
