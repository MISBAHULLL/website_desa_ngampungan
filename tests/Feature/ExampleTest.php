<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('the public homepage renders the village landing page', function () {
    $response = $this->get(route('home'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('auth.user', null));
});

test('the public homepage shares the authenticated user for the admin link', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('home'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('auth.user.id', $user->id)
            ->where('auth.user.email', $user->email));
});

test('the public navigation contains the PRD menu hierarchy', function () {
    $navigationSource = file_get_contents(resource_path('js/pages/welcome.tsx'));

    expect($navigationSource)->not->toBeFalse();

    $expectedMenus = [
        'Beranda',
        'Profil',
        'Pemerintahan',
        'Informasi',
        'Transparansi',
        'Potensi Desa',
        'Pelayanan',
        'Kontak',
        'Selayang Pandang',
        'Visi dan Misi',
        'Sejarah Desa',
        'Data Wilayah',
        'Kepala Desa',
        'Struktur Organisasi',
        'Perangkat Desa',
        'Lembaga Desa',
        'Berita',
        'Pengumuman',
        'Agenda',
        'Galeri',
        'APBDes',
        'Dokumen Publik',
        'UMKM',
        'Pertanian',
        'Wisata',
        'Budaya',
        'Kuliner',
        'Jasa',
        'Informasi Pelayanan',
        'Persyaratan Surat',
        'Pengajuan Surat',
        'Pengaduan',
        'Pelacakan Status',
    ];

    foreach ($expectedMenus as $expectedMenu) {
        expect($navigationSource)->toContain("label: '{$expectedMenu}'");
    }
});

test('the homepage exposes the PRD village potential categories', function () {
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));
    $potentialDataSource = file_get_contents(resource_path('js/lib/dummy-village-potentials.ts'));

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('id="potensi"')
        ->toContain('role="tablist"')
        ->toContain('role="tabpanel"')
        ->toContain('aria-selected')
        ->toContain('activePotentialCategory')
        ->toContain('VillagePotentialCarousel')
        ->toContain('.slice(0, 3)')
        ->toContain('Buka Direktori')
        ->toContain("query: { category: 'umkm' }")
        ->not->toContain("label: 'Potensi Lainnya'");

    expect($potentialDataSource)
        ->not->toBeFalse()
        ->toContain("label: 'UMKM'")
        ->toContain("label: 'Pertanian'")
        ->toContain("label: 'Wisata'")
        ->toContain("label: 'Budaya'")
        ->toContain("label: 'Kuliner'")
        ->toContain("label: 'Jasa'")
        ->toContain('dummyVillagePotentialEntries')
        ->toContain('Anyaman Bambu Maju Karya')
        ->toContain('Kriya Kayu Ngampungan')
        ->toContain('Kelompok Tani Maju Makmur')
        ->toContain('Keripik Pisang Mbok Yati')
        ->toContain("image: 'https://images.unsplash.com/")
        ->toContain('findDummyVillagePotentialEntry')
        ->toContain('satisfies readonly VillagePotentialEntry[]');
});

test('the hero uses actionable PRD calls to action', function () {
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('Kenali Desa')
        ->toContain('Lihat Layanan')
        ->not->toContain('Video Profil');
});

test('the homepage dummy village statistics match the PRD metrics', function () {
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));

    expect($homepageSource)->not->toBeFalse();

    $statisticsSource = Str::between(
        $homepageSource,
        'const dummyVillageStatistics = [',
        '] as const;',
    );

    expect($statisticsSource)
        ->toContain("label: 'Total Penduduk'")
        ->toContain("label: 'Jumlah KK'")
        ->toContain("label: 'Jumlah Dusun'")
        ->toContain("label: 'Luas Wilayah'")
        ->not->toContain("label: 'Prestasi'")
        ->not->toContain("label: 'UMKM'");

    expect($homepageSource)
        ->toContain('dummyVillageStatistics.map')
        ->toContain('sm:grid-cols-4');
});

test('the homepage contains the village head welcome content from the PRD', function () {
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('id="sambutan-kepala-desa"')
        ->toContain('Melayani dengan Transparan dan Dekat')
        ->toContain('Bapak. Rohan')
        ->toContain('Kepala Desa Ngampungan');
});
