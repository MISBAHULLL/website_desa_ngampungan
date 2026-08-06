<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\VillageInstitution;
use App\Models\VillageLeader;
use App\Models\VillageOfficial;
use Inertia\Inertia;
use Inertia\Response;

class VillageGovernmentController extends Controller
{
    public function index(): Response
    {
        $officials = VillageOfficial::active()
            ->orderBy('sort_order')
            ->get();

        $officials->each(function (VillageOfficial $official) {
            $official->setAttribute('photo_url', $official->photo_url);
        });

        // Transform collection to array/tree structure
        $orgTree = VillageOfficial::buildTree($officials);

        // Group officials for standard presentation cards
        $leadership = $officials->where('group', 'leadership')->values();
        $secretariat = $officials->where('group', 'secretariat')->values();
        $technical = $officials->where('group', 'technical')->values();
        $territorial = $officials->where('group', 'territorial')->values();

        $institutions = VillageInstitution::active()
            ->ordered()
            ->get();
        $villageLeader = VillageLeader::query()
            ->active()
            ->latest('started_at')
            ->first();

        return Inertia::render('government/index', [
            'canonicalUrl' => route('government.index'),
            'officials' => [
                'all' => $officials,
                'leadership' => $leadership,
                'secretariat' => $secretariat,
                'technical' => $technical,
                'territorial' => $territorial,
                'orgTree' => $orgTree,
            ],
            'institutions' => $institutions,
            'villageLeader' => $villageLeader?->toPublicData(),
        ]);
    }

    public function show(string $slug): Response
    {
        $official = VillageOfficial::active()
            ->where('slug', $slug)
            ->firstOrFail();

        $official->setAttribute('photo_url', $official->photo_url);

        return Inertia::render('government/show', [
            'official' => $official,
            'canonicalUrl' => route('government.officials.show', $slug),
        ]);
    }
}
