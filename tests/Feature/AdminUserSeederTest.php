<?php

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(LazilyRefreshDatabase::class);

test('the admin seeder migrates the legacy account and replaces its default password', function () {
    config()->set('village_admin.name', 'Admin Desa Ngampungan');
    config()->set('village_admin.email', 'admin@desangampungan.id');
    config()->set('village_admin.password', 'Contoh-Sandi/Kuat//2026!');
    config()->set('village_admin.legacy_emails', ['test@example.com']);

    $legacyAdmin = User::factory()->nonAdmin()->create([
        'name' => 'Admin Lama',
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $this->seed(AdminUserSeeder::class);

    $admin = User::query()->where('email', 'admin@desangampungan.id')->sole();

    expect($admin)
        ->id->toBe($legacyAdmin->id)
        ->name->toBe('Admin Desa Ngampungan')
        ->is_admin->toBeTrue()
        ->email_verified_at->not->toBeNull()
        ->and(Hash::check('Contoh-Sandi/Kuat//2026!', $admin->password))->toBeTrue()
        ->and(User::query()->where('email', 'test@example.com')->exists())->toBeFalse();
});

test('rerunning the admin seeder without a configured password keeps the current password', function () {
    $admin = User::factory()->create([
        'email' => 'admin@desangampungan.id',
        'password' => 'Sandi-Yang-Tetap!2026',
    ]);
    $passwordHash = $admin->password;

    config()->set('village_admin.email', 'admin@desangampungan.id');
    config()->set('village_admin.password');

    $this->seed(AdminUserSeeder::class);

    expect($admin->fresh()?->password)->toBe($passwordHash);
});

test('the admin seeder refuses to create or migrate an account without a secure password', function () {
    config()->set('village_admin.email', 'admin@desangampungan.id');
    config()->set('village_admin.password');

    User::factory()->create(['email' => 'test@example.com']);

    expect(fn () => $this->seed(AdminUserSeeder::class))
        ->toThrow(RuntimeException::class, 'VILLAGE_ADMIN_PASSWORD');
});
