<?php

namespace Database\Factories;

use App\Models\ServiceApplication;
use App\Models\ServiceApplicationStatusHistory;
use App\ServiceApplicationStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceApplicationStatusHistory>
 */
class ServiceApplicationStatusHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_application_id' => ServiceApplication::factory(),
            'status' => ServiceApplicationStatus::Submitted,
            'public_notes' => 'Pengajuan berhasil diterima sistem.',
            'changed_by' => null,
        ];
    }
}
