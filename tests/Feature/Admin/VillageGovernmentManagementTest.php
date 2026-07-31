<?php

use App\Models\User;
use App\Models\VillageInstitution;
use App\Models\VillageOfficial;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

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
