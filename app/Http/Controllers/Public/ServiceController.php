<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $requestedCategory = $request->string('category')->toString();
        $availableCategories = [
            'administration',
            'population',
            'agriculture',
            'reports',
        ];

        return Inertia::render('services/index', [
            'initialCategory' => in_array(
                $requestedCategory,
                $availableCategories,
                true,
            )
                ? $requestedCategory
                : 'all',
            'canonicalUrl' => route('services.index'),
        ]);
    }

    public function show(string $slug): Response
    {
        return Inertia::render('services/show', [
            'slug' => $slug,
            'canonicalUrl' => route('services.show', $slug),
        ]);
    }
}
