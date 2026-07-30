<?php

use App\Models\Agenda;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can view agenda management page', function () {
    $user = User::factory()->create();
    Agenda::factory()->create(['title' => 'Musyawarah Warga RT 02']);

    $response = $this->actingAs($user)->get(route('admin.agendas.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/agenda/index')
            ->has('agendas.data', 1)
        );
});

test('authenticated user can create an agenda item', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.agendas.store'), [
        'title' => 'Posyandu Lansia Bulan Ini',
        'category' => 'Kesehatan',
        'summary' => 'Pemeriksaan kesehatan gratis untuk warga lansia',
        'details' => ['Pemeriksaan tensi', 'Konsultasi gizi'],
        'event_date' => '2026-08-15',
        'time_label' => '08:00 WIB - Selesai',
        'location' => 'Poskesdes Ngampungan',
        'organizer' => 'Kader Posyandu',
        'status' => 'upcoming',
        'is_featured' => true,
    ]);

    $response->assertRedirect(route('admin.agendas.index'));
    $this->assertDatabaseHas('agendas', [
        'title' => 'Posyandu Lansia Bulan Ini',
        'category' => 'Kesehatan',
        'location' => 'Poskesdes Ngampungan',
        'status' => 'upcoming',
    ]);
});

test('authenticated user can delete an agenda item', function () {
    $user = User::factory()->create();
    $agenda = Agenda::factory()->create();

    $response = $this->actingAs($user)->delete(route('admin.agendas.destroy', $agenda->id));

    $response->assertRedirect(route('admin.agendas.index'));
    $this->assertDatabaseMissing('agendas', [
        'id' => $agenda->id,
    ]);
});
