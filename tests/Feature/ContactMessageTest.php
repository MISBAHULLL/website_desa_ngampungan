<?php

use App\ContactMessageStatus;
use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Symfony\Component\HttpFoundation\Response;

uses(LazilyRefreshDatabase::class);

function validContactMessagePayload(array $overrides = []): array
{
    return [
        'name' => 'Budi Santoso',
        'contact' => '081234567890',
        'category' => 'service_complaint',
        'message' => 'Mohon informasi tindak lanjut perbaikan saluran air.',
        'consent' => '1',
        'website' => '',
        ...$overrides,
    ];
}

test('a public visitor can store a contact message', function () {
    $response = $this
        ->withServerVariables(['REMOTE_ADDR' => '192.0.2.10'])
        ->withHeader('User-Agent', 'Ngampungan Feature Test')
        ->post(route('contact-messages.store'), validContactMessagePayload());

    $response->assertRedirect()->assertSessionHasNoErrors();

    $message = ContactMessage::query()->sole();

    $this->assertModelExists($message);

    expect($message)
        ->name->toBe('Budi Santoso')
        ->contact->toBe('081234567890')
        ->category->toBe('service_complaint')
        ->status->toBe(ContactMessageStatus::Unread)
        ->ip_address->toBe('192.0.2.10')
        ->user_agent->toBe('Ngampungan Feature Test');
});

test('contact message validation rejects invalid public input', function () {
    $response = $this
        ->from(route('home'))
        ->withServerVariables(['REMOTE_ADDR' => '192.0.2.11'])
        ->post(route('contact-messages.store'), validContactMessagePayload([
            'name' => 'A',
            'contact' => '',
            'category' => 'unknown',
            'message' => 'Pendek',
            'consent' => null,
        ]));

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHasErrors([
            'name',
            'contact',
            'category',
            'message',
            'consent',
        ]);

    expect(ContactMessage::query()->count())->toBe(0);
});

test('the contact form honeypot rejects automated submissions', function () {
    $response = $this
        ->withServerVariables(['REMOTE_ADDR' => '192.0.2.12'])
        ->post(route('contact-messages.store'), validContactMessagePayload([
            'website' => 'https://spam.example',
        ]));

    $response->assertSessionHasErrors('website');

    expect(ContactMessage::query()->count())->toBe(0);
});

test('public contact submissions are rate limited by ip address', function () {
    foreach (range(1, 3) as $submission) {
        $this
            ->withServerVariables(['REMOTE_ADDR' => '192.0.2.13'])
            ->post(route('contact-messages.store'), validContactMessagePayload([
                'message' => "Pesan pengujian rate limit nomor {$submission}.",
            ]))
            ->assertRedirect();
    }

    $this
        ->withServerVariables(['REMOTE_ADDR' => '192.0.2.13'])
        ->post(route('contact-messages.store'), validContactMessagePayload([
            'message' => 'Pesan keempat seharusnya ditolak rate limiter.',
        ]))
        ->assertStatus(Response::HTTP_TOO_MANY_REQUESTS);

    expect(ContactMessage::query()->count())->toBe(3);
});

test('guests cannot access the contact message inbox', function () {
    $this->get(route('admin.contact-messages.index'))
        ->assertRedirect(route('login'));
});

test('verified users can view the paginated contact message inbox', function () {
    $user = User::factory()->create();
    ContactMessage::factory()->count(2)->create();
    ContactMessage::factory()->resolved()->create();

    $this->actingAs($user)
        ->get(route('admin.contact-messages.index', ['status' => 'unread']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/contact-messages/index')
            ->where('activeStatus', 'unread')
            ->has('messages.data', 2)
            ->where('statistics.total', 3)
            ->where('statistics.unread', 2)
            ->where('statistics.resolved', 1));
});

test('verified users can update a contact message status', function () {
    $user = User::factory()->create();
    $message = ContactMessage::factory()->create();

    $this->actingAs($user)
        ->patch(route('admin.contact-messages.update-status', $message), [
            'status' => ContactMessageStatus::Resolved->value,
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $message->refresh();

    expect($message)
        ->status->toBe(ContactMessageStatus::Resolved)
        ->read_at->not->toBeNull()
        ->resolved_at->not->toBeNull();
});

test('the homepage exposes the stored contact form and location map', function () {
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));
    $inboxSource = file_get_contents(resource_path('js/pages/admin/contact-messages/index.tsx'));

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('action={storeContactMessage()}')
        ->toContain('resetOnSuccess')
        ->toContain('Peta lokasi Kantor Desa Ngampungan')
        ->toContain('www.openstreetmap.org/export/embed.html')
        ->toContain('Pesan berhasil disimpan')
        ->not->toContain('Simulasi berhasil. Pesan belum');

    expect($inboxSource)
        ->not->toBeFalse()
        ->toContain('Pesan Masuk')
        ->toContain('updateStatus.form')
        ->toContain('Pagination pesan')
        ->toContain('Tandai Selesai');
});
