<?php

use App\Models\ServiceApplication;
use App\Models\ServiceApplicationDocument;
use App\Models\User;
use App\ServiceApplicationStatus;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(LazilyRefreshDatabase::class);

test('guests cannot access service application administration endpoints', function () {
    $application = ServiceApplication::factory()->create();
    $document = ServiceApplicationDocument::factory()
        ->for($application)
        ->create();

    $this->get(route('admin.service-applications.index'))
        ->assertRedirect(route('login'));
    $this->get(route('admin.service-applications.show', $application))
        ->assertRedirect(route('login'));
    $this->patch(route('admin.service-applications.update', $application), [
        'status' => ServiceApplicationStatus::InReview->value,
    ])->assertRedirect(route('login'));
    $this->get(route('admin.service-applications.documents.download', [
        $application,
        $document,
    ]))->assertRedirect(route('login'));
});

test('an authenticated admin can filter and search the paginated application inbox', function () {
    $admin = User::factory()->create();
    ServiceApplication::factory()->count(2)->create();
    ServiceApplication::factory()->create([
        'reference_number' => 'NGP-20260727-SEARCH01',
        'service_title' => 'Surat Domisili',
        'status' => ServiceApplicationStatus::InReview,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.service-applications.index', [
            'search' => 'SEARCH01',
            'status' => ServiceApplicationStatus::InReview->value,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/service-applications/index')
            ->where('filters.search', 'SEARCH01')
            ->where('filters.status', 'in_review')
            ->has('applications.data', 1)
            ->where('applications.data.0.referenceNumber', 'NGP-20260727-SEARCH01')
            ->where('applications.data.0.serviceTitle', 'Surat Domisili')
            ->where('statistics.total', 3)
            ->where('statistics.submitted', 2)
            ->where('statistics.inReview', 1));
});

test('an authenticated admin can view decrypted applicant data and document metadata', function () {
    $admin = User::factory()->create();
    $application = ServiceApplication::factory()->create([
        'applicant_name' => 'Siti Aminah',
        'national_id' => '3517123456789012',
        'phone' => '081234567890',
        'address' => 'Dusun Ngampungan RT 01 RW 02',
        'purpose' => 'Pengurusan izin usaha.',
    ]);
    ServiceApplicationDocument::factory()->for($application)->create([
        'document_label' => 'KTP pemohon',
        'original_name' => 'ktp-siti.pdf',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.service-applications.show', $application))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/service-applications/show')
            ->where('application.applicantName', 'Siti Aminah')
            ->where('application.nationalId', '3517123456789012')
            ->where('application.phone', '081234567890')
            ->where('application.address', 'Dusun Ngampungan RT 01 RW 02')
            ->where('application.purpose', 'Pengurusan izin usaha.')
            ->has('application.documents', 1)
            ->where('application.documents.0.originalName', 'ktp-siti.pdf')
            ->has('statuses', count(ServiceApplicationStatus::cases())));
});

test('an authenticated admin can update status and an encrypted internal note', function () {
    $admin = User::factory()->create();
    $application = ServiceApplication::factory()->create();

    $this->actingAs($admin)
        ->patch(route('admin.service-applications.update', $application), [
            'status' => ServiceApplicationStatus::NeedsRevision->value,
            'admin_notes' => 'Kartu keluarga perlu diunggah ulang.',
            'public_notes' => 'Mohon unggah ulang Kartu Keluarga.',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $application->refresh();

    expect($application)
        ->status->toBe(ServiceApplicationStatus::NeedsRevision)
        ->admin_notes->toBe('Kartu keluarga perlu diunggah ulang.')
        ->public_notes->toBe('Mohon unggah ulang Kartu Keluarga.')
        ->reviewed_by->toBe($admin->id)
        ->reviewed_at->not->toBeNull()
        ->and($application->statusHistories)->toHaveCount(1)
        ->and($application->statusHistories->first()?->status)
        ->toBe(ServiceApplicationStatus::NeedsRevision)
        ->and($application->getRawOriginal('admin_notes'))
        ->not->toBe('Kartu keluarga perlu diunggah ulang.')
        ->and($application->getRawOriginal('public_notes'))
        ->not->toBe('Mohon unggah ulang Kartu Keluarga.');
});

test('service application administration rejects invalid status updates and filters', function () {
    $admin = User::factory()->create();
    $application = ServiceApplication::factory()->create();

    $this->actingAs($admin)
        ->from(route('admin.service-applications.show', $application))
        ->patch(route('admin.service-applications.update', $application), [
            'status' => 'status-tidak-valid',
            'admin_notes' => str_repeat('x', 3001),
        ])
        ->assertRedirect(route('admin.service-applications.show', $application))
        ->assertSessionHasErrors(['status', 'admin_notes']);

    $this->actingAs($admin)
        ->get(route('admin.service-applications.index', [
            'status' => 'status-tidak-valid',
        ]))
        ->assertSessionHasErrors('status');
});

test('an authenticated admin can download a document from private storage', function () {
    Storage::fake('local');

    $admin = User::factory()->create();
    $application = ServiceApplication::factory()->create([
        'reference_number' => 'NGP-20260727-DOWNLOAD',
    ]);
    $document = ServiceApplicationDocument::factory()
        ->for($application)
        ->create([
            'original_name' => 'kartu-keluarga.pdf',
            'storage_path' => 'service-applications/download/kartu-keluarga.pdf',
            'mime_type' => 'application/pdf',
        ]);
    Storage::disk('local')->put($document->storage_path, 'PDF test content');

    $this->actingAs($admin)
        ->get(route('admin.service-applications.documents.download', [
            $application,
            $document,
        ]))
        ->assertOk()
        ->assertDownload(
            "NGP-20260727-DOWNLOAD-dokumen-{$document->id}.pdf",
        );
});

test('a document cannot be downloaded through a different application', function () {
    Storage::fake('local');

    $admin = User::factory()->create();
    $firstApplication = ServiceApplication::factory()->create();
    $secondApplication = ServiceApplication::factory()->create();
    $document = ServiceApplicationDocument::factory()
        ->for($secondApplication)
        ->create();
    Storage::disk('local')->put($document->storage_path, 'private document');

    $this->actingAs($admin)
        ->get(route('admin.service-applications.documents.download', [
            $firstApplication,
            $document,
        ]))
        ->assertNotFound();
});

test('a missing private document returns not found', function () {
    Storage::fake('local');

    $admin = User::factory()->create();
    $application = ServiceApplication::factory()->create();
    $document = ServiceApplicationDocument::factory()
        ->for($application)
        ->create(['storage_path' => 'service-applications/missing.pdf']);

    $this->actingAs($admin)
        ->get(route('admin.service-applications.documents.download', [
            $application,
            $document,
        ]))
        ->assertNotFound();
});
