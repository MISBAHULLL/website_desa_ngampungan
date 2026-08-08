<?php

namespace Database\Seeders;

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
        $this->call(AdminUserSeeder::class);
        $this->call(ApbdesSeeder::class);
        $this->call(VillageProfileSeeder::class);
        $this->call(VillageLeaderSeeder::class);
        $this->call(NewsSeeder::class);
        $this->call(AnnouncementSeeder::class);
        $this->call(GalleryPhotoSeeder::class);
        $this->call(AgendaSeeder::class);
    }
}
