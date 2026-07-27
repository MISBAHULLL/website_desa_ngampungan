<?php

namespace App\Http\Controllers\Public;

use App\Actions\CreateServiceApplicationAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceApplicationRequest;
use App\Support\VillageServiceCatalog;
use Illuminate\Http\RedirectResponse;

class ServiceApplicationController extends Controller
{
    public function __invoke(
        StoreServiceApplicationRequest $request,
        CreateServiceApplicationAction $createServiceApplication,
        VillageServiceCatalog $serviceCatalog,
    ): RedirectResponse {
        $serviceSlug = (string) $request->route('slug');

        abort_unless($serviceCatalog->exists($serviceSlug), 404);

        $serviceApplication = $createServiceApplication->handle(
            $serviceSlug,
            $request->applicationData($serviceCatalog),
            $request->ip(),
            $request->userAgent(),
        );

        return redirect()
            ->route('services.show', $serviceSlug)
            ->with('serviceApplicationSuccess', [
                'referenceNumber' => $serviceApplication->reference_number,
                'serviceTitle' => $serviceApplication->service_title,
                'submittedAt' => $serviceApplication->submitted_at
                    ->timezone('Asia/Jakarta')
                    ->format('d M Y, H.i'),
            ]);
    }
}
