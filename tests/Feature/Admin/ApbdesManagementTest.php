<?php

use App\Models\ApbdesDocument;
use App\Models\ApbdesSummary;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(LazilyRefreshDatabase::class);

function validApbdesData(array $overrides = []): array
{
    return array_replace_recursive([
        'year' => '2027',
        'updated_date' => '2027-07-20',
        'net_financing' => 30_000_000,
        'income_sources' => [
            [
                'code' => 'DD',
                'label' => 'Dana Desa',
                'amount' => 1_200_000_000,
                'description' => 'Transfer dari pemerintah pusat.',
            ],
            [
                'code' => 'ADD',
                'label' => 'Alokasi Dana Desa',
                'amount' => 700_000_000,
                'description' => 'Alokasi dari kabupaten.',
            ],
        ],
        'activities' => [
            [
                'code' => '2.1.01',
                'name' => 'Pembangunan jalan lingkungan',
                'category' => 'pembangunan',
                'budget' => 500_000_000,
                'realized' => 250_000_000,
                'location' => 'Dusun Ngampungan',
                'status' => 'berjalan',
            ],
        ],
    ], $overrides);
}

test('guest cannot access APBDes administration', function () {
    $this->get(route('admin.apbdes.index'))->assertRedirect(route('login'));
});

test('admin can open the APBDes list and create form', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('admin.apbdes.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/apbdes/index')
            ->has('summaries'));

    $this->actingAs($admin)
        ->get(route('admin.apbdes.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/apbdes/form')
            ->has('categoryOptions', 5)
            ->has('statusOptions', 3));
});

test('admin can create APBDes with income sources and activities', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.apbdes.store'), validApbdesData())
        ->assertValid()
        ->assertRedirect(route('admin.apbdes.index'));

    $summary = ApbdesSummary::query()->firstOrFail();

    expect($summary)
        ->year->toBe('2027')
        ->net_financing->toBe(30_000_000)
        ->updated_date->toBeInstanceOf(CarbonImmutable::class)
        ->and($summary->incomeSources()->count())->toBe(2)
        ->and($summary->activities()->count())->toBe(1);

    $this->assertDatabaseHas('apbdes_activity_items', [
        'apbdes_summary_id' => $summary->id,
        'name' => 'Pembangunan jalan lingkungan',
        'realized' => 250_000_000,
    ]);
});

test('APBDes validation rejects duplicate years and duplicate row codes', function () {
    ApbdesSummary::query()->create([
        'year' => '2027',
        'updated_date' => '2027-01-01',
        'net_financing' => 0,
    ]);

    $payload = validApbdesData();
    $payload['income_sources'][1]['code'] = 'dd';

    $this->actingAs(User::factory()->create())
        ->post(route('admin.apbdes.store'), $payload)
        ->assertInvalid([
            'year',
            'income_sources.1.code',
        ]);
});

test('admin can update APBDes and replace its nested details safely', function () {
    $summary = ApbdesSummary::query()->create([
        'year' => '2026',
        'updated_date' => '2026-01-10',
        'net_financing' => 0,
    ]);
    $summary->incomeSources()->create([
        'code' => 'OLD',
        'label' => 'Sumber Lama',
        'amount' => 100,
    ]);
    $summary->activities()->create([
        'code' => 'OLD-1',
        'name' => 'Kegiatan Lama',
        'category' => 'pemerintahan',
        'budget' => 100,
        'realized' => 0,
        'location' => 'Balai Desa',
        'status' => 'direncanakan',
    ]);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.apbdes.update', $summary), validApbdesData([
            'year' => '2026',
            'net_financing' => -10_000_000,
        ]))
        ->assertValid()
        ->assertRedirect(route('admin.apbdes.index'));

    $summary->refresh();

    expect($summary)
        ->year->toBe('2026')
        ->net_financing->toBe(-10_000_000)
        ->and($summary->incomeSources()->pluck('code')->all())->toBe(['DD', 'ADD'])
        ->and($summary->activities()->pluck('code')->all())->toBe(['2.1.01']);

    $this->assertDatabaseMissing('apbdes_income_sources', ['code' => 'OLD']);
    $this->assertDatabaseMissing('apbdes_activity_items', ['code' => 'OLD-1']);
});

test('admin can delete APBDes and cascading details', function () {
    $summary = ApbdesSummary::query()->create([
        'year' => '2026',
        'updated_date' => '2026-01-10',
        'net_financing' => 0,
    ]);
    $income = $summary->incomeSources()->create([
        'code' => 'DD',
        'label' => 'Dana Desa',
        'amount' => 1_000,
    ]);
    $activity = $summary->activities()->create([
        'code' => '2.1.01',
        'name' => 'Kegiatan Desa',
        'category' => 'pembangunan',
        'budget' => 1_000,
        'realized' => 500,
        'location' => 'Desa Ngampungan',
        'status' => 'berjalan',
    ]);

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.apbdes.destroy', $summary))
        ->assertRedirect(route('admin.apbdes.index'));

    $this->assertModelMissing($summary);
    $this->assertModelMissing($income);
    $this->assertModelMissing($activity);
});

