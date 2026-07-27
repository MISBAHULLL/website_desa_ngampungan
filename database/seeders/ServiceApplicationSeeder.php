<?php

namespace Database\Seeders;

use App\Models\ServiceApplication;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceApplicationSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ServiceApplication::factory()->count(5)->create();
    }
}
