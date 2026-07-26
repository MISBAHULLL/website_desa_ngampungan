<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    /**
     * Display the public news index.
     */
    public function index(): Response
    {
        return Inertia::render('news/index');
    }

    /**
     * Display a dummy public news article by slug.
     */
    public function show(string $slug): Response
    {
        return Inertia::render('news/show', [
            'slug' => $slug,
        ]);
    }
}
