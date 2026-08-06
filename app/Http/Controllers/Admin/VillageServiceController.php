<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVillageServiceRequest;
use App\Http\Requests\Admin\UpdateVillageServiceRequest;
use App\Models\VillageService;
use App\Models\VillageServiceDocumentRequirement;
use App\Models\VillageServiceRequirement;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VillageServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim($request->string('search')->toString());
        $category = $request->string('category')->toString();

        $services = VillageService::query()
            ->withCount(['requirements', 'documentRequirements'])
            ->when(
                $search !== '',
                fn (Builder $query): Builder => $query->where(
                    fn (Builder $searchQuery): Builder => $searchQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%"),
                ),
            )
            ->when(
                $category !== '' && $category !== 'all',
                fn (Builder $query): Builder => $query->where('category', $category),
            )
            ->ordered()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (VillageService $service): array => [
                'id' => $service->id,
                'slug' => $service->slug,
                'title' => $service->title,
                'shortDescription' => $service->short_description,
                'category' => $service->category,
                'audience' => $service->audience,
                'estimatedDuration' => $service->estimated_duration,
                'isActive' => $service->is_active,
                'requirementsCount' => $service->requirements_count,
                'documentRequirementsCount' => $service->document_requirements_count,
                'createdAt' => $service->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/village-services/index', [
            'services' => $services,
            'filters' => [
                'search' => $search,
                'category' => $category ?: 'all',
            ],
            'statistics' => [
                'total' => VillageService::query()->count(),
                'active' => VillageService::query()->where('is_active', true)->count(),
                'inactive' => VillageService::query()->where('is_active', false)->count(),
                'administration' => VillageService::query()->where('category', 'administration')->count(),
                'population' => VillageService::query()->where('category', 'population')->count(),
                'agriculture' => VillageService::query()->where('category', 'agriculture')->count(),
                'reports' => VillageService::query()->where('category', 'reports')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/village-services/create', [
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function store(StoreVillageServiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $service = VillageService::create([
            'slug' => VillageService::generateUniqueSlug($validated['title']),
            'title' => $validated['title'],
            'short_description' => $validated['short_description'],
            'category' => $validated['category'],
            'audience' => $validated['audience'],
            'channel' => $validated['channel'],
            'estimated_duration' => $validated['estimated_duration'],
            'fee' => $validated['fee'] ?? 'Gratis',
            'service_contact' => $validated['service_contact'] ?? null,
            'service_hours' => $validated['service_hours'] ?? null,
            'notes' => ! empty($validated['notes']) ? array_values(array_filter($validated['notes'])) : null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $this->syncRequirements($service, $validated['requirements'] ?? []);
        $this->syncDocumentRequirements($service, $validated['documents'] ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Layanan berhasil ditambahkan.',
        ]);

        return redirect()->route('admin.village-services.index');
    }

    public function edit(VillageService $villageService): Response
    {
        $villageService->load(['requirements', 'documentRequirements']);

        return Inertia::render('admin/village-services/edit', [
            'service' => [
                'id' => $villageService->id,
                'slug' => $villageService->slug,
                'title' => $villageService->title,
                'shortDescription' => $villageService->short_description,
                'category' => $villageService->category,
                'audience' => $villageService->audience,
                'channel' => $villageService->channel,
                'estimatedDuration' => $villageService->estimated_duration,
                'fee' => $villageService->fee,
                'serviceContact' => $villageService->service_contact,
                'serviceHours' => $villageService->service_hours,
                'notes' => $villageService->notes ?? [],
                'isActive' => $villageService->is_active,
                'requirements' => $villageService->requirements
                    ->map(fn (VillageServiceRequirement $requirement): array => [
                        'id' => $requirement->id,
                        'description' => $requirement->description,
                    ])
                    ->values(),
                'documents' => $villageService->documentRequirements
                    ->map(fn (VillageServiceDocumentRequirement $doc): array => [
                        'id' => $doc->id,
                        'key' => $doc->key,
                        'label' => $doc->label,
                        'description' => $doc->description,
                        'isRequired' => $doc->is_required,
                        'acceptedFormats' => $doc->accepted_formats,
                    ])
                    ->values(),
            ],
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function update(UpdateVillageServiceRequest $request, VillageService $villageService): RedirectResponse
    {
        $validated = $request->validated();

        $slug = $villageService->title !== $validated['title']
            ? VillageService::generateUniqueSlug($validated['title'], $villageService->id)
            : $villageService->slug;

        $villageService->update([
            'slug' => $slug,
            'title' => $validated['title'],
            'short_description' => $validated['short_description'],
            'category' => $validated['category'],
            'audience' => $validated['audience'],
            'channel' => $validated['channel'],
            'estimated_duration' => $validated['estimated_duration'],
            'fee' => $validated['fee'] ?? 'Gratis',
            'service_contact' => $validated['service_contact'] ?? null,
            'service_hours' => $validated['service_hours'] ?? null,
            'notes' => ! empty($validated['notes']) ? array_values(array_filter($validated['notes'])) : null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $this->syncRequirements($villageService, $validated['requirements'] ?? []);
        $this->syncDocumentRequirements($villageService, $validated['documents'] ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Layanan berhasil diperbarui.',
        ]);

        return redirect()->route('admin.village-services.index');
    }

    public function destroy(VillageService $villageService): RedirectResponse
    {
        $villageService->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Layanan berhasil dihapus.',
        ]);

        return redirect()->route('admin.village-services.index');
    }

    public function toggleActive(VillageService $villageService): RedirectResponse
    {
        $villageService->update([
            'is_active' => ! $villageService->is_active,
        ]);

        $status = $villageService->is_active ? 'diaktifkan' : 'dinonaktifkan';

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Layanan berhasil {$status}.",
        ]);

        return back();
    }

    /**
     * @param  list<array{description: string}>  $requirements
     */
    private function syncRequirements(VillageService $service, array $requirements): void
    {
        $service->requirements()->delete();

        foreach ($requirements as $index => $requirement) {
            $description = trim($requirement['description'] ?? '');

            if ($description === '') {
                continue;
            }

            VillageServiceRequirement::create([
                'village_service_id' => $service->id,
                'description' => $description,
                'sort_order' => $index,
            ]);
        }
    }

    /**
     * @param  list<array{key: string, label: string, description?: string|null, is_required: bool, accepted_formats?: string|null}>  $documents
     */
    private function syncDocumentRequirements(VillageService $service, array $documents): void
    {
        $service->documentRequirements()->delete();

        foreach ($documents as $index => $document) {
            VillageServiceDocumentRequirement::create([
                'village_service_id' => $service->id,
                'key' => $document['key'],
                'label' => $document['label'],
                'description' => $document['description'] ?? null,
                'is_required' => $document['is_required'],
                'accepted_formats' => $document['accepted_formats'] ?? '.pdf,.jpg,.jpeg,.png',
                'sort_order' => $index,
            ]);
        }
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function categoryOptions(): array
    {
        return [
            ['value' => 'administration', 'label' => 'Administrasi dan Surat'],
            ['value' => 'population', 'label' => 'Kependudukan'],
            ['value' => 'agriculture', 'label' => 'Pertanian'],
            ['value' => 'reports', 'label' => 'Pengaduan dan Darurat'],
        ];
    }
}
