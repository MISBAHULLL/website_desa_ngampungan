<?php

namespace Database\Seeders;

use App\Models\VillageProfile;
use Illuminate\Database\Seeder;

class VillageProfileSeeder extends Seeder
{
    public function run(): void
    {
        VillageProfile::factory()->create();
    }
}
