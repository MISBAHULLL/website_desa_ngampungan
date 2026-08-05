<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class PublicImageStorage
{
    public function store(UploadedFile $image, string $directory): string
    {
        $storedPath = $image->store($directory, 'public');

        if ($storedPath === false) {
            throw new RuntimeException('Gambar gagal disimpan ke penyimpanan publik.');
        }

        return Storage::disk('public')->url($storedPath);
    }

    public function delete(?string $publicUrl): void
    {
        if (! $publicUrl) {
            return;
        }

        $urlPath = parse_url($publicUrl, PHP_URL_PATH);

        if (! is_string($urlPath) || ! Str::startsWith($urlPath, '/storage/')) {
            return;
        }

        Storage::disk('public')->delete(Str::after($urlPath, '/storage/'));
    }
}
