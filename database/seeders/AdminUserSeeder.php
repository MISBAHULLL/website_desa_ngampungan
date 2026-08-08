<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $name = config('village_admin.name');
        $email = config('village_admin.email');
        $password = config('village_admin.password');
        $legacyEmails = config('village_admin.legacy_emails', []);

        if (! is_string($name) || trim($name) === '') {
            throw new RuntimeException('VILLAGE_ADMIN_NAME tidak valid.');
        }

        if (! is_string($email) || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new RuntimeException('VILLAGE_ADMIN_EMAIL tidak valid.');
        }

        if (! is_array($legacyEmails)) {
            throw new RuntimeException('Konfigurasi legacy email admin tidak valid.');
        }

        $admin = User::query()->where('email', $email)->first();

        if ($admin === null) {
            $admin = User::query()
                ->whereIn('email', $legacyEmails)
                ->oldest('id')
                ->first();
        }

        $requiresNewPassword = $admin === null || $admin->email !== $email;
        $hasConfiguredPassword = is_string($password) && $password !== '';

        if ($requiresNewPassword && ! $hasConfiguredPassword) {
            throw new RuntimeException(
                'Isi VILLAGE_ADMIN_PASSWORD dengan password kuat sebelum menjalankan AdminUserSeeder.',
            );
        }

        DB::transaction(function () use (
            $admin,
            $email,
            $hasConfiguredPassword,
            $legacyEmails,
            $name,
            $password,
        ): void {
            $admin ??= new User;

            $attributes = [
                'name' => trim($name),
                'email' => $email,
                'email_verified_at' => $admin->email_verified_at ?? now(),
                'is_admin' => true,
            ];

            if ($hasConfiguredPassword) {
                $attributes['password'] = $password;
                $attributes['remember_token'] = null;
            }

            $admin->forceFill($attributes)->save();

            User::query()
                ->whereKeyNot($admin->getKey())
                ->whereIn('email', $legacyEmails)
                ->update(['is_admin' => false]);

            if ($hasConfiguredPassword && Schema::hasTable((string) config('session.table', 'sessions'))) {
                DB::table((string) config('session.table', 'sessions'))
                    ->where('user_id', $admin->getKey())
                    ->delete();
            }
        });
    }
}
