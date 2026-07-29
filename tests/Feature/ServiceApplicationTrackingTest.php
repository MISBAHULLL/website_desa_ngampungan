<?php

use App\Models\ServiceApplication;
use App\Models\ServiceApplicationStatusHistory;
use App\ServiceApplicationStatus;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Symfony\Component\HttpFoundation\Response;

uses(LazilyRefreshDatabase::class);

test('the public tracking page can be opened without a reference number', function () {
    $this->get(route('service-applications.track'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('service-applications/track')
            ->where('referenceNumber', '')
            ->where('lookupAttempted', false)
            ->where('application', null));
});

test('a resident can track an application using a normalized reference number', function () {
    $application = ServiceApplication::factory()->create([
        'reference_number' => 'NGP-20260727-TRACK001',
        'service_title' => 'Surat Keterangan Usaha',
        'status' => ServiceApplicationStatus::NeedsRevision,
        'public_notes' => 'Mohon unggah ulang foto Kartu Keluarga.',
        'applicant_name' => 'Nama yang tidak boleh bocor',
        'national_id' => '3517123456789012',
        'phone' => '081234567890',
        'address' => 'Alamat yang tidak boleh bocor',
        'purpose' => 'Keperluan yang tidak boleh bocor',
        'admin_notes' => 'Catatan internal yang tidak boleh bocor',
    ]);
    ServiceApplicationStatusHistory::factory()->for($application)->create([
        'status' => ServiceApplicationStatus::Submitted,
        'public_notes' => 'Pengajuan berhasil diterima sistem.',
        'created_at' => now()->subHour(),
    ]);
    ServiceApplicationStatusHistory::factory()->for($application)->create([
        'status' => ServiceApplicationStatus::NeedsRevision,
        'public_notes' => 'Mohon unggah ulang foto Kartu Keluarga.',
        'created_at' => now(),
    ]);

    $this->get(route('service-applications.track', [
        'reference' => '  ngp-20260727-track001  ',
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('service-applications/track')
            ->where('referenceNumber', 'NGP-20260727-TRACK001')
            ->where('lookupAttempted', true)
            ->where('application.referenceNumber', 'NGP-20260727-TRACK001')
            ->where('application.serviceTitle', 'Surat Keterangan Usaha')
            ->where('application.status', 'needs_revision')
            ->where(
                'application.publicNotes',
                'Mohon unggah ulang foto Kartu Keluarga.',
            )
            ->has('application.timeline', 2)
            ->where('application.timeline.0.status', 'submitted')
            ->where('application.timeline.1.status', 'needs_revision')
            ->missing('application.applicantName')
            ->missing('application.nationalId')
            ->missing('application.phone')
            ->missing('application.address')
            ->missing('application.purpose')
            ->missing('application.adminNotes')
            ->missing('application.documents')
            ->missing('application.reviewerName'));
});

test('an unknown reference returns a generic empty result', function () {
    $this->get(route('service-applications.track', [
        'reference' => 'NGP-20260727-UNKNOWN1',
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('lookupAttempted', true)
            ->where('application', null));
});

test('an invalid tracking reference is rejected before querying', function () {
    $this->from(route('service-applications.track'))
        ->get(route('service-applications.track', [
            'reference' => 'nomor tidak valid',
        ]))
        ->assertRedirect(route('service-applications.track'))
        ->assertSessionHasErrors('reference');
});

test('tracking falls back to the current status for legacy applications without history', function () {
    $application = ServiceApplication::factory()->create([
        'reference_number' => 'NGP-20260727-LEGACY01',
        'status' => ServiceApplicationStatus::InReview,
    ]);

    $this->get(route('service-applications.track', [
        'reference' => $application->reference_number,
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('application.timeline', 1)
            ->where('application.timeline.0.status', 'in_review'));
});

test('public application tracking is rate limited by ip address', function () {
    foreach (range(1, 10) as $attempt) {
        $this
            ->withServerVariables(['REMOTE_ADDR' => '192.0.2.51'])
            ->get(route('service-applications.track', [
                'reference' => 'NGP-20260727-LIMIT001',
            ]))
            ->assertOk();
    }

    $this
        ->withServerVariables(['REMOTE_ADDR' => '192.0.2.51'])
        ->get(route('service-applications.track', [
            'reference' => 'NGP-20260727-LIMIT001',
        ]))
        ->assertStatus(Response::HTTP_TOO_MANY_REQUESTS);
});
