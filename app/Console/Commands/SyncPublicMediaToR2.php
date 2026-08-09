<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Throwable;

#[Signature('media:sync-to-r2 {--dry-run : Tampilkan rencana tanpa mengunggah file} {--force : Timpa file yang sudah ada di R2}')]
#[Description('Salin media publik lokal ke bucket Cloudflare R2')]
class SyncPublicMediaToR2 extends Command
{
    public function handle(): int
    {
        $source = Storage::disk('public_local');
        $isDryRun = (bool) $this->option('dry-run');
        $destination = $isDryRun ? null : Storage::disk('r2');
        $files = collect($source->allFiles())
            ->reject(fn (string $path): bool => str_starts_with(basename($path), '.'))
            ->values()
            ->all();

        if ($files === []) {
            $this->components->info('Tidak ada media lokal yang perlu disinkronkan.');

            return self::SUCCESS;
        }

        $copied = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($files as $path) {
            if ($isDryRun) {
                $this->line("[simulasi] {$path}");
                $copied++;

                continue;
            }

            if (! $destination instanceof FilesystemAdapter) {
                $this->components->error('Disk tujuan R2 tidak tersedia.');

                return self::FAILURE;
            }

            if (! $this->option('force') && $destination->exists($path)) {
                $skipped++;

                continue;
            }

            if ($this->copyFile($source, $destination, $path)) {
                $copied++;
            } else {
                $failed++;
            }
        }

        $this->newLine();
        $this->components->info("Selesai: {$copied} disalin, {$skipped} dilewati, {$failed} gagal.");

        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }

    private function copyFile(
        FilesystemAdapter $source,
        FilesystemAdapter $destination,
        string $path,
    ): bool {
        $stream = null;

        try {
            $stream = $source->readStream($path);

            if (! is_resource($stream)) {
                $this->components->error("Gagal membaca {$path}.");

                return false;
            }

            if (! $destination->put($path, $stream)) {
                $this->components->error("Gagal mengunggah {$path}.");

                return false;
            }

            $this->line("[disalin] {$path}");

            return true;
        } catch (Throwable $exception) {
            report($exception);
            $this->components->error("Gagal mengunggah {$path}: {$exception->getMessage()}");

            return false;
        } finally {
            if (is_resource($stream)) {
                fclose($stream);
            }
        }
    }
}
