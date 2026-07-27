<?php

use App\Models\ServiceApplication;
use App\ServiceApplicationStatus;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(LazilyRefreshDatabase::class);

function fakePdf(string $name): UploadedFile
{
    return UploadedFile::fake()->createWithContent(
        $name,
        "%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF",
    );
}

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function validServiceApplicationPayload(array $overrides = []): array
{
    return [
        'applicant_name' => 'Warga Contoh',
        'national_id' => '3517123456789012',
        'phone' => '081234567890',
        'address' => 'Dusun Ngampungan RT 01 RW 02',
        'purpose' => 'Mengurus dokumen untuk keperluan pengujian sistem.',
        'documents' => [
            'identity-card' => fakePdf('ktp-contoh.pdf'),
            'family-card' => fakePdf('kk-contoh.pdf'),
            'neighbourhood-letter' => fakePdf('pengantar-contoh.pdf'),
        ],
        'privacy_consent' => '1',
        'website' => '',
        ...$overrides,
    ];
}

test('a public visitor can submit a service application with private documents', function () {
    Storage::fake('local');

    $response = $this->post(
        route('service-applications.store', 'surat-keterangan-usaha'),
        validServiceApplicationPayload(),
    );

    $response
        ->assertRedirect(route('services.show', 'surat-keterangan-usaha'))
        ->assertSessionHas(
            'serviceApplicationSuccess',
            fn (array $success): bool => str_starts_with(
                $success['referenceNumber'],
                'NGP-',
            )
                && $success['serviceTitle'] === 'Surat Keterangan Usaha',
        );

    $serviceApplication = ServiceApplication::query()
        ->with('documents')
        ->sole();

    $this->assertModelExists($serviceApplication);

    expect($serviceApplication)
        ->service_slug->toBe('surat-keterangan-usaha')
        ->applicant_name->toBe('Warga Contoh')
        ->national_id->toBe('3517123456789012')
        ->status->toBe(ServiceApplicationStatus::Submitted)
        ->and($serviceApplication->documents)->toHaveCount(3)
        ->and($serviceApplication->getRawOriginal('national_id'))
        ->not->toBe('3517123456789012');

    foreach ($serviceApplication->documents as $document) {
        Storage::disk('local')->assertExists($document->storage_path);
        expect($document->getRawOriginal('original_name'))
            ->not->toBe($document->original_name);
    }
});

test('service application validation rejects incomplete applicant data and documents', function () {
    Storage::fake('local');

    $response = $this
        ->from(route('services.show', 'surat-keterangan-usaha'))
        ->post(
            route('service-applications.store', 'surat-keterangan-usaha'),
            validServiceApplicationPayload([
                'national_id' => '123',
                'purpose' => 'Pendek',
                'documents' => [],
                'privacy_consent' => false,
            ]),
        );

    $response
        ->assertRedirect(route('services.show', 'surat-keterangan-usaha'))
        ->assertSessionHasErrors([
            'national_id',
            'purpose',
            'documents.identity-card',
            'documents.family-card',
            'documents.neighbourhood-letter',
            'privacy_consent',
        ]);

    expect(ServiceApplication::query()->count())->toBe(0);
    Storage::disk('local')->assertDirectoryEmpty('/');
});

test('service application validation rejects unknown and disguised document files', function () {
    Storage::fake('local');

    $payload = validServiceApplicationPayload();
    $payload['documents']['unexpected-document'] = fakePdf('unknown.pdf');
    $payload['documents']['identity-card'] = UploadedFile::fake()->create(
        'identity-card.pdf',
        10,
        'application/x-msdownload',
    );

    $this->from(route('services.show', 'surat-keterangan-usaha'))
        ->post(
            route('service-applications.store', 'surat-keterangan-usaha'),
            $payload,
        )
        ->assertRedirect(route('services.show', 'surat-keterangan-usaha'))
        ->assertSessionHasErrors([
            'documents',
            'documents.identity-card',
        ]);

    expect(ServiceApplication::query()->count())->toBe(0);
});

test('unknown service slugs cannot be opened or submitted', function () {
    $this->get('/layanan/layanan-tidak-ada')->assertNotFound();
    $this->post('/layanan/layanan-tidak-ada/pengajuan', [])
        ->assertNotFound();
});
