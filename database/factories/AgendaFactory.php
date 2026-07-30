<?php

namespace Database\Factories;

use App\Models\Agenda;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Agenda>
 */
class AgendaFactory extends Factory
{
    protected $model = Agenda::class;

    public function definition(): array
    {
        $title = fake()->sentence(4);
        $date = fake()->dateTimeBetween('now', '+2 months');

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'category' => fake()->randomElement(['Pelayanan', 'Musyawarah', 'Pemberdayaan', 'Kesehatan', 'Infrastruktur']),
            'summary' => fake()->paragraph(),
            'details' => [fake()->sentence(), fake()->sentence()],
            'event_date' => $date->format('Y-m-d'),
            'day_label' => strtoupper($date->format('D')),
            'date_label' => $date->format('d M Y'),
            'time_label' => '08:00 WIB - Selesai',
            'location' => 'Balai Desa Ngampungan',
            'organizer' => 'Pemerintah Desa Ngampungan',
            'contact' => '0812-3456-7890',
            'registration_required' => fake()->boolean(30),
            'status' => 'upcoming',
            'is_featured' => fake()->boolean(20),
        ];
    }
}
