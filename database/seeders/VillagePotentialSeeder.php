<?php

namespace Database\Seeders;

use App\Models\VillagePotential;
use Illuminate\Database\Seeder;

class VillagePotentialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = file_get_contents(storage_path('app/potentials.json'));

        if ($json === false) {
            return;
        }

        $potentials = json_decode($json, true);

        if (! is_array($potentials)) {
            return;
        }

        foreach ($potentials as $data) {
            $potential = VillagePotential::create([
                'slug' => $data['slug'],
                'category' => $data['category'],
                'name' => $data['name'],
                'image_path' => $data['image'],
                'image_alt' => $data['imageAlt'] ?? null,
                'short_description' => $data['shortDescription'],
                'description' => $data['description'],
                'manager_label' => $data['managerLabel'],
                'manager_name' => $data['managerName'],
                'address' => $data['address'],
                'phone' => $data['phone'],
                'phone_label' => $data['phoneLabel'] ?? null,
                'opening_hours' => $data['openingHours'] ?? null,
                'tags' => $data['tags'] ?? [],
                'latitude' => $data['map']['latitude'] ?? null,
                'longitude' => $data['map']['longitude'] ?? null,
                'location_label' => $data['map']['locationLabel'] ?? null,
            ]);

            if (isset($data['offerings']) && is_array($data['offerings'])) {
                foreach ($data['offerings'] as $index => $offering) {
                    $potential->offerings()->create([
                        'name' => $offering['name'],
                        'description' => $offering['description'],
                        'sort_order' => $index,
                    ]);
                }
            }
        }
    }
}
