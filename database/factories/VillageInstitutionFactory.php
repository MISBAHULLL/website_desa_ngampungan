<?php

namespace Database\Factories;

use App\Models\VillageInstitution;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VillageInstitution>
 */
class VillageInstitutionFactory extends Factory
{
    protected $model = VillageInstitution::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'acronym' => mb_strtoupper(fake()->lexify('???')),
            'name' => fake()->company(),
            'leader' => fake()->name(),
            'member_count' => fake()->numberBetween(5, 30),
            'focus' => fake()->sentence(10),
            'responsibilities' => [fake()->sentence(8), fake()->sentence(8)],
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
