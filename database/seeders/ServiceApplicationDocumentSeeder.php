<?php

namespace Database\Seeders;

use App\Models\ServiceApplicationDocument;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceApplicationDocumentSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ServiceApplicationDocument::factory()->count(5)->create();
    }
}
