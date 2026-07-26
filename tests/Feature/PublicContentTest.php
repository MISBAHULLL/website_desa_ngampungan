<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the public news index renders its Inertia page', function () {
    $this->get(route('news.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('news/index'));
});

test('the public news detail passes the dummy slug to its Inertia page', function () {
    $slug = 'panen-raya-padi-organik-capai-target';

    $this->get(route('news.show', $slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('news/show')
            ->where('slug', $slug));
});

test('the public announcement index renders its Inertia page', function () {
    $this->get(route('announcements.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('announcements/index'));
});

test('the public transparency index renders its Inertia page', function () {
    $this->get(route('transparency.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('transparency/index'));
});

test('the public potential directory accepts a supported category filter', function () {
    $this->get(route('potentials.index', ['category' => 'umkm']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('potentials/index')
            ->where('initialCategory', 'umkm'));
});

test('the public potential directory falls back to all for an unknown category', function () {
    $this->get(route('potentials.index', ['category' => 'unknown']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('potentials/index')
            ->where('initialCategory', 'all'));
});

test('the public potential detail passes the dummy slug to its Inertia page', function () {
    $slug = 'anyaman-bambu-maju-karya';

    $this->get(route('potentials.show', $slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('potentials/show')
            ->where('slug', $slug));
});

test('the village potential directory exposes listing and profile information', function () {
    $indexSource = file_get_contents(resource_path('js/pages/potentials/index.tsx'));
    $showSource = file_get_contents(resource_path('js/pages/potentials/show.tsx'));
    $cardSource = file_get_contents(resource_path('js/components/village-potential-card.tsx'));
    $carouselSource = file_get_contents(resource_path('js/components/village-potential-carousel.tsx'));

    expect($indexSource)
        ->not->toBeFalse()
        ->toContain('Direktori Potensi Desa')
        ->toContain('Cari nama, produk, atau pengelola')
        ->toContain('villagePotentialCategories.map')
        ->toContain('VillagePotentialCard')
        ->toContain('initialCategory');

    expect($showSource)
        ->not->toBeFalse()
        ->toContain('Informasi pengelola')
        ->toContain('Produk dan Layanan')
        ->toContain('Peta lokasi usaha')
        ->toContain('Peta simulasi')
        ->toContain('Kontak belum aktif')
        ->toContain('aria-disabled="true"');

    expect($cardSource)
        ->not->toBeFalse()
        ->toContain('potentialShow(entry.slug)')
        ->toContain('src={entry.image}')
        ->toContain('loading="lazy"')
        ->toContain('onError={() => setIsImageUnavailable(true)}')
        ->toContain('Foto ilustrasi')
        ->toContain('Lihat profil')
        ->toContain('viewTransition');

    expect($carouselSource)
        ->not->toBeFalse()
        ->toContain("type CarouselPosition = 'active' | 'previous' | 'next' | 'hidden'")
        ->toContain('perspective-[1400px]')
        ->toContain('translateX(-52%) scale(0.78) rotateY(10deg)')
        ->toContain('aria-roledescription="carousel"')
        ->toContain('onPointerDown={handlePointerDown}')
        ->toContain("event.key === 'ArrowRight'")
        ->toContain('Kartu potensi berikutnya')
        ->toContain('potentialShow(entry.slug)');
});

test('the homepage exposes an accessible APBDes summary', function () {
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));
    $transparencyDataSource = file_get_contents(resource_path('js/lib/dummy-transparency.ts'));
    $transparencyPageSource = file_get_contents(resource_path('js/pages/transparency/index.tsx'));

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('id="transparansi"')
        ->toContain('dummyApbdesSummary')
        ->toContain('Ringkasan APBDes')
        ->toContain('Lihat Transparansi Lengkap')
        ->toContain('transparencyIndex()')
        ->toContain('role="progressbar"')
        ->toContain('aria-valuenow')
        ->toContain('Data simulasi tampilan')
        ->not->toContain('Transparansi Dana Desa');

    expect($transparencyDataSource)
        ->not->toBeFalse()
        ->toContain('Pendapatan Desa')
        ->toContain('Belanja Desa')
        ->toContain('Pembiayaan Neto')
        ->toContain('Perkiraan SILPA')
        ->toContain('allocations')
        ->toContain('dummyPublicDocuments')
        ->toContain('Laporan Realisasi APBDes Semester I Tahun 2026')
        ->toContain('APBDes Desa Ngampungan Tahun Anggaran 2026')
        ->toContain('Peraturan Desa tentang Penetapan APBDes Tahun 2026');

    expect($transparencyPageSource)
        ->not->toBeFalse()
        ->toContain('Transparansi Desa')
        ->toContain('Alokasi per Bidang')
        ->toContain('Dokumen Publik Terbaru')
        ->toContain('dummyPublicDocuments.map')
        ->toContain('aria-disabled="true"')
        ->toContain('File belum tersedia')
        ->toContain('role="progressbar"')
        ->not->toContain('Dokumen Publik Belum Tersedia');
});

test('the homepage presents news and announcements as distinct information sections', function () {
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));
    $newsIndexSource = file_get_contents(resource_path('js/pages/news/index.tsx'));
    $newsShowSource = file_get_contents(resource_path('js/pages/news/show.tsx'));
    $announcementSource = file_get_contents(resource_path('js/pages/announcements/index.tsx'));

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('Berita Utama')
        ->toContain('Berita Lainnya')
        ->toContain('Pengumuman Desa')
        ->toContain('id="pengumuman"')
        ->toContain('activeDummyAnnouncements')
        ->toContain('isFeaturedImageUnavailable')
        ->not->toContain('contentTab')
        ->not->toContain('Data dummy frontend')
        ->not->toContain('homepage-news-tab')
        ->not->toContain('homepage-announcement-tab')
        ->not->toContain('newsItems.map');

    expect($newsIndexSource)
        ->not->toBeFalse()
        ->toContain('Cari berdasarkan judul')
        ->toContain('Filter kategori')
        ->toContain('Pagination berita')
        ->toContain('articlesPerPage');

    expect($newsShowSource)
        ->not->toBeFalse()
        ->toContain('findDummyNewsArticle')
        ->toContain('Artikel Terkait')
        ->toContain('og:image');

    expect($announcementSource)
        ->not->toBeFalse()
        ->toContain('Pengumuman Aktif')
        ->toContain('Arsip Pengumuman')
        ->toContain('aria-selected');
});
