<?php

namespace Database\Factories;

use App\Models\ServiceApplication;
use App\Models\ServiceApplicationDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceApplicationDocument>
 */
class ServiceApplicationDocumentFactory extends Factory
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
            'document_key' => 'identity-card',
            'document_label' => 'KTP pemohon',
            'original_name' => 'ktp-contoh.pdf',
            'storage_disk' => 'local',
            'storage_path' => 'service-applications/example/identity-card.pdf',
            'mime_type' => 'application/pdf',
            'size' => 1024,
        ];
    }
}
