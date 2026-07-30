<?php

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('unauthenticated users cannot access admin announcement index', function () {
    $response = $this->get('/dashboard/pengumuman');

    $response->assertRedirect('/login');
});

test('authenticated users can view admin announcement index', function () {
    $user = User::factory()->create();
    Announcement::factory()->create(['title' => 'Pengumuman Penting Tani']);

    $response = $this->actingAs($user)->get('/dashboard/pengumuman');

    $response->assertStatus(200);
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

    $response = $this->actingAs($user)->put("/dashboard/pengumuman/{$announcement->id}", [
        'title' => 'Judul Pengumuman Diperbarui',
        'summary' => 'Ringkasan pengumuman yang baru diperbarui.',
        'content' => ['Paragraf revisi.'],
        'priority' => 'emergency',
        'status' => 'active',
        'is_pinned' => false,
        'starts_at' => now()->toDateTimeString(),
    ]);

    $response->assertRedirect('/dashboard/pengumuman');

    $this->assertDatabaseHas('announcements', [
        'id' => $announcement->id,
        'title' => 'Judul Pengumuman Diperbarui',
        'priority' => 'emergency',
    ]);
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
