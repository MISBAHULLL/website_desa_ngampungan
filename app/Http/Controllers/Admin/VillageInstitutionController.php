<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VillageInstitution;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'description' => ['nullable', 'string', 'max:3000'],
            'responsibilities' => ['nullable', 'array'],
            'responsibilities.*' => ['nullable', 'string', 'max:500'],
            'members' => ['nullable', 'array'],
            'members.*.name' => ['required_with:members', 'string', 'max:255'],
            'members.*.role' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('village-institutions/logos', 'public');
        }

        $formattedMembers = array_values(array_filter(
            $validated['members'] ?? [],
            fn ($member) => ! empty($member['name'])
        ));

        VillageInstitution::create([
            'acronym' => mb_strtoupper($validated['acronym']),
            'logo_path' => $logoPath,
            'name' => $validated['name'],
            'leader' => $validated['leader'] ?? null,
            'member_count' => $validated['member_count'],
            'focus' => $validated['focus'],
            'description' => $validated['description'] ?? null,
            'responsibilities' => array_values(array_filter($validated['responsibilities'] ?? [])),
            'members' => $formattedMembers,
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
            'description' => ['nullable', 'string', 'max:3000'],
            'responsibilities' => ['nullable', 'array'],
            'responsibilities.*' => ['nullable', 'string', 'max:500'],
            'members' => ['nullable', 'array'],
            'members.*.name' => ['required_with:members', 'string', 'max:255'],
            'members.*.role' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'remove_logo' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $logoPath = $villageInstitution->logo_path;

        if ($request->boolean('remove_logo') && $logoPath) {
            Storage::disk('public')->delete($logoPath);
            $logoPath = null;
        }

        if ($request->hasFile('logo')) {
            if ($logoPath) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('village-institutions/logos', 'public');
        }

        $formattedMembers = array_values(array_filter(
            $validated['members'] ?? [],
            fn ($member) => ! empty($member['name'])
        ));

        $villageInstitution->update([
            'acronym' => mb_strtoupper($validated['acronym']),
            'logo_path' => $logoPath,
            'name' => $validated['name'],
            'leader' => $validated['leader'] ?? null,
            'member_count' => $validated['member_count'],
            'focus' => $validated['focus'],
            'description' => $validated['description'] ?? null,
            'responsibilities' => array_values(array_filter($validated['responsibilities'] ?? [])),
            'members' => $formattedMembers,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.village-institutions.index')
            ->with('success', 'Data lembaga desa berhasil diperbarui.');
    }

    public function destroy(VillageInstitution $villageInstitution): RedirectResponse
    {
        if ($villageInstitution->logo_path) {
            Storage::disk('public')->delete($villageInstitution->logo_path);
        }

        $villageInstitution->delete();

        return redirect()->route('admin.village-institutions.index')
            ->with('success', 'Lembaga desa berhasil dihapus.');
    }
}
