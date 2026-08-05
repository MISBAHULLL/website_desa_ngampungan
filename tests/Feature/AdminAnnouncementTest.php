<?php

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('unauthenticated users cannot access admin announcement index', function () {
    $response = $this->get('/dashboard/pengumuman');

    $response->assertRedirect('/login');
});

test('authenticated users can view admin announcement index', function () {
    $user = User::factory()->create();
    Announcement::factory()->create(['title' => 'Pengumuman Penting Tani']);

    $response = $this->actingAs($user)->get('/dashboard/pengumuman');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/announcements/index'));
});

test('authenticated users can view edit announcement page with its current values', function () {
    $user = User::factory()->create();
    $announcement = Announcement::factory()->create([
        'title' => 'Jadwal Pelayanan Lama',
    ]);

    $this->actingAs($user)
        ->get(route('admin.announcements.edit', $announcement))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/announcements/edit')
            ->where('announcement.id', $announcement->id)
            ->where('announcement.title', 'Jadwal Pelayanan Lama'));
});

test('authenticated users can view create announcement page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard/pengumuman/create');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/announcements/create'));
});

test('authenticated users can create a new announcement', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/dashboard/pengumuman', [
        'title' => 'Pengumuman Pelatihan Digital Desa',
        'summary' => 'Ringkasan pengumuman pelatihan digital gratis untuk seluruh warga.',
        'content' => ['Paragraf 1 penjelasan pelatihan.', 'Paragraf 2 pendaftaran.'],
        'priority' => 'important',
        'status' => 'active',
        'is_pinned' => true,
        'starts_at' => now()->toDateTimeString(),
        'ends_at' => now()->addDays(7)->toDateTimeString(),
    ]);

    $response->assertRedirect('/dashboard/pengumuman');

    $this->assertDatabaseHas('announcements', [
        'title' => 'Pengumuman Pelatihan Digital Desa',
        'priority' => 'important',
        'is_pinned' => true,
    ]);
});

test('announcement validation requires title and summary within limits', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/dashboard/pengumuman', [
        'title' => str_repeat('a', 256), // > 255
        'summary' => '', // required
        'priority' => 'normal',
        'status' => 'active',
        'starts_at' => now()->toDateTimeString(),
    ]);

    $response->assertSessionHasErrors(['title', 'summary']);
});

test('authenticated users can update an existing announcement', function () {
    $user = User::factory()->create();
    $announcement = Announcement::factory()->create([
        'title' => 'Judul Pengumuman Lama',
        'priority' => 'normal',
    ]);
    $updatedStartsAt = now()->addDays(5)->startOfHour();
    $updatedEndsAt = now()->addDays(12)->startOfHour();

    $response = $this->actingAs($user)->put("/dashboard/pengumuman/{$announcement->id}", [
        'title' => 'Judul Pengumuman Diperbarui',
        'summary' => 'Ringkasan pengumuman yang baru diperbarui.',
        'content' => ['Paragraf revisi.'],
        'priority' => 'emergency',
        'status' => 'active',
        'is_pinned' => false,
        'starts_at' => $updatedStartsAt->toDateTimeString(),
        'ends_at' => $updatedEndsAt->toDateTimeString(),
    ]);

    $response->assertRedirect('/dashboard/pengumuman');

    $this->assertDatabaseHas('announcements', [
        'id' => $announcement->id,
        'title' => 'Judul Pengumuman Diperbarui',
        'priority' => 'emergency',
        'starts_at' => $updatedStartsAt->toDateTimeString(),
        'ends_at' => $updatedEndsAt->toDateTimeString(),
    ]);

    $this->get(route('announcements.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('dbAnnouncements.0.title', 'Judul Pengumuman Diperbarui')
            ->where('dbAnnouncements.0.startsAt', $updatedStartsAt->format('Y-m-d'))
            ->where('dbAnnouncements.0.endsAt', $updatedEndsAt->format('Y-m-d')));
});

test('all active announcements are sent to the homepage', function () {
    Announcement::factory()->count(2)->create([
        'status' => 'active',
        'starts_at' => now(),
        'ends_at' => now()->addWeek(),
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('dbAnnouncements', 2));
});

test('an active announcement with a past end date is archived automatically', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('admin.announcements.store'), [
        'title' => 'Pengumuman yang Sudah Berakhir',
        'summary' => 'Pengumuman ini memiliki periode yang sudah selesai.',
        'content' => ['Informasi telah selesai dilaksanakan.'],
        'priority' => 'normal',
        'status' => 'active',
        'is_pinned' => false,
        'starts_at' => now()->subDays(3)->toDateTimeString(),
        'ends_at' => now()->subDay()->toDateTimeString(),
    ])->assertRedirect(route('admin.announcements.index'));

    $this->assertDatabaseHas('announcements', [
        'title' => 'Pengumuman yang Sudah Berakhir',
        'status' => 'archived',
    ]);
});

test('the edit form sends its controlled values as the update payload', function () {
    $source = file_get_contents(resource_path('js/pages/admin/announcements/edit.tsx'));

    expect($source)
        ->toContain('action={announcementUpdate(announcement.id)}')
        ->toContain('transform={() => ({')
        ->not->toContain('announcementUpdate.form(announcement.id, {');
});

test('authenticated users can toggle pinned status of announcement', function () {
    $user = User::factory()->create();
    $announcement = Announcement::factory()->create(['is_pinned' => false]);

    $response = $this->actingAs($user)->patch("/dashboard/pengumuman/{$announcement->id}/toggle-pinned");

    $response->assertRedirect();
    $this->assertTrue($announcement->fresh()->is_pinned);
});

test('authenticated users can delete an announcement', function () {
    $user = User::factory()->create();
    $announcement = Announcement::factory()->create();

    $response = $this->actingAs($user)->delete("/dashboard/pengumuman/{$announcement->id}");

    $response->assertRedirect('/dashboard/pengumuman');
    $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
});
