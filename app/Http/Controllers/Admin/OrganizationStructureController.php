<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VillageOfficial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationStructureController extends Controller
{
    public function index(): Response
    {
        $officials = VillageOfficial::active()
            ->orderBy('sort_order')
            ->get();

        $officials->each(function (VillageOfficial $official) {
            $official->setAttribute('photo_url', $official->photo_url);
        });

        $tree = VillageOfficial::buildTree($officials);

        return Inertia::render('admin/organization-structure/index', [
            'officials' => $officials,
            'tree' => $tree,
        ]);
    }

    public function updateStructure(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'updates' => ['required', 'array'],
            'updates.*.id' => ['required', 'integer', 'exists:village_officials,id'],
            'updates.*.parent_id' => ['nullable', 'integer', 'exists:village_officials,id'],
            'updates.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['updates'] as $update) {
            VillageOfficial::where('id', $update['id'])->update([
                'parent_id' => $update['parent_id'],
                'sort_order' => $update['sort_order'],
            ]);
        }

        return redirect()->back()
            ->with('success', 'Struktur organisasi berhasil diperbarui.');
    }
}
