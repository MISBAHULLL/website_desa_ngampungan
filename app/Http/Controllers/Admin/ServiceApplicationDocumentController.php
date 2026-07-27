<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceApplication;
use App\Models\ServiceApplicationDocument;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ServiceApplicationDocumentController extends Controller
{
    public function __invoke(
        ServiceApplication $serviceApplication,
        ServiceApplicationDocument $document,
    ): StreamedResponse {
        Gate::authorize('view', $serviceApplication);

        $disk = Storage::disk($document->storage_disk);

        abort_unless($disk->exists($document->storage_path), 404);

        $extension = strtolower(pathinfo($document->original_name, PATHINFO_EXTENSION));
        $safeExtension = in_array($extension, ['pdf', 'jpg', 'jpeg', 'png'], true)
            ? $extension
            : 'bin';
        $downloadName = "{$serviceApplication->reference_number}-dokumen-{$document->id}.{$safeExtension}";

        return $disk->download(
            $document->storage_path,
            $downloadName,
            ['Content-Type' => $document->mime_type],
        );
    }
}
