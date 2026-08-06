<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin Desa Ngampungan',
            'email' => 'admin@desangampungan.id',
        ]);

        $this->call(ApbdesSeeder::class);
        $this->call(VillageProfileSeeder::class);
        $this->call(VillageLeaderSeeder::class);
        $this->call(NewsSeeder::class);
        $this->call(AnnouncementSeeder::class);
        $this->call(GalleryPhotoSeeder::class);
        $this->call(AgendaSeeder::class);
    }
}
