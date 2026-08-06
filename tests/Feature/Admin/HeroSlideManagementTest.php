<?php

use App\Models\HeroSlide;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(LazilyRefreshDatabase::class);

function fakeHeroImage(string $name): UploadedFile
{
    $png = base64_decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        true,
    );

    return UploadedFile::fake()->createWithContent($name, $png ?: '');
}

test('admin can create a hero slide with image and CTA buttons', function () {
    Storage::fake('public');

    $this->actingAs(User::factory()->create())
        ->post(route('admin.hero-slides.store'), [
            'title' => 'Pelayanan Warga,',
            'subtitle' => 'Lebih Mudah.',
            'description' => 'Akses pelayanan administrasi Desa Ngampungan secara cepat dan transparan.',
            'primary_cta_text' => 'Ajukan Surat',
            'primary_cta_url' => '/layanan',
            'secondary_cta_text' => 'Lacak Status',
            'secondary_cta_url' => '/lacak-pengajuan',
            'background_image' => fakeHeroImage('pelayanan.png'),
            'order' => 2,
            'is_active' => true,
        ])
        ->assertValid()
        ->assertRedirect(route('admin.hero-slides.index'));

    $slide = HeroSlide::query()->firstOrFail();

    expect($slide)
        ->title->toBe('Pelayanan Warga,')
        ->primary_cta_text->toBe('Ajukan Surat')
        ->primary_cta_url->toBe('/layanan')
        ->is_active->toBeTrue();

    Storage::disk('public')->assertExists($slide->background_image);
});

test('admin can open and update a hero slide using multipart method spoofing', function () {
    Storage::fake('public');
    Storage::disk('public')->put('hero-slides/old.jpg', 'old-image');

    $slide = HeroSlide::factory()->create([
        'background_image' => 'hero-slides/old.jpg',
    ]);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.hero-slides.edit', $slide))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/hero-slides/create')
            ->where('slide.id', $slide->id)
            ->where('slide.primaryCtaText', 'Lihat Profil'));

    $this->actingAs(User::factory()->create())
        ->post(route('admin.hero-slides.update', $slide), [
            '_method' => 'PUT',
            'title' => 'Potensi Desa,',
            'subtitle' => 'Tumbuh Bersama.',
            'description' => 'Kenali produk, pertanian, dan usaha unggulan warga Desa Ngampungan.',
            'primary_cta_text' => 'Jelajahi Potensi',
            'primary_cta_url' => '/potensi',
            'secondary_cta_text' => 'Profil Desa',
            'secondary_cta_url' => '/profil-desa',
            'background_image' => fakeHeroImage('potensi.png'),
            'remove_background_image' => false,
            'order' => 1,
            'is_active' => true,
        ])
        ->assertValid()
        ->assertRedirect(route('admin.hero-slides.index'));

    $slide->refresh();

    expect($slide)
        ->title->toBe('Potensi Desa,')
        ->primary_cta_text->toBe('Jelajahi Potensi')
        ->primary_cta_url->toBe('/potensi')
        ->order->toBe(1);

    Storage::disk('public')->assertMissing('hero-slides/old.jpg');
    Storage::disk('public')->assertExists($slide->background_image);
});

test('CTA requires a safe destination and matching button text', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.hero-slides.store'), [
            'title' => 'Informasi Desa',
            'description' => 'Informasi terbaru untuk warga.',
            'primary_cta_text' => 'Buka Informasi',
            'primary_cta_url' => 'javascript:alert(1)',
            'secondary_cta_text' => '',
            'secondary_cta_url' => '/layanan',
            'order' => 1,
            'is_active' => true,
        ])
        ->assertInvalid([
            'primary_cta_url',
            'secondary_cta_text',
        ]);
});

test('homepage receives only active hero slides in configured order', function () {
    HeroSlide::factory()->create([
        'title' => 'Slide Kedua',
        'order' => 2,
    ]);
    HeroSlide::factory()->create([
        'title' => 'Slide Nonaktif',
        'order' => 0,
        'is_active' => false,
    ]);
    HeroSlide::factory()->create([
        'title' => 'Slide Pertama',
        'primary_cta_text' => 'Kenali Desa',
        'primary_cta_url' => '/profil-desa',
        'order' => 1,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('heroSlides', 2)
            ->where('heroSlides.0.title', 'Slide Pertama')
            ->where('heroSlides.0.primaryCtaText', 'Kenali Desa')
            ->where('heroSlides.0.primaryCtaUrl', '/profil-desa')
            ->where('heroSlides.1.title', 'Slide Kedua'));
});

test('legacy tracking CTA redirects to the current tracking page', function () {
    $this->get('/layanan/lacak')->assertRedirect('/lacak-pengajuan');
});

test('deleting a hero slide also deletes its stored image', function () {
    Storage::fake('public');
    Storage::disk('public')->put('hero-slides/delete-me.jpg', 'image');

    $slide = HeroSlide::factory()->create([
        'background_image' => 'hero-slides/delete-me.jpg',
    ]);

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.hero-slides.destroy', $slide))
        ->assertRedirect();

    $this->assertModelMissing($slide);
    Storage::disk('public')->assertMissing('hero-slides/delete-me.jpg');
});
