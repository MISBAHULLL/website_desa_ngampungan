<?php

use App\Models\GalleryPhoto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can view gallery management page', function () {
    $user = User::factory()->create();
    GalleryPhoto::factory()->create(['title' => 'Foto Kegiatan Gotong Royong']);

    $response = $this->actingAs($user)->get(route('admin.gallery.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/gallery/index')
            ->has('photos.data', 1)
        );
});

test('authenticated user can create a photo with valid data', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.gallery.store'), [
        'title' => 'Foto Baru Desa',
        'category' => 'Kegiatan Desa',
        'album' => 'Album 2026',
        'caption' => 'Keterangan foto desa terbaru',
        'image_url' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        'is_featured' => true,
        'captured_at' => '2026-07-30',
    ]);

    $response->assertRedirect(route('admin.gallery.index'));
    $this->assertDatabaseHas('gallery_photos', [
        'title' => 'Foto Baru Desa',
        'category' => 'Kegiatan Desa',
        'album' => 'Album 2026',
        'is_featured' => true,
    ]);
});

test('authenticated user can delete a gallery photo', function () {
    $user = User::factory()->create();
    $photo = GalleryPhoto::factory()->create();

    $response = $this->actingAs($user)->delete(route('admin.gallery.destroy', $photo->id));

    $response->assertRedirect(route('admin.gallery.index'));
    $this->assertDatabaseMissing('gallery_photos', [
        'id' => $photo->id,
    ]);
});
