<?php

use App\Models\Announcement;
use App\Models\ApbdesSummary;
use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('homepage sends only the latest card data without full article bodies', function () {
    News::factory()
        ->count(10)
        ->sequence(fn ($sequence): array => [
            'title' => "Berita {$sequence->index}",
            'slug' => "berita-{$sequence->index}",
            'published_at' => now()->subMinutes($sequence->index),
        ])
        ->create();

    Announcement::factory()->count(5)->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('dbArticles', 7)
            ->missing('dbArticles.0.content')
            ->has('dbAnnouncements', 3)
            ->missing('dbAnnouncements.0.content')
            ->missing('apbdesSummaries'));
});

test('APBDes data is loaded only when the homepage requests that section', function () {
    $summary = ApbdesSummary::query()->create([
        'year' => '2028',
        'updated_date' => '2028-07-20',
        'net_financing' => 25_000_000,
    ]);
    $summary->incomeSources()->create([
        'code' => 'DD',
        'label' => 'Dana Desa',
        'amount' => 2_000_000_000,
    ]);
    $summary->activities()->create([
        'code' => '2.1.01',
        'name' => 'Pembangunan jalan desa',
        'category' => 'pembangunan',
        'budget' => 1_000_000_000,
        'realized' => 500_000_000,
        'location' => 'Dusun Ngampungan',
        'status' => 'berjalan',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->missing('apbdesSummaries')
            ->reloadOnly('apbdesSummaries', fn (Assert $reload) => $reload
                ->has('apbdesSummaries', 1)
                ->where('apbdesSummaries.0.year', '2028')
                ->where('apbdesSummaries.0.realizationPercentage', 50)));
});
