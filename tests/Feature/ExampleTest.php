<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
