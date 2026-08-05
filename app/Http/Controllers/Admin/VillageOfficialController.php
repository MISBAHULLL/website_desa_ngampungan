<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVillageOfficialRequest;
use App\Http\Requests\Admin\UpdateVillageOfficialRequest;
use App\Models\VillageOfficial;
use App\Support\PublicImageStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VillageOfficialController extends Controller
{
    public function __construct(private readonly PublicImageStorage $imageStorage) {}

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $group = $request->input('group');

        $query = VillageOfficial::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%");
            });
        }

        if ($group && in_array($group, ['leadership', 'secretariat', 'technical', 'territorial'])) {
            $query->where('group', $group);
        }

        $officials = $query->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $parentOptions = VillageOfficial::active()
            ->orderBy('sort_order')
            ->get(['id', 'name', 'position']);

        return Inertia::render('admin/village-officials/index', [
            'officials' => $officials,
            'parentOptions' => $parentOptions,
            'filters' => [
                'search' => $search ?? '',
                'group' => $group ?? 'all',
            ],
        ]);
    }

    public function create(): Response
    {
        $parentOptions = VillageOfficial::active()
            ->orderBy('sort_order')
            ->get(['id', 'name', 'position']);

        return Inertia::render('admin/village-officials/create', [
            'parentOptions' => $parentOptions,
        ]);
    }

    public function store(StoreVillageOfficialRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $slug = VillageOfficial::generateUniqueSlug($validated['name']);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $this->imageStorage->storePath(
                $request->file('photo'),
                'village-officials',
            );
        }

        VillageOfficial::create([
            'slug' => $slug,
            'name' => $validated['name'],
            'initials' => $validated['initials'],
            'position' => $validated['position'],
            'unit' => $validated['unit'],
            'group' => $validated['group'],
            'photo_path' => $photoPath,
            'term' => $validated['term'] ?? null,
            'employee_id' => $validated['employee_id'] ?? null,
            'summary' => $validated['summary'],
            'about' => $validated['about'] ?? null,
            'responsibilities' => array_values(array_filter($validated['responsibilities'] ?? [])),
            'service_focus' => array_values(array_filter($validated['service_focus'] ?? [])),
            'education' => array_values(array_filter($validated['education'] ?? [])),
            'career' => array_values(array_filter($validated['career'] ?? [], fn ($c) => ! empty($c['role']))),
            'sort_order' => $validated['sort_order'] ?? 0,
            'parent_id' => $validated['parent_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.village-officials.index')
            ->with('success', 'Perangkat desa berhasil ditambahkan.');
    }

    public function edit(VillageOfficial $villageOfficial): Response
    {
        $parentOptions = VillageOfficial::active()
            ->where('id', '!=', $villageOfficial->id)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'position']);

        return Inertia::render('admin/village-officials/edit', [
            'official' => $villageOfficial,
            'parentOptions' => $parentOptions,
        ]);
    }

    public function update(UpdateVillageOfficialRequest $request, VillageOfficial $villageOfficial): RedirectResponse
    {
        $validated = $request->validated();

        $slug = $villageOfficial->name !== $validated['name']
            ? VillageOfficial::generateUniqueSlug($validated['name'], $villageOfficial->id)
            : $villageOfficial->slug;

        $previousPhotoPath = $villageOfficial->photo_path;
        $photoPath = ! empty($validated['remove_photo']) ? null : $previousPhotoPath;

        if ($request->hasFile('photo')) {
            $photoPath = $this->imageStorage->storePath(
                $request->file('photo'),
                'village-officials',
            );
        }

        $villageOfficial->update([
            'slug' => $slug,
            'name' => $validated['name'],
            'initials' => $validated['initials'],
            'position' => $validated['position'],
            'unit' => $validated['unit'],
            'group' => $validated['group'],
            'photo_path' => $photoPath,
            'term' => $validated['term'] ?? null,
            'employee_id' => $validated['employee_id'] ?? null,
            'summary' => $validated['summary'],
            'about' => $validated['about'] ?? null,
            'responsibilities' => array_values(array_filter($validated['responsibilities'] ?? [])),
            'service_focus' => array_values(array_filter($validated['service_focus'] ?? [])),
            'education' => array_values(array_filter($validated['education'] ?? [])),
            'career' => array_values(array_filter($validated['career'] ?? [], fn ($c) => ! empty($c['role']))),
            'sort_order' => $validated['sort_order'] ?? 0,
            'parent_id' => $validated['parent_id'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if ($previousPhotoPath !== $photoPath) {
            $this->imageStorage->deletePath($previousPhotoPath);
        }

        return redirect()->route('admin.village-officials.index')
            ->with('success', 'Data perangkat desa berhasil diperbarui.');
    }

    public function destroy(VillageOfficial $villageOfficial): RedirectResponse
    {
        if ($villageOfficial->photo_path) {
            $this->imageStorage->deletePath($villageOfficial->photo_path);
        }

        $villageOfficial->delete();

        return redirect()->route('admin.village-officials.index')
            ->with('success', 'Perangkat desa berhasil dihapus.');
    }
}
