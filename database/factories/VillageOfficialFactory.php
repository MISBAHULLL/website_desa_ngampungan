<?php

namespace Database\Factories;

use App\Models\VillageOfficial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VillageOfficial>
 */
class VillageOfficialFactory extends Factory
{
    protected $model = VillageOfficial::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();

        return [
            'slug' => VillageOfficial::generateUniqueSlug($name),
            'name' => $name,
            'initials' => mb_strtoupper(mb_substr($name, 0, 1).mb_substr(explode(' ', $name)[1] ?? $name, 0, 1)),
            'position' => fake()->randomElement(['Kepala Desa', 'Sekretaris Desa', 'Kaur Keuangan', 'Kasi Pemerintahan']),
            'unit' => 'Pemerintah Desa',
            'group' => fake()->randomElement(['leadership', 'secretariat', 'technical', 'territorial']),
            'term' => '2022–2028',
            'employee_id' => fake()->bothify('??-###'),
            'summary' => fake()->sentence(12),
            'about' => fake()->paragraph(),
            'responsibilities' => [fake()->sentence(8), fake()->sentence(8)],
            'service_focus' => [fake()->word(), fake()->word()],
            'education' => [fake()->sentence(4)],
            'career' => [['period' => '2022–sekarang', 'role' => fake()->jobTitle()]],
            'sort_order' => 0,
            'is_active' => true,
        ];
    }

    public function leadership(): static
    {
        return $this->state(fn () => ['group' => 'leadership']);
    }

    public function secretariat(): static
    {
        return $this->state(fn () => ['group' => 'secretariat']);
    }
}
