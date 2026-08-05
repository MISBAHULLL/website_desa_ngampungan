<?php

use App\Models\Agenda;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(LazilyRefreshDatabase::class);

function validAgendaPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Posyandu Lansia Bulan Ini',
        'category' => 'Kesehatan',
        'summary' => 'Pemeriksaan kesehatan gratis untuk warga lansia',
        'details' => ['Pemeriksaan tensi', 'Konsultasi gizi'],
        'event_date' => '2026-08-15',
        'time_label' => '08:00 WIB - Selesai',
        'location' => 'Poskesdes Ngampungan',
        'organizer' => 'Kader Posyandu',
        'status' => 'upcoming',
        'is_featured' => false,
    ], $overrides);
}

function fakeAgendaImage(string $extension): UploadedFile
{
    $encodedImage = match ($extension) {
        'jpg' => '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/EH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/EH//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/EH//2Q==',
        'png' => 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    };

    return UploadedFile::fake()->createWithContent(
        "agenda.{$extension}",
        base64_decode($encodedImage, true),
    );
}

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

    $response = $this->actingAs($user)->post(
        route('admin.agendas.store'),
        validAgendaPayload(['category' => 'KKN', 'is_featured' => true]),
    );

    $response->assertRedirect(route('admin.agendas.index'));
    $this->assertDatabaseHas('agendas', [
        'title' => 'Posyandu Lansia Bulan Ini',
        'category' => 'KKN',
        'location' => 'Poskesdes Ngampungan',
        'status' => 'upcoming',
    ]);
});

test('public agenda exposes the other category filter for custom categories', function () {
    Agenda::factory()->create([
        'category' => 'KKN',
        'event_date' => '2026-08-15',
    ]);
    Agenda::factory()->create([
        'category' => 'Kesehatan',
        'event_date' => '2026-08-16',
    ]);

    $this->get(route('agendas.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('agenda/index')
            ->where('otherCategoryLabel', 'Lainnya')
            ->where('categoryOptions', config('village_agenda.categories'))
            ->has('dbAgendas', 2)
            ->where('dbAgendas.0.category', 'KKN'));
});

test('authenticated user can upload supported agenda images', function (string $extension) {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.agendas.store'), validAgendaPayload([
            'image' => fakeAgendaImage($extension),
            'image_alt' => 'Kegiatan warga di balai desa',
        ]))
        ->assertRedirect(route('admin.agendas.index'))
        ->assertSessionHasNoErrors();

    $agenda = Agenda::query()->where('title', 'Posyandu Lansia Bulan Ini')->firstOrFail();
    expect($agenda->image_path)->toStartWith('/storage/agendas/');
    Storage::disk('public')->assertExists(Str::after($agenda->image_path, '/storage/'));

    $this->get(route('agendas.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('agenda/index')
            ->has('dbAgendas', 1)
            ->where('dbAgendas.0.image', $agenda->image_path)
            ->where('dbAgendas.0.imageAlt', 'Kegiatan warga di balai desa'));
})->with(['jpg', 'png']);

test('replacing an agenda image removes the old local file', function () {
    Storage::fake('public');
    Storage::disk('public')->put('agendas/old.jpg', 'old image');
    $user = User::factory()->create();
    $agenda = Agenda::factory()->create([
        'image_path' => '/storage/agendas/old.jpg',
    ]);

    $this->actingAs($user)
        ->post(route('admin.agendas.update', $agenda), validAgendaPayload([
            '_method' => 'put',
            'title' => $agenda->title,
            'image' => fakeAgendaImage('png'),
        ]))
        ->assertRedirect(route('admin.agendas.index'))
        ->assertSessionHasNoErrors();

    $agenda->refresh();
    Storage::disk('public')->assertMissing('agendas/old.jpg');
    Storage::disk('public')->assertExists(Str::after($agenda->image_path, '/storage/'));
});

test('unsupported agenda image formats are rejected', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.agendas.store'), validAgendaPayload([
            'image' => UploadedFile::fake()->create('agenda.gif', 100, 'image/gif'),
        ]))
        ->assertSessionHasErrors('image');

    expect(Agenda::query()->count())->toBe(0);
});

test('authenticated user can delete an agenda item', function () {
    Storage::fake('public');
    Storage::disk('public')->put('agendas/to-delete.jpg', 'agenda image');
    $user = User::factory()->create();
    $agenda = Agenda::factory()->create([
        'image_path' => '/storage/agendas/to-delete.jpg',
    ]);

    $response = $this->actingAs($user)->delete(route('admin.agendas.destroy', $agenda->id));

    $response->assertRedirect(route('admin.agendas.index'));
    $this->assertDatabaseMissing('agendas', [
        'id' => $agenda->id,
    ]);
    Storage::disk('public')->assertMissing('agendas/to-delete.jpg');
});