test('homepage receives APBDes data managed by admin', function () {
    $summary = ApbdesSummary::query()->create([
        'year' => '2028',
        'updated_date' => '2028-07-20',
        'net_financing' => 25_000_000,
    ]);
    $summary->incomeSources()->create([
        'code' => 'DD',
        'label' => 'Dana Desa',
        'amount' => 2_000_000_000,
    ]);
    $summary->activities()->create([
        'code' => '2.1.01',
        'name' => 'Pembangunan jalan desa',
        'category' => 'pembangunan',
        'budget' => 1_000_000_000,
        'realized' => 500_000_000,
        'location' => 'Dusun Ngampungan',
        'status' => 'berjalan',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->missing('apbdesSummaries')
            ->reloadOnly('apbdesSummaries', fn (Assert $reload) => $reload
                ->has('apbdesSummaries', 1)
                ->where('apbdesSummaries.0.year', '2028')
                ->where('apbdesSummaries.0.realizationPercentage', 50)
                ->where('apbdesSummaries.0.incomeAmount', 2_000_000_000)
                ->where('apbdesSummaries.0.expenseAmount', 1_000_000_000)
                ->where('apbdesSummaries.0.realizedAmountValue', 500_000_000)
                ->where('apbdesSummaries.0.allocations.1.absorptionPercentage', 50)
                ->where('apbdesSummaries.0.incomeValue', 'Rp2,00 miliar')));
});

test('admin can upload PDF and Excel documents for an APBDes year', function (string $name, string $mime, string $format) {
    Storage::fake('public');
    ApbdesSummary::query()->create([
        'year' => '2028',
        'updated_date' => '2028-01-10',
        'net_financing' => 0,
    ]);

    $file = UploadedFile::fake()->create($name, 128, $mime);

    $this->actingAs(User::factory()->create())
        ->post(route('admin.apbdes-documents.store'), [
            'title' => 'Dokumen Transparansi 2028',
            'category' => 'APBDes',
            'year' => '2028',
            'document_date' => '2028-01-10',
            'document' => $file,
        ])
        ->assertValid()
        ->assertRedirect(route('admin.apbdes.index'));

    $document = ApbdesDocument::query()->firstOrFail();

    expect($document)
        ->file_format->toBe($format)
        ->original_name->toBe($name)
        ->file_size->toContain('KB');

    Storage::disk('public')->assertExists($document->file_path);
})->with([
    'PDF' => ['laporan.pdf', 'application/pdf', 'PDF'],
    'Excel XLSX' => [
        'rincian.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'XLSX',
    ],
]);

test('document upload rejects unsupported files and unknown APBDes years', function () {
    $file = UploadedFile::fake()->create('script.exe', 20, 'application/octet-stream');

    $this->actingAs(User::factory()->create())
        ->post(route('admin.apbdes-documents.store'), [
            'title' => 'Dokumen Tidak Valid',
            'category' => 'APBDes',
            'year' => '2099',
            'document_date' => '2028-01-10',
            'document' => $file,
        ])
        ->assertInvalid(['year', 'document']);
});

test('admin can replace a public document and the old file is removed', function () {
    Storage::fake('public');
    Storage::disk('public')->put('apbdes-documents/old.pdf', 'old');
    ApbdesSummary::query()->create([
        'year' => '2028',
        'updated_date' => '2028-01-10',
        'net_financing' => 0,
    ]);
    $document = ApbdesDocument::query()->create([
        'title' => 'APBDes Lama',
        'category' => 'APBDes',
        'year' => '2028',
        'document_date' => '2028-01-10',
        'file_path' => 'apbdes-documents/old.pdf',
        'file_format' => 'PDF',
        'original_name' => 'old.pdf',
        'mime_type' => 'application/pdf',
        'file_size' => '1 KB',
    ]);
    $replacement = UploadedFile::fake()->create(
        'realisasi.xlsx',
        64,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    $this->actingAs(User::factory()->create())
        ->post(route('admin.apbdes-documents.update', $document), [
            '_method' => 'PUT',
            'title' => 'Realisasi APBDes 2028',
            'category' => 'Laporan Realisasi',
            'year' => '2028',
            'document_date' => '2028-07-20',
            'document' => $replacement,
        ])
        ->assertValid()
        ->assertRedirect(route('admin.apbdes.index'));

    $document->refresh();

    expect($document)
        ->file_format->toBe('XLSX')
        ->original_name->toBe('realisasi.xlsx');
    Storage::disk('public')->assertMissing('apbdes-documents/old.pdf');
    Storage::disk('public')->assertExists($document->file_path);
});

test('public document response exposes its real format and downloads the stored file', function () {
    Storage::fake('public');
    Storage::disk('public')->put('apbdes-documents/rincian.xlsx', 'spreadsheet-content');
    $document = ApbdesDocument::query()->create([
        'title' => 'Rincian APBDes 2028',
        'category' => 'APBDes',
        'year' => '2028',
        'document_date' => '2028-01-10',
        'file_path' => 'apbdes-documents/rincian.xlsx',
        'file_format' => 'XLSX',
        'original_name' => 'rincian.xlsx',
        'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'file_size' => '18 KB',
    ]);

    $this->get(route('transparency.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('dbPublicDocuments.0.format', 'XLSX')
            ->where('dbPublicDocuments.0.fileSize', '18 KB'));

    $this->get(route('transparency.documents.download', $document))
        ->assertOk()
        ->assertDownload('rincian-apbdes-2028.xlsx');
});
