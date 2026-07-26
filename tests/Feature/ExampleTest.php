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
        'Statistik Penduduk',
        'Produk Hukum',
        'Dokumen Publik',
        'UMKM',
        'Pertanian',
        'Wisata',
        'Potensi Lainnya',
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
        ->toContain('Data sementara')
        ->toContain('dummyVillageStatistics.map')
        ->toContain('grid-cols-2')
        ->toContain('lg:grid-cols-4')
        ->toContain('group-hover:scale-[1.06]')
        ->toContain('group-active:scale-[1.1]')
        ->toContain('active:scale-[0.985]');
});

test('the homepage contains the village head welcome content from the PRD', function () {
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('id="sambutan-kepala-desa"')
        ->toContain('src="/assets/Kepala_desa.png"')
        ->toContain('alt="Ilustrasi Kepala Desa Ngampungan"')
        ->toContain('group-hover:-translate-y-1')
        ->toContain('group-hover:scale-[1.025]')
        ->toContain('group-hover:translate-x-1')
        ->toContain('rounded-tr-[5rem]')
        ->toContain('Pemerintah Desa')
        ->toContain('motion-reduce:transition-none')
        ->toContain('Melayani dengan Transparan dan Dekat')
        ->toContain('Kusnadi, S.Sos')
        ->toContain('Kepala Desa Ngampungan');
});
