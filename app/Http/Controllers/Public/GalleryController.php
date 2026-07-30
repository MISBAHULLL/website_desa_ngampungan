<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\GalleryPhoto;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function __invoke(): Response
    {
        $dbPhotos = GalleryPhoto::latest('captured_at')->latest('id')->get()->map(function ($photo) {
            return [
                'id' => $photo->id,
                'title' => $photo->title,
                'caption' => $photo->caption,
                'category' => $photo->category,
                'album' => $photo->album,
                'capturedAt' => $photo->captured_at ? $photo->captured_at->format('Y-m-d') : null,
                'capturedLabel' => $photo->captured_at ? $photo->captured_at->translatedFormat('j F Y') : 'Terbaru',
                'image' => $photo->image_path,
                'alt' => $photo->image_alt ?: $photo->title,
                'featured' => (bool) $photo->is_featured,
            ];
        });

        return Inertia::render('gallery/index', [
            'canonicalUrl' => route('gallery.index'),
            'dbPhotos' => $dbPhotos,
        ]);
    }
}
