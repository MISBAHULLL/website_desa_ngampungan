<?php

use App\Models\User;
use App\Models\VillageLeader;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(LazilyRefreshDatabase::class);

function fakeVillageLeaderImage(string $name): UploadedFile
{
    $png = base64_decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        true,
    );

    return UploadedFile::fake()->createWithContent($name, $png ?: '');
}

test('admin dashboard receives active leader for both content forms', function () {
    $leader = VillageLeader::factory()->create([
        'name' => 'Rohan, S.Sos.',
        'welcome_title' => 'Bersama Melayani Warga',
    ]);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.village-leaders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/village-leaders/index')
            ->where('activeLeader.id', $leader->id)
            ->where('activeLeader.name', 'Rohan, S.Sos.')
            ->where('activeLeader.welcomeTitle', 'Bersama Melayani Warga')
            ->where('activeLeader.startedAt', $leader->started_at->format('Y-m-d')));
});

test('profile update replaces photo without changing welcome content', function () {
    Storage::fake('public');
    Storage::disk('public')->put('village-leaders/old.png', 'old-photo');

    $leader = VillageLeader::factory()->create([
        'photo' => 'village-leaders/old.png',
        'welcome_title' => 'Sambutan yang tetap',
        'welcome_message' => 'Isi sambutan yang tidak boleh berubah.',
    ]);

    $this->actingAs(User::factory()->create())
        ->post(route('admin.village-leaders.update', $leader), [
            '_method' => 'PATCH',
            'name' => 'Rohan, S.Sos.',
            'position' => 'Kepala Desa Ngampungan',
            'photo' => fakeVillageLeaderImage('rohan.png'),
            'remove_photo' => false,
            'started_at' => '2022-01-01',
            'ended_at' => null,
            'is_active' => true,
        ])
        ->assertValid()
        ->assertRedirect(route('admin.village-leaders.index'));

    $leader->refresh();

    expect($leader)
        ->name->toBe('Rohan, S.Sos.')
        ->welcome_title->toBe('Sambutan yang tetap')
        ->welcome_message->toBe('Isi sambutan yang tidak boleh berubah.');

    Storage::disk('public')->assertMissing('village-leaders/old.png');
    Storage::disk('public')->assertExists($leader->photo);
});

test('welcome update does not change leader identity or photo', function () {
    $leader = VillageLeader::factory()->create([
        'name' => 'Nama Kepala Desa',
        'photo' => 'village-leaders/profile.png',
    ]);

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.village-leaders.update-welcome', $leader), [
            'welcome_title' => 'Pelayanan Terbuka untuk Semua',
            'welcome_message' => "Salam hangat untuk warga.\n\nMari membangun desa bersama.",
            'vision' => 'Desa mandiri dan sejahtera.',
            'mission' => 'Pelayanan yang cepat dan transparan.',
        ])
        ->assertValid()
        ->assertRedirect(route('admin.village-leaders.index'));

    $leader->refresh();

    expect($leader)
        ->name->toBe('Nama Kepala Desa')
        ->photo->toBe('village-leaders/profile.png')
        ->welcome_title->toBe('Pelayanan Terbuka untuk Semua')
        ->welcome_message->toContain('Mari membangun desa bersama.');
});

test('public homepage and government page receive the same active leader content', function () {
    VillageLeader::factory()->create([
        'name' => 'Kepala Desa Lama',
        'is_active' => false,
    ]);
    VillageLeader::factory()->create([
        'name' => 'Rohan, S.Sos.',
        'position' => 'Kepala Desa Ngampungan',
        'welcome_title' => 'Dekat dengan Warga',
        'welcome_message' => 'Isi sambutan terbaru dari admin.',
        'started_at' => '2022-01-01',
        'ended_at' => null,
        'is_active' => true,
    ]);

    $assertLeader = fn (Assert $page) => $page
        ->where('villageLeader.name', 'Rohan, S.Sos.')
        ->where('villageLeader.welcomeTitle', 'Dekat dengan Warga')
        ->where('villageLeader.welcomeMessage', 'Isi sambutan terbaru dari admin.')
        ->where('villageLeader.period', '2022–sekarang');

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $assertLeader(
            $page->component('welcome'),
        ));

    $this->get(route('government.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $assertLeader(
            $page->component('government/index'),
        ));
});

test('profile and welcome forms validate their own fields independently', function () {
    $leader = VillageLeader::factory()->create();
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->patch(route('admin.village-leaders.update', $leader), [
            'name' => '',
            'position' => '',
            'started_at' => '',
            'is_active' => true,
        ])
        ->assertInvalid(['name', 'position', 'started_at'])
        ->assertValid(['welcome_title', 'welcome_message']);

    $this->actingAs($admin)
        ->patch(route('admin.village-leaders.update-welcome', $leader), [
            'welcome_title' => '',
            'welcome_message' => '',
        ])
        ->assertInvalid(['welcome_title', 'welcome_message'])
        ->assertValid(['name', 'position', 'started_at']);
});
