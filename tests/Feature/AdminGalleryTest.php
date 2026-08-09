<?php

use App\Models\GalleryPhoto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function fakeGalleryImage(): UploadedFile
{
    $image = base64_decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        true,
    );

    return UploadedFile::fake()->createWithContent('kerja-bakti.png', $image ?: '');
}

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
        'media_type' => 'photo',
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
    Storage::fake('public');
    $user = User::factory()->create();
    Storage::disk('public')->put('gallery/photos/delete-me.jpg', 'image-content');
    $photo = GalleryPhoto::factory()->create([
        'image_path' => Storage::disk('public')->url('gallery/photos/delete-me.jpg'),
    ]);

    $response = $this->actingAs($user)->delete(route('admin.gallery.destroy', $photo->id));

    $response->assertRedirect(route('admin.gallery.index'));
    $this->assertDatabaseMissing('gallery_photos', [
        'id' => $photo->id,
    ]);
    Storage::disk('public')->assertMissing('gallery/photos/delete-me.jpg');
});

test('authenticated user uploads a gallery photo to the public media disk', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('admin.gallery.store'), [
        'title' => 'Dokumentasi Kerja Bakti',
        'media_type' => 'photo',
        'category' => 'Kegiatan Desa',
        'album' => 'Album 2026',
        'caption' => 'Warga membersihkan lingkungan desa.',
        'image' => fakeGalleryImage(),
        'is_featured' => false,
        'captured_at' => '2026-08-09',
    ])->assertRedirect(route('admin.gallery.index'));

    $photo = GalleryPhoto::query()->where('title', 'Dokumentasi Kerja Bakti')->firstOrFail();
    $storedFiles = Storage::disk('public')->allFiles('gallery/photos');

    expect($photo->image_path)->toContain('gallery/photos/')
        ->and($storedFiles)->toHaveCount(1);
    Storage::disk('public')->assertExists($storedFiles[0]);
});
