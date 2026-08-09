<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class PublicImageStorage
{
    public function url(?string $storedValue): ?string
    {
        if (! $storedValue) {
            return null;
        }

        $configuredUrl = rtrim((string) config('filesystems.disks.public.url'), '/');

        if ($configuredUrl !== '' && Str::startsWith($storedValue, $configuredUrl.'/')) {
            return $storedValue;
        }

        $urlPath = parse_url($storedValue, PHP_URL_PATH);

        if (is_string($urlPath) && Str::startsWith($urlPath, '/storage/')) {
            $host = parse_url($storedValue, PHP_URL_HOST);
            $appHost = parse_url((string) config('app.url'), PHP_URL_HOST);

            if (! is_string($host) || in_array($host, ['localhost', '127.0.0.1', $appHost], true)) {
                return Storage::disk('public')->url(
                    rawurldecode(Str::after($urlPath, '/storage/')),
                );
            }
        }

        if (Str::startsWith($storedValue, ['http://', 'https://', '/'])) {
            return $storedValue;
        }

        return Storage::disk('public')->url($storedValue);
    }

    public function store(UploadedFile $image, string $directory): string
    {
        $storedPath = $this->storePath($image, $directory);

        return Storage::disk('public')->url($storedPath);
    }

    public function storePath(UploadedFile $image, string $directory): string
    {
        $storedPath = $image->store($directory, 'public');

        if ($storedPath === false) {
            throw new RuntimeException('Gambar gagal disimpan ke penyimpanan publik.');
        }

        return $storedPath;
    }

    public function delete(?string $publicUrl): void
    {
        if (! $publicUrl) {
            return;
        }

        $configuredUrl = rtrim((string) config('filesystems.disks.public.url'), '/');

        if ($configuredUrl !== '' && Str::startsWith($publicUrl, $configuredUrl.'/')) {
            $this->deletePath(rawurldecode(Str::after($publicUrl, $configuredUrl.'/')));

            return;
        }

        $urlPath = parse_url($publicUrl, PHP_URL_PATH);

        if (! is_string($urlPath) || ! Str::startsWith($urlPath, '/storage/')) {
            return;
        }

        $this->deletePath(Str::after($urlPath, '/storage/'));
    }

    public function deletePath(?string $storedPath): void
    {
        if (! $storedPath || Str::startsWith($storedPath, ['http://', 'https://'])) {
            return;
        }

        Storage::disk('public')->delete($storedPath);
    }
}
