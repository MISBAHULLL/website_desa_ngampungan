<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('gallery/index', [
            'canonicalUrl' => route('gallery.index'),
        ]);
    }
}
