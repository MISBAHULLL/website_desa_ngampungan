<?php

use App\Models\User;
use App\Models\VillageInstitution;
use App\Models\VillageOfficial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

function fakeVillageOfficialPng(string $name): UploadedFile
{
    $contents = base64_decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        true,
    );

    if (! is_string($contents)) {
        throw new RuntimeException('Fixture PNG perangkat desa tidak valid.');
    }

    return UploadedFile::fake()->createWithContent($name, $contents);
}

test('admin can view village officials list', function () {
    VillageOfficial::factory()->create(['name' => 'Budi Santoso']);

    $response = $this->actingAs($this->user)
        ->get(route('admin.village-officials.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/village-officials/index')
            ->has('officials.data', 1)
        );
});

test('admin can create village official', function () {
    $payload = [
        'name' => 'Siti Rahma, S.Pd.',
        'initials' => 'SR',
        'position' => 'Kaur Perencanaan',
        'unit' => 'Sekretariat Desa',
        'group' => 'secretariat',
        'term' => '2022–2028',
        'summary' => 'Menyusun perencanaan anggaran desa.',
        'responsibilities' => ['Menyusun RKPDes'],
        'service_focus' => ['Perencanaan'],
        'education' => ['S1 Pendidikan'],
        'career' => [['period' => '2022-2028', 'role' => 'Kaur']],
        'sort_order' => 1,
        'is_active' => true,
    ];

    $response = $this->actingAs($this->user)
        ->post(route('admin.village-officials.store'), $payload);

    $response->assertRedirect(route('admin.village-officials.index'));
    $this->assertDatabaseHas('village_officials', [
        'name' => 'Siti Rahma, S.Pd.',
        'position' => 'Kaur Perencanaan',
    ]);
});

test('admin can upload a png village official photo that appears in admin and public pages', function () {
    Storage::fake('public');

    $response = $this->actingAs($this->user)
        ->post(route('admin.village-officials.store'), [
            'name' => 'Rudi Hartono',
            'initials' => 'RH',
            'position' => 'Kasi Pelayanan',
            'unit' => 'Pelaksana Teknis',
            'group' => 'technical',
            'photo' => fakeVillageOfficialPng('rudi.png'),
            'summary' => 'Mengoordinasikan pelayanan masyarakat desa.',
            'responsibilities' => ['Melayani administrasi warga'],
            'service_focus' => ['Pelayanan warga'],
            'education' => [],
            'career' => [],
            'sort_order' => 1,
            'is_active' => true,
        ]);

    $response->assertRedirect(route('admin.village-officials.index'));

    $official = VillageOfficial::query()->where('name', 'Rudi Hartono')->firstOrFail();

    expect($official->photo_path)->not->toBeNull();
    Storage::disk('public')->assertExists($official->photo_path);

    $this->actingAs($this->user)
        ->get(route('admin.village-officials.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('officials.data.0.photo_url', fn (string $photoUrl): bool => str_contains($photoUrl, '/storage/village-officials/')));

    $this->get(route('government.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('officials.all.0.photo_url', fn (string $photoUrl): bool => str_contains($photoUrl, '/storage/village-officials/')));
});

test('admin can replace a village official photo using multipart method spoofing', function () {
    Storage::fake('public');

    $oldPhotoPath = fakeVillageOfficialPng('foto-lama.png')
        ->store('village-officials', 'public');
    $official = VillageOfficial::factory()->create([
        'photo_path' => $oldPhotoPath,
    ]);

    $response = $this->actingAs($this->user)
        ->post(route('admin.village-officials.update', $official), [
            '_method' => 'PUT',
            'name' => $official->name,
            'initials' => $official->initials,
            'position' => $official->position,
            'unit' => $official->unit,
            'group' => $official->group,
            'photo' => fakeVillageOfficialPng('foto-baru.png'),
            'term' => $official->term,
            'employee_id' => $official->employee_id,
            'summary' => $official->summary,
            'about' => $official->about,
            'responsibilities' => $official->responsibilities,
            'service_focus' => $official->service_focus,
            'education' => $official->education,
            'career' => $official->career,
            'sort_order' => $official->sort_order,
            'parent_id' => $official->parent_id,
            'is_active' => true,
        ]);

    $response->assertRedirect(route('admin.village-officials.index'));

    $official->refresh();

    expect($official->photo_path)
        ->not->toBeNull()
        ->not->toBe($oldPhotoPath);
    Storage::disk('public')->assertMissing($oldPhotoPath);
    Storage::disk('public')->assertExists($official->photo_path);
});

test('village official photo upload rejects unsupported files', function () {
    Storage::fake('public');

    $this->actingAs($this->user)
        ->post(route('admin.village-officials.store'), [
            'name' => 'Rudi Hartono',
            'initials' => 'RH',
            'position' => 'Kasi Pelayanan',
            'unit' => 'Pelaksana Teknis',
            'group' => 'technical',
            'photo' => UploadedFile::fake()->create('biodata.pdf', 100, 'application/pdf'),
            'summary' => 'Mengoordinasikan pelayanan masyarakat desa.',
        ])
        ->assertSessionHasErrors('photo');
});

test('admin can update village institution', function () {
    $institution = VillageInstitution::factory()->create([
        'acronym' => 'LPMD',
        'name' => 'Lembaga Pemberdayaan Masyarakat Desa',
    ]);

    $response = $this->actingAs($this->user)
        ->put(route('admin.village-institutions.update', $institution), [
            'acronym' => 'LPMD',
            'name' => 'LPMD Ngampungan Baru',
            'member_count' => 15,
            'focus' => 'Pemberdayaan dan pembangunan partisipatif.',
            'responsibilities' => ['Pembangunan'],
            'sort_order' => 1,
            'is_active' => true,
        ]);

    $response->assertRedirect(route('admin.village-institutions.index'));
    $this->assertDatabaseHas('village_institutions', [
        'id' => $institution->id,
        'name' => 'LPMD Ngampungan Baru',
    ]);
});

test('admin can update organization hierarchy', function () {
    $kades = VillageOfficial::factory()->create(['position' => 'Kepala Desa', 'parent_id' => null]);
    $sekdes = VillageOfficial::factory()->create(['position' => 'Sekretaris Desa', 'parent_id' => null]);

    $response = $this->actingAs($this->user)
        ->patch(route('admin.organization-structure.update'), [
            'updates' => [
                ['id' => $sekdes->id, 'parent_id' => $kades->id, 'sort_order' => 1],
            ],
        ]);

    $response->assertStatus(302);
    expect($sekdes->fresh()->parent_id)->toBe($kades->id);
});
