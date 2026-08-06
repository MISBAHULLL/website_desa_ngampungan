<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\VillageService;
use App\Models\VillageServiceDocumentRequirement;
use App\Models\VillageServiceRequirement;
use App\Support\VillageServiceCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(
        private VillageServiceCatalog $serviceCatalog,
    ) {}

    public function index(Request $request): Response
    {
        $requestedCategory = $request->string('category')->toString();
        $availableCategories = [
            'administration',
            'population',
            'agriculture',
            'reports',
        ];

        $services = VillageService::query()
            ->active()
            ->ordered()
            ->with(['requirements', 'documentRequirements'])
            ->get()
            ->map(fn (VillageService $service): array => [
                'slug' => $service->slug,
                'title' => $service->title,
                'shortDescription' => $service->short_description,
                'category' => $service->category,
                'audience' => $service->audience,
                'channel' => $service->channel,
                'estimatedDuration' => $service->estimated_duration,
                'fee' => $service->fee,
                'requirementsCount' => $service->requirements->count(),
                'documentRequirementsCount' => $service->documentRequirements->count(),
            ]);

        return Inertia::render('services/index', [
            'services' => $services,
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

    public function show(string $slug): Response|RedirectResponse
    {
        $service = VillageService::query()
            ->where('slug', $slug)
            ->with(['requirements', 'documentRequirements'])
            ->first();

        if ($service === null) {
            return redirect()->route('services.index');
        }

        $serviceData = [
            'slug' => $service->slug,
            'title' => $service->title,
            'shortDescription' => $service->short_description,
            'category' => $service->category,
            'audience' => $service->audience,
            'channel' => $service->channel,
            'estimatedDuration' => $service->estimated_duration,
            'fee' => $service->fee,
            'serviceContact' => $service->service_contact,
            'serviceHours' => $service->service_hours,
            'notes' => $service->notes ?? [],
        ];

        $requirements = $service->requirements
            ->map(fn (VillageServiceRequirement $r): string => $r->description)
            ->values()
            ->all();

        $requiredDocuments = $service->documentRequirements
            ->map(fn (VillageServiceDocumentRequirement $d): array => [
                'key' => $d->key,
                'label' => $d->label,
                'description' => $d->description,
                'required' => $d->is_required,
                'acceptedFormats' => $d->accepted_formats,
            ])
            ->values()
            ->all();

        return Inertia::render('services/show', [
            'slug' => $slug,
            'service' => $serviceData,
            'requirements' => $requirements,
            'requiredDocuments' => $requiredDocuments,
            'canonicalUrl' => route('services.show', $slug),
            'serviceApplicationSuccess' => session(
                'serviceApplicationSuccess',
            ),
        ]);
    }
}
