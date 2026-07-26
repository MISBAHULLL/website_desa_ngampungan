<?php

namespace Database\Factories;

use App\ContactMessageStatus;
use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'contact' => fake()->phoneNumber(),
            'category' => fake()->randomElement([
                'general',
                'service_complaint',
                'development_proposal',
            ]),
            'message' => fake()->paragraph(),
            'status' => ContactMessageStatus::Unread,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'read_at' => null,
            'resolved_at' => null,
        ];
    }

    public function read(): static
    {
        return $this->state(fn (): array => [
            'status' => ContactMessageStatus::Read,
            'read_at' => now(),
        ]);
    }

    public function resolved(): static
    {
        return $this->state(fn (): array => [
            'status' => ContactMessageStatus::Resolved,
            'read_at' => now(),
            'resolved_at' => now(),
        ]);
    }
}
