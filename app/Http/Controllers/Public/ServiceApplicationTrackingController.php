<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\TrackServiceApplicationRequest;
use App\Models\ServiceApplication;
use App\Models\ServiceApplicationStatusHistory;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ServiceApplicationTrackingController extends Controller
{
    public function __invoke(TrackServiceApplicationRequest $request): Response
    {
        $referenceNumber = $request->has('reference')
            ? (string) $request->validated('reference')
            : '';
        $serviceApplication = $referenceNumber !== ''
            ? $this->findApplication($referenceNumber)
            : null;

        return Inertia::render('service-applications/track', [
            'referenceNumber' => $referenceNumber,
            'lookupAttempted' => $referenceNumber !== '',
            'application' => $serviceApplication === null
                ? null
                : $this->publicApplicationData($serviceApplication),
            'canonicalUrl' => route('service-applications.track'),
        ]);
    }

    private function findApplication(string $referenceNumber): ?ServiceApplication
    {
        return ServiceApplication::query()
            ->select([
                'id',
                'reference_number',
                'service_title',
                'status',
                'public_notes',
                'submitted_at',
                'reviewed_at',
            ])
            ->with([
                'statusHistories:id,service_application_id,status,public_notes,created_at',
            ])
            ->where('reference_number', $referenceNumber)
            ->first();
    }

    /**
     * @return array{
     *     referenceNumber: string,
     *     serviceTitle: string,
     *     status: string,
     *     statusLabel: string,
     *     statusDescription: string,
     *     publicNotes: string|null,
     *     submittedAt: string,
     *     updatedAt: string,
     *     timeline: list<array{
     *         status: string,
     *         statusLabel: string,
     *         description: string,
     *         publicNotes: string|null,
     *         occurredAt: string
     *     }>
     * }
     */
    private function publicApplicationData(
        ServiceApplication $serviceApplication,
    ): array {
        return [
            'referenceNumber' => $serviceApplication->reference_number,
            'serviceTitle' => $serviceApplication->service_title,
            'status' => $serviceApplication->status->value,
            'statusLabel' => $serviceApplication->status->label(),
            'statusDescription' => $serviceApplication->status->publicDescription(),
            'publicNotes' => $serviceApplication->public_notes,
            'submittedAt' => $serviceApplication->submitted_at->toIso8601String(),
            'updatedAt' => (
                $serviceApplication->reviewed_at
                    ?? $serviceApplication->submitted_at
            )->toIso8601String(),
            'timeline' => $this->publicTimeline($serviceApplication),
        ];
    }

    /**
     * @return list<array{
     *     status: string,
     *     statusLabel: string,
     *     description: string,
     *     publicNotes: string|null,
     *     occurredAt: string
     * }>
     */
    private function publicTimeline(
        ServiceApplication $serviceApplication,
    ): array {
        /** @var Collection<int, ServiceApplicationStatusHistory> $history */
        $history = $serviceApplication->statusHistories;

        if ($history->isEmpty()) {
            return [[
                'status' => $serviceApplication->status->value,
                'statusLabel' => $serviceApplication->status->label(),
                'description' => $serviceApplication->status->publicDescription(),
                'publicNotes' => $serviceApplication->public_notes,
                'occurredAt' => $serviceApplication->submitted_at->toIso8601String(),
            ]];
        }

        return array_values(
            $history
                ->map(fn (ServiceApplicationStatusHistory $statusHistory): array => [
                    'status' => $statusHistory->status->value,
                    'statusLabel' => $statusHistory->status->label(),
                    'description' => $statusHistory->status->publicDescription(),
                    'publicNotes' => $statusHistory->public_notes,
                    'occurredAt' => $statusHistory->created_at->toIso8601String(),
                ])
                ->all(),
        );
    }
}
