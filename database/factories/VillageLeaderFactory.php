<?php

namespace Database\Factories;

use App\Models\VillageLeader;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VillageLeader>
 */
class VillageLeaderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name().', S.Sos.',
            'position' => 'Kepala Desa Ngampungan',
            'photo' => null,
            'welcome_title' => 'Melayani dengan Transparan dan Dekat dengan Warga',
            'welcome_message' => fake()->paragraphs(2, true),
            'vision' => 'Terwujudnya Desa Ngampungan yang maju, mandiri, dan sejahtera.',
            'mission' => 'Meningkatkan kualitas pelayanan publik yang terbuka dan mudah diakses.',
            'started_at' => now()->subYears(2)->startOfYear(),
            'ended_at' => null,
            'is_active' => true,
        ];
    }
}
