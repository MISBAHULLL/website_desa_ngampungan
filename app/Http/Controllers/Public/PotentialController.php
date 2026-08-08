<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\VillagePotential;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        $potentials = VillagePotential::with('offerings')
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->map(function ($potential) {
                $imageUrl = null;
                if ($potential->image_path) {
                    if (str_starts_with($potential->image_path, 'http')) {
                        $imageUrl = $potential->image_path;
                    } else {
                        $imageUrl = Storage::disk('public')->url($potential->image_path);
                    }
                }

                return [
                    'slug' => $potential->slug,
                    'category' => $potential->category,
                    'name' => $potential->name,
                    'image' => $imageUrl,
                    'imageAlt' => $potential->image_alt ?: $potential->name,
                    'shortDescription' => $potential->short_description,
                    'description' => $potential->description,
                    'managerLabel' => $potential->manager_label,
                    'managerName' => $potential->manager_name,
                    'address' => $potential->address,
                    'phone' => $potential->phone,
                    'phoneLabel' => $potential->phone_label ?: $potential->phone,
                    'openingHours' => $potential->opening_hours,
                    'tags' => $potential->tags,
                    'offerings' => $potential->offerings->map(function ($offering) {
                        $offeringImageUrl = null;
                        if ($offering->image_path) {
                            if (str_starts_with($offering->image_path, 'http')) {
                                $offeringImageUrl = $offering->image_path;
                            } else {
                                $offeringImageUrl = Storage::disk('public')->url($offering->image_path);
                            }
                        }

                        return [
                            'name' => $offering->name,
                            'description' => $offering->description,
                            'image' => $offeringImageUrl,
                            'imageAlt' => $offering->name,
                        ];
                    }),
                    'map' => [
                        'latitude' => $potential->latitude,
                        'longitude' => $potential->longitude,
                        'locationLabel' => $potential->location_label,
                    ],
                ];
            });

        return Inertia::render('potentials/index', [
            'initialCategory' => in_array($requestedCategory, $availableCategories, true)
                ? $requestedCategory
                : 'all',
            'dbPotentials' => $potentials,
        ]);
    }
}
