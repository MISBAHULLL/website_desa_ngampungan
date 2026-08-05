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

test('admin can add multiple branches under the same direct superior', function () {
    $villageHead = VillageOfficial::factory()->create([
        'name' => 'Rohan',
        'position' => 'Kepala Desa',
        'parent_id' => null,
    ]);
    $secretary = VillageOfficial::factory()->create([
        'name' => 'Rina',
        'position' => 'Sekretaris Desa',
        'parent_id' => null,
    ]);
    $treasurer = VillageOfficial::factory()->create([
        'name' => 'Bambang',
        'position' => 'Bendahara Desa',
        'parent_id' => null,
    ]);

    $this->actingAs($this->user)
        ->post(route('admin.organization-structure.branches.store'), [
            'parent_id' => $villageHead->id,
            'member_id' => $secretary->id,
        ])
        ->assertSessionHasNoErrors();

    $this->actingAs($this->user)
        ->post(route('admin.organization-structure.branches.store'), [
            'parent_id' => $villageHead->id,
            'member_id' => $treasurer->id,
        ])
        ->assertSessionHasNoErrors();

    expect($secretary->fresh()->parent_id)->toBe($villageHead->id)
        ->and($treasurer->fresh()->parent_id)->toBe($villageHead->id);

    $this->get(route('government.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('officials.orgTree', 1)
            ->where('officials.orgTree.0.name', 'Rohan')
            ->has('officials.orgTree.0.children', 2));
});

test('admin can move a kasi branch from village secretary directly to village head', function () {
    $villageHead = VillageOfficial::factory()->create([
        'name' => 'Rohan',
        'position' => 'Kepala Desa',
        'parent_id' => null,
        'sort_order' => 0,
    ]);
    $secretary = VillageOfficial::factory()->create([
        'name' => 'Rina',
        'position' => 'Sekretaris Desa',
        'parent_id' => $villageHead->id,
        'sort_order' => 1,
    ]);
    $sectionHead = VillageOfficial::factory()->create([
        'name' => 'Imam',
        'position' => 'Kasi Pelayanan',
        'parent_id' => $secretary->id,
        'sort_order' => 1,
    ]);

    $this->actingAs($this->user)
        ->post(route('admin.organization-structure.branches.store'), [
            'parent_id' => $villageHead->id,
            'member_id' => $sectionHead->id,
        ])
        ->assertSessionHasNoErrors();

    expect($sectionHead->fresh()->parent_id)->toBe($villageHead->id);

    $this->get(route('government.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('officials.orgTree.0.name', 'Rohan')
            ->has('officials.orgTree.0.children', 2)
            ->where('officials.orgTree.0.children.1.name', 'Imam')
            ->has('officials.orgTree.0.children.0.children', 0));
});

test('public organization tree places secretary kasi and village head assistants at the requested levels', function () {
    $villageHead = VillageOfficial::factory()->create([
        'name' => 'Rohan',
        'position' => 'Kepala Desa',
        'group' => 'leadership',
        'parent_id' => null,
        'sort_order' => 0,
    ]);
    $secretary = VillageOfficial::factory()->create([
        'name' => 'Rina',
        'position' => 'Sekretaris Desa',
        'group' => 'secretariat',
        'parent_id' => $villageHead->id,
        'sort_order' => 1,
    ]);
    VillageOfficial::factory()->create([
        'name' => 'Bagas',
        'position' => 'Kaur Keuangan',
        'group' => 'secretariat',
        'parent_id' => $secretary->id,
        'sort_order' => 1,
    ]);
    VillageOfficial::factory()->create([
        'name' => 'Imam',
        'position' => 'Kasi Pelayanan',
        'group' => 'technical',
        'parent_id' => $villageHead->id,
        'sort_order' => 2,
    ]);
    VillageOfficial::factory()->create([
        'name' => 'Suparmo',
        'position' => 'Kepala Dusun Ngampungan',
        'group' => 'territorial',
        'parent_id' => $villageHead->id,
        'sort_order' => 3,
    ]);

    $this->get(route('government.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('officials.orgTree.0.name', 'Rohan')
            ->has('officials.orgTree.0.children', 3)
            ->where('officials.orgTree.0.children.0.name', 'Rina')
            ->where('officials.orgTree.0.children.0.children.0.name', 'Bagas')
            ->where('officials.orgTree.0.children.1.name', 'Imam')
            ->where('officials.orgTree.0.children.2.name', 'Suparmo'));
});

test('admin can detach a branch without deleting officials or their subtree', function () {
    $villageHead = VillageOfficial::factory()->create([
        'position' => 'Kepala Desa',
        'parent_id' => null,
    ]);
    $secretary = VillageOfficial::factory()->create([
        'position' => 'Sekretaris Desa',
        'parent_id' => $villageHead->id,
    ]);
    $administrationHead = VillageOfficial::factory()->create([
        'position' => 'Kaur Tata Usaha',
        'parent_id' => $secretary->id,
    ]);

    $this->actingAs($this->user)
        ->delete(route('admin.organization-structure.branches.destroy', $secretary))
        ->assertSessionHasNoErrors();

    $secretary->refresh();
    $administrationHead->refresh();

    $this->assertModelExists($secretary);
    $this->assertModelExists($administrationHead);
    expect($secretary->parent_id)->toBeNull()
        ->and($administrationHead->parent_id)->toBe($secretary->id);
});

test('organization branch validation rejects self references and circular hierarchies', function () {
    $villageHead = VillageOfficial::factory()->create(['parent_id' => null]);
    $secretary = VillageOfficial::factory()->create(['parent_id' => $villageHead->id]);
    $administrationHead = VillageOfficial::factory()->create(['parent_id' => $secretary->id]);

    $this->actingAs($this->user)
        ->post(route('admin.organization-structure.branches.store'), [
            'parent_id' => $villageHead->id,
            'member_id' => $villageHead->id,
        ])
        ->assertSessionHasErrors('member_id');

    $this->actingAs($this->user)
        ->post(route('admin.organization-structure.branches.store'), [
            'parent_id' => $administrationHead->id,
            'member_id' => $villageHead->id,
        ])
        ->assertSessionHasErrors('parent_id');

    expect($villageHead->fresh()->parent_id)->toBeNull();
});

test('bulk hierarchy update rejects a circular relationship', function () {
    $villageHead = VillageOfficial::factory()->create(['parent_id' => null]);
    $secretary = VillageOfficial::factory()->create(['parent_id' => $villageHead->id]);

    $this->actingAs($this->user)
        ->patch(route('admin.organization-structure.update'), [
            'updates' => [
                [
                    'id' => $villageHead->id,
                    'parent_id' => $secretary->id,
                    'sort_order' => 0,
                ],
            ],
        ])
        ->assertSessionHasErrors('updates');

    expect($villageHead->fresh()->parent_id)->toBeNull();
});
