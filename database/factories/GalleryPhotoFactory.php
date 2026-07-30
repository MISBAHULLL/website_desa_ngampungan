<?php

namespace Database\Factories;

use App\Models\GalleryPhoto;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GalleryPhoto>
 */
class GalleryPhotoFactory extends Factory
{
    protected $model = GalleryPhoto::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'category' => fake()->randomElement(['Kegiatan Desa', 'Pembangunan', 'UMKM', 'Alam & Pertanian']),
            'album' => 'Dokumentasi '.fake()->year(),
            'caption' => fake()->paragraph(),
            'image_path' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
            'image_alt' => $title,
            'is_featured' => fake()->boolean(20),
            'captured_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
