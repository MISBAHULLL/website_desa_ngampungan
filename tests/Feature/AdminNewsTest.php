<?php

use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(LazilyRefreshDatabase::class);

function validNewsPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Kerja Bakti Desa Ngampungan 2026',
        'category' => 'Pembangunan',
        'excerpt' => 'Warga desa bergotong royong membersihkan saluran air.',
        'content' => [
            'Warga Desa Ngampungan antusias dalam kegiatan kerja bakti.',
            'Kegiatan ini berjalan dengan lancar dan penuh kebersamaan.',
        ],
        'author' => 'Admin Desa',
        'is_featured' => false,
        'published_at' => now()->format('Y-m-d H:i:s'),
    ], $overrides);
}

function fakeNewsImage(string $extension): UploadedFile
{
    $encodedImage = match ($extension) {
        'jpg' => '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/EH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/EH//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/EH//2Q==',
        'png' => 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    };

    return UploadedFile::fake()->createWithContent(
        "dokumentasi.{$extension}",
        base64_decode($encodedImage, true),
    );
}

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

    $payload = validNewsPayload([
        'category' => 'Pendidikan',
        'is_featured' => true,
    ]);

    $this->actingAs($user)
        ->post(route('admin.news.store'), $payload)
        ->assertRedirect(route('admin.news.index'));

    $this->assertDatabaseHas('news', [
        'title' => 'Kerja Bakti Desa Ngampungan 2026',
        'category' => 'Pendidikan',
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
        ->put(route('admin.news.update', $news), validNewsPayload([
            'title' => 'Judul Baru Perbaikan',
            'category' => 'Pertanian',
            'excerpt' => 'Ringkasan artikel yang diperbarui.',
            'content' => ['Paragraf 1 hasil suntingan.'],
            'author' => 'Tim Redaksi',
        ]))
        ->assertRedirect(route('admin.news.index'));

    $this->assertDatabaseHas('news', [
        'id' => $news->id,
        'title' => 'Judul Baru Perbaikan',
    ]);
});

test('authenticated users can upload supported news images', function (string $extension) {
    Storage::fake('public');
    $user = User::factory()->create();
    $image = fakeNewsImage($extension);

    $this->actingAs($user)
        ->post(route('admin.news.store'), validNewsPayload(['image' => $image]))
        ->assertRedirect(route('admin.news.index'))
        ->assertSessionHasNoErrors();

    $news = News::query()->where('title', 'Kerja Bakti Desa Ngampungan 2026')->firstOrFail();
    expect($news->image_path)->toStartWith('/storage/news/');
    Storage::disk('public')->assertExists(Str::after($news->image_path, '/storage/'));
})->with(['jpg', 'png']);

test('replacing an uploaded news image removes the old local file', function () {
    Storage::fake('public');
    Storage::disk('public')->put('news/old.jpg', 'old image');
    $user = User::factory()->create();
    $news = News::factory()->create(['image_path' => '/storage/news/old.jpg']);

    $this->actingAs($user)
        ->post(route('admin.news.update', $news), validNewsPayload([
            '_method' => 'put',
            'title' => $news->title,
            'image' => fakeNewsImage('png'),
        ]))
        ->assertRedirect(route('admin.news.index'))
        ->assertSessionHasNoErrors();

    $news->refresh();
    Storage::disk('public')->assertMissing('news/old.jpg');
    Storage::disk('public')->assertExists(Str::after($news->image_path, '/storage/'));
});

test('unsupported news image formats are rejected', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $file = UploadedFile::fake()->create('dokumentasi.gif', 100, 'image/gif');

    $this->actingAs($user)
        ->post(route('admin.news.store'), validNewsPayload(['image' => $file]))
        ->assertSessionHasErrors('image');

    expect(News::query()->count())->toBe(0);
});

test('custom news categories are grouped under the other filter', function () {
    $user = User::factory()->create();
    News::factory()->create([
        'category' => 'KKN',
        'published_at' => now(),
    ]);
    News::factory()->create([
        'category' => 'Pertanian',
        'published_at' => now()->subMinute(),
    ]);

    $this->actingAs($user)
        ->get(route('admin.news.index', ['category' => 'Lainnya']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/news/index')
            ->where('categories', ['Pertanian', 'Lainnya'])
            ->has('news.data', 1)
            ->where('news.data.0.category', 'KKN'));

    $this->get(route('news.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('news/index')
            ->where('otherCategoryLabel', 'Lainnya')
            ->where('categoryOptions.0', 'Pertanian')
            ->has('dbArticles', 2)
            ->where('dbArticles.0.category', 'KKN'));
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
