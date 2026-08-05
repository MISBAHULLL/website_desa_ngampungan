<?php

use App\Models\User;
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
