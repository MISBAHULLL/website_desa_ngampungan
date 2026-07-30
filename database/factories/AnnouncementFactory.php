<?php

namespace Database\Factories;

use App\Models\Announcement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Announcement>
 */
class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'title' => $title,
            'slug' => Announcement::generateUniqueSlug($title),
            'summary' => fake()->paragraph(2),
            'content' => [
                fake()->paragraph(3),
                fake()->paragraph(4),
            ],
            'priority' => fake()->randomElement(['normal', 'important', 'emergency']),
            'status' => 'active',
            'is_pinned' => fake()->boolean(20),
            'starts_at' => now()->subDays(rand(1, 10)),
            'ends_at' => now()->addDays(rand(5, 20)),
        ];
    }
}
