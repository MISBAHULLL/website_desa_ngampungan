<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Psr\Http\Message\StreamInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PublicMediaController extends Controller
{
    public function __invoke(Request $request, string $path): StreamedResponse
    {
        $path = $this->validatedPath($path);
        $disk = Storage::disk('public');

        abort_unless($disk->exists($path), 404);

        if (config('filesystems.disks.public.driver') !== 's3') {
            return $disk->response($path, headers: $this->cacheHeaders());
        }

        try {
            $pendingRequest = Http::connectTimeout(10)
                ->timeout(120)
                ->withOptions(['stream' => true]);

            if ($request->hasHeader('Range')) {
                $pendingRequest = $pendingRequest->withHeaders([
                    'Range' => (string) $request->header('Range'),
                ]);
            }

            $upstream = $pendingRequest->get(
                $disk->temporaryUrl($path, now()->addMinutes(5)),
            );
        } catch (ConnectionException) {
            abort(502, 'Media sementara tidak dapat diakses.');
        }

        if (! $upstream->successful()) {
            abort($upstream->status() === 404 ? 404 : 502);
        }

        $upstreamResponse = $upstream->toPsrResponse();
        $headers = $this->cacheHeaders();

        foreach ($this->forwardedHeaders() as $header) {
            if ($upstreamResponse->hasHeader($header)) {
                $headers[$header] = $upstreamResponse->getHeaderLine($header);
            }
        }

        return response()->stream(
            fn () => $this->streamBody($upstreamResponse->getBody()),
            $upstream->status(),
            $headers,
        );
    }

    private function validatedPath(string $path): string
    {
        $decodedPath = rawurldecode($path);
        $segments = explode('/', $decodedPath);

        abort_if(
            $decodedPath === ''
            || str_contains($decodedPath, "\0")
            || str_contains($decodedPath, '\\')
            || str_starts_with($decodedPath, '/')
            || in_array('.', $segments, true)
            || in_array('..', $segments, true),
            404,
        );

        return $decodedPath;
    }

    /** @return array<string, string> */
    private function cacheHeaders(): array
    {
        return [
            'Cache-Control' => 'public, max-age=86400, stale-while-revalidate=604800',
            'Content-Disposition' => 'inline',
            'X-Content-Type-Options' => 'nosniff',
        ];
    }

    /** @return list<string> */
    private function forwardedHeaders(): array
    {
        return [
            'Accept-Ranges',
            'Content-Length',
            'Content-Range',
            'Content-Type',
            'ETag',
            'Last-Modified',
        ];
    }

    private function streamBody(StreamInterface $body): void
    {
        while (! $body->eof() && connection_aborted() === 0) {
            echo $body->read(64 * 1024);
        }
    }
}
