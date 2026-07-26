<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class VillageGovernmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('government/index', [
            'canonicalUrl' => route('government.index'),
        ]);
    }

    public function show(string $slug): Response
    {
        return Inertia::render('government/show', [
            'slug' => $slug,
            'canonicalUrl' => route('government.officials.show', $slug),
        ]);
    }
}
