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

        $managedPath = $this->managedPath($storedValue);

        if ($managedPath !== null) {
            return Storage::disk('public')->url($managedPath);
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

        $managedPath = $this->managedPath($publicUrl);

        if ($managedPath !== null) {
            $this->deletePath($managedPath);
        }
    }

    public function deletePath(?string $storedPath): void
    {
        if (! $storedPath || Str::startsWith($storedPath, ['http://', 'https://'])) {
            return;
        }

        Storage::disk('public')->delete($storedPath);
    }

    private function managedPath(string $storedValue): ?string
    {
        $managedBaseUrls = array_filter([
            rtrim((string) config('filesystems.disks.public.url'), '/'),
            rtrim((string) config('filesystems.disks.r2.url'), '/'),
        ]);

        foreach ($managedBaseUrls as $baseUrl) {
            if (Str::startsWith($storedValue, $baseUrl.'/')) {
                return rawurldecode(Str::after($storedValue, $baseUrl.'/'));
            }
        }

        $urlPath = parse_url($storedValue, PHP_URL_PATH);

        if (! is_string($urlPath)) {
            return null;
        }

        $host = parse_url($storedValue, PHP_URL_HOST);
        $appHost = parse_url((string) config('app.url'), PHP_URL_HOST);
        $allowedHosts = ['localhost', '127.0.0.1'];

        if (is_string($appHost)) {
            $allowedHosts[] = $appHost;
        }

        if (is_string($host) && ! in_array($host, $allowedHosts, true)) {
            return null;
        }

        foreach (['/storage/', '/media/'] as $prefix) {
            if (Str::startsWith($urlPath, $prefix)) {
                return rawurldecode(Str::after($urlPath, $prefix));
            }
        }

        return null;
    }
}
