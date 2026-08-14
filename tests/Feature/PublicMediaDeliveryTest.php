<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

test('public media is served from the application origin', function () {
    config()->set('filesystems.disks.public.driver', 'local');
    Storage::fake('public');
    Storage::disk('public')->put('news/foto-desa.jpg', 'image-content');

    $response = $this->get('/media/news/foto-desa.jpg');

    $response->assertOk()
        ->assertStreamed()
        ->assertHeader('Cache-Control', 'max-age=86400, public, stale-while-revalidate=604800')
        ->assertHeader('Content-Disposition', 'inline')
        ->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertStreamedContent('image-content');
});

test('public media rejects directory traversal paths', function () {
    config()->set('filesystems.disks.public.driver', 'local');
    Storage::fake('public');

    $this->get('/media/news/%2E%2E/private/document.pdf')->assertNotFound();
});

test('public media forwards byte ranges when streaming an R2 video', function () {
    config()->set('filesystems.disks.public.driver', 's3');
    Storage::fake('public');
    Storage::disk('public')->put('gallery/videos/demo.mp4', 'video-content');
    Storage::disk('public')->buildTemporaryUrlsUsing(
        fn (string $path): string => 'https://r2.example.test/'.$path,
    );

    Http::fake([
        'https://r2.example.test/*' => Http::response('part', 206, [
            'Accept-Ranges' => 'bytes',
            'Content-Length' => '4',
            'Content-Range' => 'bytes 0-3/13',
            'Content-Type' => 'video/mp4',
        ]),
    ]);

    $response = $this->withHeader('Range', 'bytes=0-3')
        ->get('/media/gallery/videos/demo.mp4');

    $response->assertStatus(206)
        ->assertStreamed()
        ->assertHeader('Accept-Ranges', 'bytes')
        ->assertHeader('Content-Range', 'bytes 0-3/13')
        ->assertHeader('Content-Type', 'video/mp4')
        ->assertStreamedContent('part');

    Http::assertSent(
        fn ($request): bool => $request->hasHeader('Range', 'bytes=0-3'),
    );
});
