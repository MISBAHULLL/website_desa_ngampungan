<?php

namespace Database\Factories;

use App\Models\VillageService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VillageService>
 */
class VillageServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'title' => $this->faker->sentence(3),
            'short_description' => $this->faker->sentence(),
            'category' => $this->faker->randomElement(['administration', 'population', 'agriculture', 'reports']),
            'audience' => 'Warga Desa',
            'channel' => 'Online & Offline',
            'estimated_duration' => '1 Hari Kerja',
            'fee' => 'Gratis',
            'service_contact' => $this->faker->phoneNumber(),
            'service_hours' => 'Senin - Jumat',
            'notes' => [$this->faker->sentence()],
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 100),
        ];
    }
}
