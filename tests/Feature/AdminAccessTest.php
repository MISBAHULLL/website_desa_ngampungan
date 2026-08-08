<?php

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;

uses(LazilyRefreshDatabase::class);

test('guests are redirected to login from the administration dashboard', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('verified non admin users cannot access the administration dashboard', function () {
    $user = User::factory()->nonAdmin()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertForbidden();
});

test('unverified admins must verify their email before accessing the dashboard', function () {
    $admin = User::factory()->unverified()->create();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertRedirect(route('verification.notice'));
});

test('verified admins can access the administration dashboard', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk();
});
