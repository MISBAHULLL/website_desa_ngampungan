<?php

namespace Database\Factories;

use App\Models\ServiceApplication;
use App\ServiceApplicationStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ServiceApplication>
 */
class ServiceApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference_number' => 'NGP-'.now()->format('Ymd').'-'.Str::upper(Str::random(8)),
            'service_slug' => 'surat-keterangan-usaha',
            'service_title' => 'Surat Keterangan Usaha',
            'applicant_name' => fake()->name(),
            'national_id' => fake()->numerify('################'),
            'phone' => '08'.fake()->numerify('##########'),
            'address' => fake()->address(),
            'purpose' => fake()->sentence(),
            'status' => ServiceApplicationStatus::Submitted,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'submitted_at' => now(),
        ];
    }
}
