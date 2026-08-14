<?php

use App\Models\VillageInstitution;
use App\Models\VillagePotential;
use App\Models\VillagePotentialOffering;
use App\Support\PublicImageStorage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('public media storage stores files on the configured public disk', function () {
    Storage::fake('public');

    $url = app(PublicImageStorage::class)->store(
        UploadedFile::fake()->create('kegiatan.jpg', 128, 'image/jpeg'),
        'gallery/photos',
    );

    $storedFiles = Storage::disk('public')->allFiles('gallery/photos');

    expect($storedFiles)->toHaveCount(1)
        ->and($url)->toContain('gallery/photos/');
    Storage::disk('public')->assertExists($storedFiles[0]);
});

test('public media storage deletes files referenced by an R2 public URL', function () {
    Storage::fake('public');
    config()->set('filesystems.disks.public.url', 'https://media.example.test');
    Storage::disk('public')->put('news/foto kegiatan.jpg', 'image-content');

    app(PublicImageStorage::class)->delete(
        'https://media.example.test/news/foto%20kegiatan.jpg',
    );

    Storage::disk('public')->assertMissing('news/foto kegiatan.jpg');
});

test('public media storage resolves legacy local URLs through the configured public disk', function () {
    Storage::fake('public', ['url' => 'https://media.example.test']);
    config()->set('app.url', 'https://website.example.test');
    config()->set('filesystems.disks.r2.url', 'https://pub-example.r2.dev');

    $mediaStorage = app(PublicImageStorage::class);

    expect($mediaStorage->url('/storage/gallery/videos/kegiatan.mp4'))
        ->toBe('https://media.example.test/gallery/videos/kegiatan.mp4')
        ->and($mediaStorage->url('http://localhost:8000/storage/news/foto%20desa.jpg'))
        ->toBe('https://media.example.test/news/foto desa.jpg')
        ->and($mediaStorage->url('hero-slides/sawah.jpg'))
        ->toBe('https://media.example.test/hero-slides/sawah.jpg')
        ->and($mediaStorage->url('https://pub-example.r2.dev/news/foto%20lama.jpg'))
        ->toBe('https://media.example.test/news/foto lama.jpg')
        ->and($mediaStorage->url('https://website.example.test/media/gallery/foto.jpg'))
        ->toBe('https://media.example.test/gallery/foto.jpg')
        ->and($mediaStorage->url('https://images.unsplash.com/photo.jpg'))
        ->toBe('https://images.unsplash.com/photo.jpg')
        ->and($mediaStorage->url('/images/news/default.png'))
        ->toBe('/images/news/default.png');
});

test('public media storage replaces a cached localhost media URL with a same origin URL', function () {
    Storage::fake('public', ['url' => '/media']);
    config()->set('app.url', 'https://website.example.test');

    expect(app(PublicImageStorage::class)->url(
        'http://localhost/media/news/foto-teman.jpg',
    ))->toBe('/media/news/foto-teman.jpg');
});

test('models expose configured public disk URLs for stored media paths', function () {
    Storage::fake('public');

    $institution = new VillageInstitution(['logo_path' => 'village-institutions/logo.png']);
    $potential = new VillagePotential(['image_path' => 'potentials/cover.jpg']);
    $offering = new VillagePotentialOffering(['image_path' => 'potentials/offerings/product.jpg']);

    expect($institution->logo_url)->toContain('village-institutions/logo.png')
        ->and($potential->image_url)->toContain('potentials/cover.jpg')
        ->and($offering->image_url)->toContain('potentials/offerings/product.jpg');
});
