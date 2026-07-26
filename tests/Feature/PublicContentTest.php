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
