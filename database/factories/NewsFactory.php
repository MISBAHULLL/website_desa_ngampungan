<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<News>
 */
class NewsFactory extends Factory
{
    protected $model = News::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(2),
            'content' => [
                fake()->paragraph(4),
                fake()->paragraph(4),
                fake()->paragraph(3),
            ],
            'category' => fake()->randomElement(['Pertanian', 'Kesehatan', 'UMKM & Budaya', 'Pembangunan', 'Pemerintahan']),
            'author' => 'Admin Desa',
            'image_path' => null,
            'image_alt' => 'Foto liputan kegiatan desa',
            'is_featured' => false,
            'published_at' => now(),
        ];
    }
}
