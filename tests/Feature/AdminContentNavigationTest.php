<?php

use App\Models\User;
use App\Models\VillageProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guest is redirected from the three admin content pages', function (string $routeName) {
    $this->get(route($routeName))->assertRedirect(route('login'));
})->with([
    'village profile' => 'admin.village-profile.index',
    'hero slides' => 'admin.hero-slides.index',
    'village leaders' => 'admin.village-leaders.index',
]);

test('admin can open village profile with safe empty defaults', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.village-profile.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/village-profile/index')
            ->where('profile.totalPopulation', 0)
            ->where('profile.totalFamilies', 0)
            ->where('profile.totalHamlets', 0)
            ->where('profile.totalAreaHectares', 0)
            ->where('profile.hamlets', [])
            ->where('profile.landUse', []));
});

test('admin can update the village profile using the edit form payload', function () {
    $profile = VillageProfile::factory()->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.village-profile.update'), [
            'totalPopulation' => 3812,
            'totalFamilies' => 1240,
            'totalHamlets' => 5,
            'totalAreaHectares' => 475,
            'boundaryNorth' => 'Desa Utara',
            'boundaryEast' => 'Desa Timur',
            'boundarySouth' => 'Desa Selatan',
            'boundaryWest' => 'Desa Barat',
            'hamlets' => [
                [
                    'name' => 'Dusun Ngampungan',
                    'rw_count' => 4,
                    'rt_count' => 12,
                    'kk_count' => 420,
                    'description' => 'Pusat pemerintahan desa.',
                ],
            ],
            'landUse' => [
                [
                    'category' => 'Pertanian',
                    'area_hectares' => 250,
                    'percentage' => 52.63,
                ],
            ],
            'mapLatitude' => -7.6749,
            'mapLongitude' => 112.3385,
            'mapZoom' => 14,
            'mapGoogleUrl' => 'https://maps.google.com/?q=-7.6749,112.3385',
            'mapHdFileUrl' => null,
        ])
        ->assertValid()
        ->assertRedirect(route('admin.village-profile.index'));

    $profile->refresh();

    expect($profile)
        ->total_population->toBe(3812)
        ->total_families->toBe(1240)
        ->total_hamlets->toBe(5)
        ->total_area_hectares->toBe(475)
        ->boundary_north->toBe('Desa Utara')
        ->and($profile->hamlets)->toHaveCount(1)
        ->and($profile->land_use)->toHaveCount(1);
});

test('admin can open and search hero slides', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.hero-slides.index', ['search' => 'pelayanan']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/hero-slides/index')
            ->where('filters.search', 'pelayanan')
            ->where('slides.total', 0));
});

test('admin can open village leaders page', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.village-leaders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/village-leaders/index')
            ->where('leaders.total', 0));
});

test('admin can open the hero slide creation page', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.hero-slides.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/hero-slides/create')
            ->where('nextOrder', 1));
});
