<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VillageInstitution;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VillageInstitutionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = VillageInstitution::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('acronym', 'like', "%{$search}%")
                    ->orWhere('leader', 'like', "%{$search}%");
            });
        }

        $institutions = $query->orderBy('sort_order')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/village-institutions/index', [
            'institutions' => $institutions,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/village-institutions/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'acronym' => ['required', 'string', 'max:10'],
            'name' => ['required', 'string', 'max:255'],
            'leader' => ['nullable', 'string', 'max:255'],
            'member_count' => ['required', 'integer', 'min:0'],
            'focus' => ['required', 'string', 'max:1000'],
            'responsibilities' => ['nullable', 'array'],
            'responsibilities.*' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        VillageInstitution::create([
            'acronym' => mb_strtoupper($validated['acronym']),
            'name' => $validated['name'],
            'leader' => $validated['leader'] ?? null,
            'member_count' => $validated['member_count'],
            'focus' => $validated['focus'],
            'responsibilities' => array_values(array_filter($validated['responsibilities'] ?? [])),
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.village-institutions.index')
            ->with('success', 'Lembaga desa berhasil ditambahkan.');
    }

    public function edit(VillageInstitution $villageInstitution): Response
    {
        return Inertia::render('admin/village-institutions/edit', [
            'institution' => $villageInstitution,
        ]);
    }

    public function update(Request $request, VillageInstitution $villageInstitution): RedirectResponse
    {
        $validated = $request->validate([
            'acronym' => ['required', 'string', 'max:10'],
            'name' => ['required', 'string', 'max:255'],
            'leader' => ['nullable', 'string', 'max:255'],
            'member_count' => ['required', 'integer', 'min:0'],
            'focus' => ['required', 'string', 'max:1000'],
            'responsibilities' => ['nullable', 'array'],
            'responsibilities.*' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $villageInstitution->update([
            'acronym' => mb_strtoupper($validated['acronym']),
            'name' => $validated['name'],
            'leader' => $validated['leader'] ?? null,
            'member_count' => $validated['member_count'],
            'focus' => $validated['focus'],
            'responsibilities' => array_values(array_filter($validated['responsibilities'] ?? [])),
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.village-institutions.index')
            ->with('success', 'Data lembaga desa berhasil diperbarui.');
    }

    public function destroy(VillageInstitution $villageInstitution): RedirectResponse
    {
        $villageInstitution->delete();

        return redirect()->route('admin.village-institutions.index')
            ->with('success', 'Lembaga desa berhasil dihapus.');
    }
}
