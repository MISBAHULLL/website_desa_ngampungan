<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\VillageProfile;
use Inertia\Inertia;
use Inertia\Response;

class VillageProfileController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('profile/index', [
            'canonicalUrl' => route('profile.index'),
            'villageProfile' => VillageProfile::first(),
        ]);
    }
}
