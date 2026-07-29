<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PotentialController extends Controller
{
    /**
     * Display the public village potential directory.
     */
    public function index(Request $request): Response
    {
        $requestedCategory = $request->string('category')->toString();
        $availableCategories = [
            'umkm',
            'agriculture',
            'tourism',
            'culture',
            'culinary',
            'services',
        ];

        return Inertia::render('potentials/index', [
            'initialCategory' => in_array($requestedCategory, $availableCategories, true)
                ? $requestedCategory
                : 'all',
        ]);
    }
}
