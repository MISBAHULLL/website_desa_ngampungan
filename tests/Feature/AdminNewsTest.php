<?php

use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest users cannot access news management pages', function () {
    $this->get(route('admin.news.index'))
        ->assertRedirect(route('login'));

    $this->get(route('admin.news.create'))
        ->assertRedirect(route('login'));
});

test('authenticated users can view the admin news list', function () {
    $user = User::factory()->create();
    News::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('admin.news.index'))
        ->assertOk();
});

test('authenticated users can create a new news article', function () {
    $user = User::factory()->create();

    $payload = [
        'title' => 'Kerja Bakti Desa Ngampungan 2026',
        'category' => 'Kegiatan',
        'excerpt' => 'Warga desa bergotong royong membersihkan saluran air.',
        'content' => [
            'Warga Desa Ngampungan antusias dalam kegiatan kerja bakti.',
            'Kegiatan ini berjalan dengan lancar dan penuh kebersamaan.',
        ],
        'author' => 'Admin Desa',
        'is_featured' => 1,
        'published_at' => now()->format('Y-m-d H:i:s'),
    ];

    $this->actingAs($user)
        ->post(route('admin.news.store'), $payload)
        ->assertRedirect(route('admin.news.index'));

    $this->assertDatabaseHas('news', [
        'title' => 'Kerja Bakti Desa Ngampungan 2026',
        'category' => 'Kegiatan',
        'is_featured' => true,
    ]);
});

test('authenticated users can toggle featured status of a news article', function () {
    $user = User::factory()->create();
    $news1 = News::factory()->create(['is_featured' => true]);
    $news2 = News::factory()->create(['is_featured' => false]);

    $this->actingAs($user)
        ->patch(route('admin.news.toggle-featured', $news2))
        ->assertRedirect();

    expect($news1->fresh()->is_featured)->toBeFalse();
    expect($news2->fresh()->is_featured)->toBeTrue();
});

test('authenticated users can update a news article', function () {
    $user = User::factory()->create();
    $news = News::factory()->create(['title' => 'Judul Lama']);

    $this->actingAs($user)
        ->put(route('admin.news.update', $news), [
            'title' => 'Judul Baru Perbaikan',
            'category' => 'Pertanian',
            'excerpt' => 'Ringkasan artikel yang diperbarui.',
            'content' => ['Paragraf 1 hasil suntingan.'],
            'author' => 'Tim Redaksi',
            'is_featured' => 0,
            'published_at' => now()->format('Y-m-d H:i:s'),
        ])
        ->assertRedirect(route('admin.news.index'));

    $this->assertDatabaseHas('news', [
        'id' => $news->id,
        'title' => 'Judul Baru Perbaikan',
    ]);
});

test('authenticated users can delete a news article', function () {
    $user = User::factory()->create();
    $news = News::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.news.destroy', $news))
        ->assertRedirect(route('admin.news.index'));

    $this->assertDatabaseMissing('news', [
        'id' => $news->id,
    ]);
});
