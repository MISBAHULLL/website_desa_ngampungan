<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVillagePotentialRequest;
use App\Http\Requests\UpdateVillagePotentialRequest;
use App\Models\VillagePotential;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VillagePotentialController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $potentials = VillagePotential::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('manager_name', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->when($category && $category !== 'all', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->orderBy('category')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/potentials/index', [
            'potentials' => $potentials,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'all',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/potentials/create');
    }

    public function store(StoreVillagePotentialRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $data = $validated;
        $data['slug'] = Str::slug($validated['name']).'-'.strtolower(Str::random(5));

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('potentials', 'public');
        }

        $potential = VillagePotential::create($data);

        if (isset($validated['offerings']) && is_array($validated['offerings'])) {
            foreach ($validated['offerings'] as $index => $offering) {
                $imagePath = null;
                if ($request->hasFile("offerings.{$index}.image")) {
                    $imagePath = $request->file("offerings.{$index}.image")->store('potentials/offerings', 'public');
                }

                $potential->offerings()->create([
                    'name' => $offering['name'],
                    'description' => $offering['description'],
                    'image_path' => $imagePath,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.potentials.index')
            ->with('success', 'Potensi desa berhasil ditambahkan.');
    }

    public function edit(VillagePotential $potential): Response
    {
        $potential->load('offerings');

        return Inertia::render('admin/potentials/edit', [
            'potential' => $potential,
        ]);
    }

    public function update(UpdateVillagePotentialRequest $request, VillagePotential $potential): RedirectResponse
    {
        $validated = $request->validated();

        $data = $validated;

        if ($request->hasFile('image')) {
            if ($potential->image_path) {
                Storage::disk('public')->delete($potential->image_path);
            }
            $data['image_path'] = $request->file('image')->store('potentials', 'public');
        }

        $potential->update($data);

        // Sync offerings
        $potential->offerings()->delete();
        if (isset($validated['offerings']) && is_array($validated['offerings'])) {
            foreach ($validated['offerings'] as $index => $offering) {
                $imagePath = $offering['image_path'] ?? null;
                if ($request->hasFile("offerings.{$index}.image")) {
                    if ($imagePath) {
                        Storage::disk('public')->delete($imagePath);
                    }
                    $imagePath = $request->file("offerings.{$index}.image")->store('potentials/offerings', 'public');
                }

                $potential->offerings()->create([
                    'name' => $offering['name'],
                    'description' => $offering['description'],
                    'image_path' => $imagePath,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.potentials.index')
            ->with('success', 'Data potensi desa berhasil diperbarui.');
    }

    public function destroy(VillagePotential $potential): RedirectResponse
    {
        if ($potential->image_path) {
            Storage::disk('public')->delete($potential->image_path);
        }

        $potential->delete();

        return redirect()->route('admin.potentials.index')
            ->with('success', 'Potensi desa berhasil dihapus.');
    }
}
