<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VillageOfficial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VillageOfficialController extends Controller
{
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

        // Transform photo_path to photo_url for each official
        $officials->through(function (VillageOfficial $official) {
            $official->setAttribute('photo_url', $official->photo_url);

            return $official;
        });

        // Get all officials for parent dropdown
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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'initials' => ['required', 'string', 'max:5'],
            'position' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:255'],
            'group' => ['required', 'string', 'in:leadership,secretariat,technical,territorial'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'term' => ['nullable', 'string', 'max:100'],
            'employee_id' => ['nullable', 'string', 'max:50'],
            'summary' => ['required', 'string', 'max:1000'],
            'about' => ['nullable', 'string', 'max:2000'],
            'responsibilities' => ['nullable', 'array'],
            'responsibilities.*' => ['nullable', 'string', 'max:500'],
            'service_focus' => ['nullable', 'array'],
            'service_focus.*' => ['nullable', 'string', 'max:100'],
            'education' => ['nullable', 'array'],
            'education.*' => ['nullable', 'string', 'max:300'],
            'career' => ['nullable', 'array'],
            'career.*.period' => ['nullable', 'string', 'max:100'],
            'career.*.role' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'parent_id' => ['nullable', 'integer', 'exists:village_officials,id'],
            'is_active' => ['boolean'],
        ]);

        $slug = VillageOfficial::generateUniqueSlug($validated['name']);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('village-officials', 'public');
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
        $villageOfficial->setAttribute('photo_url', $villageOfficial->photo_url);

        $parentOptions = VillageOfficial::active()
            ->where('id', '!=', $villageOfficial->id)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'position']);

        return Inertia::render('admin/village-officials/edit', [
            'official' => $villageOfficial,
            'parentOptions' => $parentOptions,
        ]);
    }

    public function update(Request $request, VillageOfficial $villageOfficial): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'initials' => ['required', 'string', 'max:5'],
            'position' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:255'],
            'group' => ['required', 'string', 'in:leadership,secretariat,technical,territorial'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'remove_photo' => ['nullable', 'boolean'],
            'term' => ['nullable', 'string', 'max:100'],
            'employee_id' => ['nullable', 'string', 'max:50'],
            'summary' => ['required', 'string', 'max:1000'],
            'about' => ['nullable', 'string', 'max:2000'],
            'responsibilities' => ['nullable', 'array'],
            'responsibilities.*' => ['nullable', 'string', 'max:500'],
            'service_focus' => ['nullable', 'array'],
            'service_focus.*' => ['nullable', 'string', 'max:100'],
            'education' => ['nullable', 'array'],
            'education.*' => ['nullable', 'string', 'max:300'],
            'career' => ['nullable', 'array'],
            'career.*.period' => ['nullable', 'string', 'max:100'],
            'career.*.role' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'parent_id' => ['nullable', 'integer', 'exists:village_officials,id'],
            'is_active' => ['boolean'],
        ]);

        $slug = $villageOfficial->name !== $validated['name']
            ? VillageOfficial::generateUniqueSlug($validated['name'], $villageOfficial->id)
            : $villageOfficial->slug;

        // Handle photo
        $photoPath = $villageOfficial->photo_path;

        if (! empty($validated['remove_photo']) && $photoPath) {
            Storage::disk('public')->delete($photoPath);
            $photoPath = null;
        }

        if ($request->hasFile('photo')) {
            if ($villageOfficial->photo_path) {
                Storage::disk('public')->delete($villageOfficial->photo_path);
            }
            $photoPath = $request->file('photo')->store('village-officials', 'public');
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

        return redirect()->route('admin.village-officials.index')
            ->with('success', 'Data perangkat desa berhasil diperbarui.');
    }

    public function destroy(VillageOfficial $villageOfficial): RedirectResponse
    {
        if ($villageOfficial->photo_path) {
            Storage::disk('public')->delete($villageOfficial->photo_path);
        }

        $villageOfficial->delete();

        return redirect()->route('admin.village-officials.index')
            ->with('success', 'Perangkat desa berhasil dihapus.');
    }
}
