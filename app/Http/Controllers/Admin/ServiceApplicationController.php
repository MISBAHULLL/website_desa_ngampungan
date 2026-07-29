<?php

namespace App\Http\Controllers\Admin;

use App\Actions\UpdateServiceApplicationReviewAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FilterServiceApplicationRequest;
use App\Http\Requests\Admin\UpdateServiceApplicationRequest;
use App\Models\ServiceApplication;
use App\Models\ServiceApplicationDocument;
use App\Models\User;
use App\ServiceApplicationStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceApplicationController extends Controller
{
    public function index(FilterServiceApplicationRequest $request): Response
    {
        $validated = $request->validated();
        $search = trim((string) ($validated['search'] ?? ''));
        $status = isset($validated['status'])
            ? ServiceApplicationStatus::from($validated['status'])
            : null;

        $applications = ServiceApplication::query()
            ->select([
                'id',
                'reference_number',
                'service_slug',
                'service_title',
                'applicant_name',
                'status',
                'submitted_at',
                'reviewed_at',
            ])
            ->withCount('documents')
            ->when(
                $status,
                fn (Builder $query, ServiceApplicationStatus $activeStatus): Builder => $query
                    ->where('status', $activeStatus),
            )
            ->when(
                $search !== '',
                fn (Builder $query): Builder => $query->where(
                    fn (Builder $searchQuery): Builder => $searchQuery
                        ->where('reference_number', 'like', "%{$search}%")
                        ->orWhere('service_title', 'like', "%{$search}%")
                        ->orWhere('service_slug', 'like', "%{$search}%"),
                ),
            )
            ->latest('submitted_at')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (ServiceApplication $application): array => [
                'id' => $application->id,
                'referenceNumber' => $application->reference_number,
                'serviceTitle' => $application->service_title,
                'applicantName' => $application->applicant_name,
                'status' => $application->status->value,
                'statusLabel' => $application->status->label(),
                'documentsCount' => $application->documents_count,
                'submittedAt' => $application->submitted_at->toIso8601String(),
                'reviewedAt' => $application->reviewed_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/service-applications/index', [
            'applications' => $applications,
            'filters' => [
                'search' => $search,
                'status' => $status?->value,
            ],
            'statuses' => $this->statusOptions(),
            'statistics' => [
                'total' => ServiceApplication::query()->count(),
                'submitted' => ServiceApplication::query()
                    ->where('status', ServiceApplicationStatus::Submitted)
                    ->count(),
                'inReview' => ServiceApplication::query()
                    ->where('status', ServiceApplicationStatus::InReview)
                    ->count(),
                'completed' => ServiceApplication::query()
                    ->where('status', ServiceApplicationStatus::Completed)
                    ->count(),
            ],
        ]);
    }

    public function show(ServiceApplication $serviceApplication): Response
    {
        Gate::authorize('view', $serviceApplication);

        $serviceApplication->load([
            'documents:id,service_application_id,document_key,document_label,original_name,storage_disk,storage_path,mime_type,size',
            'reviewer:id,name',
        ]);

        return Inertia::render('admin/service-applications/show', [
            'application' => [
                'id' => $serviceApplication->id,
                'referenceNumber' => $serviceApplication->reference_number,
                'serviceTitle' => $serviceApplication->service_title,
                'serviceSlug' => $serviceApplication->service_slug,
                'applicantName' => $serviceApplication->applicant_name,
                'nationalId' => $serviceApplication->national_id,
                'phone' => $serviceApplication->phone,
                'address' => $serviceApplication->address,
                'purpose' => $serviceApplication->purpose,
                'status' => $serviceApplication->status->value,
                'statusLabel' => $serviceApplication->status->label(),
                'adminNotes' => $serviceApplication->admin_notes,
                'publicNotes' => $serviceApplication->public_notes,
                'submittedAt' => $serviceApplication->submitted_at->toIso8601String(),
                'reviewedAt' => $serviceApplication->reviewed_at?->toIso8601String(),
                'reviewerName' => $serviceApplication->reviewer?->name,
                'documents' => $serviceApplication->documents
                    ->map(fn (ServiceApplicationDocument $document): array => [
                        'id' => $document->id,
                        'key' => $document->document_key,
                        'label' => $document->document_label,
                        'originalName' => $document->original_name,
                        'mimeType' => $document->mime_type,
                        'size' => $document->size,
                    ])
                    ->values(),
            ],
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function update(
        UpdateServiceApplicationRequest $request,
        ServiceApplication $serviceApplication,
        UpdateServiceApplicationReviewAction $updateServiceApplicationReview,
    ): RedirectResponse {
        $validated = $request->validated();
        $reviewer = $request->user();

        abort_unless($reviewer instanceof User, 403);

        $adminNotes = Str::of((string) ($validated['admin_notes'] ?? ''))
            ->trim()
            ->toString();
        $publicNotes = Str::of((string) ($validated['public_notes'] ?? ''))
            ->trim()
            ->toString();

        $updateServiceApplicationReview->handle(
            $serviceApplication,
            ServiceApplicationStatus::from($validated['status']),
            $adminNotes !== '' ? $adminNotes : null,
            $publicNotes !== '' ? $publicNotes : null,
            $reviewer,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Status dan catatan pengajuan berhasil diperbarui.',
        ]);

        return back();
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return array_map(
            fn (ServiceApplicationStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ],
            ServiceApplicationStatus::cases(),
        );
    }
}
