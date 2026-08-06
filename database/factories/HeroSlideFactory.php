<?php

namespace Database\Factories;

use App\Models\HeroSlide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HeroSlide>
 */
class HeroSlideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'subtitle' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'primary_cta_text' => 'Lihat Profil',
            'primary_cta_url' => '/profil-desa',
            'secondary_cta_text' => 'Lihat Layanan',
            'secondary_cta_url' => '/layanan',
            'background_image' => null,
            'order' => fake()->numberBetween(1, 20),
            'is_active' => true,
        ];
    }
}
