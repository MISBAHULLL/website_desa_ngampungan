<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOrganizationBranchRequest;
use App\Http\Requests\Admin\UpdateOrganizationStructureRequest;
use App\Models\VillageOfficial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
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

    public function storeBranch(StoreOrganizationBranchRequest $request): RedirectResponse
    {
        $member = VillageOfficial::query()->findOrFail($request->integer('member_id'));
        $parent = VillageOfficial::query()->findOrFail($request->integer('parent_id'));

        $nextSortOrder = (int) VillageOfficial::query()
            ->where('parent_id', $parent->id)
            ->whereKeyNot($member->id)
            ->max('sort_order') + 1;

        $member->update([
            'parent_id' => $parent->id,
            'sort_order' => $nextSortOrder,
        ]);

        return back()->with(
            'success',
            "Cabang {$parent->position} ke {$member->position} berhasil disimpan.",
        );
    }

    public function destroyBranch(VillageOfficial $villageOfficial): RedirectResponse
    {
        if ($villageOfficial->parent_id === null) {
            return back()->with('success', 'Perangkat tersebut sudah berada di tingkat utama.');
        }

        $villageOfficial->update([
            'parent_id' => null,
            'sort_order' => (int) VillageOfficial::query()
                ->whereNull('parent_id')
                ->whereKeyNot($villageOfficial->id)
                ->max('sort_order') + 1,
        ]);

        return back()->with(
            'success',
            "Cabang menuju {$villageOfficial->position} telah dilepas tanpa menghapus data perangkat.",
        );
    }

    public function updateStructure(UpdateOrganizationStructureRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated): void {
            foreach ($validated['updates'] as $update) {
                VillageOfficial::query()->whereKey($update['id'])->update([
                    'parent_id' => $update['parent_id'],
                    'sort_order' => $update['sort_order'],
                ]);
            }
        });

        return back()
            ->with('success', 'Struktur organisasi berhasil diperbarui.');
    }
}
