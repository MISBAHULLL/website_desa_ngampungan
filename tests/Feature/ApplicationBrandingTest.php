<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('application uses village branding in the document title', function () {
    $this->get('/')
        ->assertOk()
        ->assertSee('<title>Desa Ngampungan</title>', false)
        ->assertDontSee(' - Laravel</title>', false);

    expect(config('app.name'))->toBe('Desa Ngampungan');
});
