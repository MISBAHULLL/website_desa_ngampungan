<?php

use Illuminate\Support\Facades\Storage;

test('command copies local public media to R2 while preserving paths', function () {
    Storage::fake('public_local');
    Storage::fake('r2');
    Storage::disk('public_local')->put('news/cover.jpg', 'cover');
    Storage::disk('public_local')->put('gallery/videos/activity.mp4', 'video');
    Storage::disk('public_local')->put('.gitignore', '*');

    $this->artisan('media:sync-to-r2')
        ->expectsOutputToContain('2 disalin, 0 dilewati, 0 gagal')
        ->assertSuccessful();

    Storage::disk('r2')->assertExists('news/cover.jpg');
    Storage::disk('r2')->assertExists('gallery/videos/activity.mp4');
    Storage::disk('r2')->assertMissing('.gitignore');
});

test('dry run lists media without copying it to R2', function () {
    Storage::fake('public_local');
    Storage::disk('public_local')->put('hero-slides/hero.jpg', 'hero');

    $this->artisan('media:sync-to-r2 --dry-run')
        ->expectsOutputToContain('[simulasi] hero-slides/hero.jpg')
        ->assertSuccessful();

});
