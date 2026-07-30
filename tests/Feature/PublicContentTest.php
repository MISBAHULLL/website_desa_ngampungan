<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('the public village profile renders its Inertia page with a canonical URL', function () {
    $this->get(route('profile.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('profile/index')
            ->where('canonicalUrl', route('profile.index')));
});

test('the village profile page exposes profile sections, breadcrumb, and SEO metadata', function () {
    $profilePageSource = file_get_contents(resource_path('js/pages/profile/index.tsx'));
    $profileDataSource = file_get_contents(resource_path('js/lib/dummy-village-profile.ts'));
    $administrativeMapSource = file_get_contents(resource_path('js/components/village-administrative-map.tsx'));
    $demographicExplorerSource = file_get_contents(resource_path('js/components/village-demographic-explorer.tsx'));
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));
    $appSource = file_get_contents(resource_path('js/app.tsx'));

    expect($profilePageSource)
        ->not->toBeFalse()
        ->toContain('head-key="description"')
        ->toContain('head-key="canonical"')
        ->toContain('property="og:title"')
        ->toContain('id="selayang-pandang"')
        ->toContain('id="visi-misi"')
        ->toContain('id="sejarah-desa"')
        ->toContain('id="data-wilayah"')
        ->toContain('id="pembagian-wilayah"')
        ->toContain('id="penggunaan-lahan"')
        ->toContain('id="peta-administratif"')
        ->toContain('id="demografi"')
        ->toContain('villageOfficialIdentity.map')
        ->toContain('boundaries.map')
        ->toContain('hamlets.map')
        ->toContain('landUse.map')
        ->toContain('VillageAdministrativeMap')
        ->toContain('VillageDemographicExplorer')
        ->toContain('Data Wilayah Terintegrasi Backend');

    expect($profileDataSource)
        ->not->toBeFalse()
        ->toContain('Kode Desa')
        ->toContain('Tahun Pembentukan')
        ->toContain('dummyAdministrativeDivisions')
        ->toContain('dummyLandUseComposition')
        ->toContain("key: 'gender'")
        ->toContain("key: 'age'")
        ->toContain("key: 'education'")
        ->toContain("key: 'occupation'")
        ->toContain("key: 'religion'")
        ->toContain("key: 'residency'");

    expect($administrativeMapSource)
        ->not->toBeFalse()
        ->toContain('role="img"')
        ->toContain('Peta administratif simulasi Desa Ngampungan')
        ->toContain('Bukan peta ukur')
        ->toContain('data geospasial resmi');

    expect($demographicExplorerSource)
        ->not->toBeFalse()
        ->toContain('role="tablist"')
        ->toContain('role="tab"')
        ->toContain('role="tabpanel"')
        ->toContain('aria-selected')
        ->toContain('role="progressbar"');

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('villageProfileIndex.url()')
        ->toContain('#selayang-pandang')
        ->toContain('#visi-misi')
        ->toContain('#sejarah-desa')
        ->toContain('#data-wilayah');

    expect($appSource)
        ->not->toBeFalse()
        ->toContain("name.startsWith('profile/')");
});

test('the public village government renders its Inertia page with a canonical URL', function () {
    $this->get(route('government.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('government/index')
            ->where('canonicalUrl', route('government.index')));
});

test('the public village official detail passes its slug and canonical URL', function () {
    $slug = 'kusnadi-s-sos';

    $this->get(route('government.officials.show', $slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('government/show')
            ->where('slug', $slug)
            ->where('canonicalUrl', route('government.officials.show', $slug)));
});

test('the village government module exposes organization, officials, institutions, and detail profiles', function () {
    $governmentIndexSource = file_get_contents(resource_path('js/pages/government/index.tsx'));
    $governmentShowSource = file_get_contents(resource_path('js/pages/government/show.tsx'));
    $governmentDataSource = file_get_contents(resource_path('js/lib/dummy-village-government.ts'));
    $organizationChartSource = file_get_contents(resource_path('js/components/village-organization-chart.tsx'));
    $officialCardSource = file_get_contents(resource_path('js/components/village-official-card.tsx'));
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));
    $appSource = file_get_contents(resource_path('js/app.tsx'));

    expect($governmentIndexSource)
        ->not->toBeFalse()
        ->toContain('head-key="canonical"')
        ->toContain('aria-label="Breadcrumb"')
        ->toContain('id="kepala-desa"')
        ->toContain('id="struktur-organisasi"')
        ->toContain('id="perangkat-desa"')
        ->toContain('id="lembaga-desa"')
        ->toContain('VillageOrganizationChart')
        ->toContain('VillageOfficialCard')
        ->toContain('officialFilters.map')
        ->toContain('dummyVillageInstitutions.map')
        ->toContain('Data simulasi frontend');

    expect($governmentShowSource)
        ->not->toBeFalse()
        ->toContain('findDummyVillageOfficial')
        ->toContain('Profil perangkat tidak ditemukan')
        ->toContain('Tugas dan Tanggung Jawab')
        ->toContain('Pendidikan dan Riwayat Jabatan')
        ->toContain('Fokus Pelayanan')
        ->toContain('Perangkat Terkait')
        ->toContain('<title>{`${official.name} - ${official.position}`}</title>')
        ->toContain('head-key="canonical"');

    expect($governmentDataSource)
        ->not->toBeFalse()
        ->toContain('dummyVillageOfficials')
        ->toContain('dummyVillageInstitutions')
        ->toContain("position: 'Kepala Desa'")
        ->toContain("position: 'Sekretaris Desa'")
        ->toContain("position: 'Kasi Pemerintahan'")
        ->toContain("acronym: 'BPD'")
        ->toContain("acronym: 'PKK'")
        ->toContain('findDummyVillageOfficial');

    expect($organizationChartSource)
        ->not->toBeFalse()
        ->toContain('Bagan struktur organisasi Pemerintah Desa Ngampungan')
        ->toContain('officialShow(official.slug)')
        ->toContain('Pelaksana Kewilayahan');

    expect($officialCardSource)
        ->not->toBeFalse()
        ->toContain('officialShow(official.slug)')
        ->toContain('Lihat profil')
        ->toContain('Data simulasi');

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('governmentIndex.url()')
        ->toContain('#kepala-desa')
        ->toContain('#struktur-organisasi')
        ->toContain('#perangkat-desa')
        ->toContain('#lembaga-desa');

    expect($appSource)
        ->not->toBeFalse()
        ->toContain("name.startsWith('government/')");
});

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

test('the public agenda index renders its Inertia page with a canonical URL', function () {
    $this->get(route('agendas.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('agenda/index')
            ->where('canonicalUrl', route('agendas.index')));
});

test('the public gallery index renders its Inertia page with a canonical URL', function () {
    $this->get(route('gallery.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('gallery/index')
            ->where('canonicalUrl', route('gallery.index')));
});

test('the agenda and gallery modules expose filters, inline details, and an accessible lightbox', function () {
    $agendaPageSource = file_get_contents(resource_path('js/pages/agenda/index.tsx'));
    $agendaDataSource = file_get_contents(resource_path('js/lib/dummy-village-agendas.ts'));
    $agendaCardSource = file_get_contents(resource_path('js/components/village-agenda-card.tsx'));
    $galleryPageSource = file_get_contents(resource_path('js/pages/gallery/index.tsx'));
    $galleryDataSource = file_get_contents(resource_path('js/lib/dummy-village-gallery.ts'));
    $galleryLightboxSource = file_get_contents(resource_path('js/components/village-gallery-lightbox.tsx'));
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));
    $publicShellSource = file_get_contents(resource_path('js/components/public-page-shell.tsx'));
    $appSource = file_get_contents(resource_path('js/app.tsx'));

    expect($agendaPageSource)
        ->not->toBeFalse()
        ->toContain('head-key="canonical"')
        ->toContain('aria-label="Breadcrumb"')
        ->toContain('role="tablist"')
        ->toContain('agendaCategories.map')
        ->toContain('VillageAgendaCard')
        ->toContain('data simulasi');

    expect($agendaDataSource)
        ->not->toBeFalse()
        ->toContain('dummyVillageAgendas')
        ->toContain("status: 'upcoming'")
        ->toContain("status: 'completed'")
        ->toContain('featuredDummyVillageAgenda');

    expect($agendaCardSource)
        ->not->toBeFalse()
        ->toContain('aria-expanded={isExpanded}')
        ->toContain('Lihat rincian')
        ->toContain('agenda.contact');

    expect($galleryPageSource)
        ->not->toBeFalse()
        ->toContain('head-key="canonical"')
        ->toContain('aria-label="Breadcrumb"')
        ->toContain('dummyVillageGalleryCategories.map')
        ->toContain('VillageGalleryLightbox')
        ->toContain('Data simulasi frontend');

    expect($galleryDataSource)
        ->not->toBeFalse()
        ->toContain('dummyVillageGalleryPhotos')
        ->toContain('dummyVillageGalleryCategories')
        ->toContain("category: 'Kegiatan Desa'")
        ->toContain("category: 'Pembangunan'")
        ->toContain("category: 'UMKM'")
        ->toContain("category: 'Alam & Pertanian'");

    expect($galleryLightboxSource)
        ->not->toBeFalse()
        ->toContain('role="dialog"')
        ->toContain('aria-modal="true"')
        ->toContain("event.key === 'Escape'")
        ->toContain("event.key === 'ArrowLeft'")
        ->toContain("event.key === 'ArrowRight'");

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('agendasIndex.url()')
        ->toContain('galleryIndex.url()');

    expect($publicShellSource)
        ->not->toBeFalse()
        ->toContain('PublicInformationNavigation')
        ->toContain("section: 'agenda'")
        ->toContain("section: 'gallery'");

    expect($appSource)
        ->not->toBeFalse()
        ->toContain("name.startsWith('agenda/')")
        ->toContain("name.startsWith('gallery/')");
});

test('the public service directory accepts a supported category filter', function () {
    $this->get(route('services.index', ['category' => 'population']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/index')
            ->where('initialCategory', 'population')
            ->where('canonicalUrl', route('services.index')));
});

test('the public service directory falls back to all for an unknown category', function () {
    $this->get(route('services.index', ['category' => 'unknown']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/index')
            ->where('initialCategory', 'all')
            ->where('canonicalUrl', route('services.index')));
});

test('the first service directory increment exposes search, categories, and summary cards', function () {
    $servicePageSource = file_get_contents(resource_path('js/pages/services/index.tsx'));
    $serviceDataSource = file_get_contents(resource_path('js/lib/dummy-village-services.ts'));
    $homepageSource = file_get_contents(resource_path('js/pages/welcome.tsx'));
    $publicShellSource = file_get_contents(resource_path('js/components/public-page-shell.tsx'));
    $appSource = file_get_contents(resource_path('js/app.tsx'));

    expect($servicePageSource)
        ->not->toBeFalse()
        ->toContain('head-key="canonical"')
        ->toContain('aria-label="Breadcrumb"')
        ->toContain('id="service-search"')
        ->toContain('villageServiceCategories.map')
        ->toContain('visibleServices.map')
        ->toContain('Persyaratan tersedia')
        ->toContain('Data dummy frontend');

    expect($serviceDataSource)
        ->not->toBeFalse()
        ->toContain('dummyVillageServices')
        ->toContain('villageServiceCategories')
        ->toContain("key: 'administration'")
        ->toContain("key: 'population'")
        ->toContain("key: 'agriculture'")
        ->toContain("key: 'reports'")
        ->toContain('getDummyVillageServices')
        ->toContain('findVillageServiceCategory');

    expect($homepageSource)
        ->not->toBeFalse()
        ->toContain('servicesIndex({')
        ->toContain("category: 'administration'")
        ->toContain('category: service.category')
        ->not->toContain('href={portalHref}');

    expect($publicShellSource)
        ->not->toBeFalse()
        ->toContain("activeSection === 'services'")
        ->toContain('href={servicesIndex()}');

    expect($appSource)
        ->not->toBeFalse()
        ->toContain("name.startsWith('services/')");
});

test('the public service detail passes its slug and canonical url to Inertia', function () {
    $slug = 'surat-keterangan-usaha';

    $this->get(route('services.show', $slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/show')
            ->where('slug', $slug)
            ->where('canonicalUrl', route('services.show', $slug)));
});

test('the second service increment exposes requirements, process, and a client-only application simulation', function () {
    $serviceIndexSource = file_get_contents(resource_path('js/pages/services/index.tsx'));
    $serviceShowSource = file_get_contents(resource_path('js/pages/services/show.tsx'));
    $serviceFormSource = file_get_contents(resource_path('js/components/village-service-application-form.tsx'));
    $serviceDataSource = file_get_contents(resource_path('js/lib/dummy-village-services.ts'));

    expect($serviceIndexSource)
        ->not->toBeFalse()
        ->toContain('href={serviceShow(')
        ->toContain('service.slug')
        ->toContain('Lihat detail');

    expect($serviceShowSource)
        ->not->toBeFalse()
        ->toContain('Persyaratan pemohon')
        ->toContain('Dokumen yang disiapkan')
        ->toContain('villageServiceProcessSteps.map')
        ->toContain('id="form-pengajuan"')
        ->toContain('VillageServiceApplicationForm')
        ->toContain('Persyaratan ini masih data simulasi');

    expect($serviceFormSource)
        ->not->toBeFalse()
        ->toContain('Tahapan formulir pengajuan')
        ->toContain('validateApplicantData')
        ->toContain('validateDocuments')
        ->toContain('type="file"')
        ->toContain('maximumFileSize')
        ->toContain('ServiceApplicationController(service.slug)')
        ->toContain('forceFormData: true')
        ->toContain('Kirim pengajuan')
        ->toContain('Pengajuan berhasil diterima sistem')
        ->toContain('privacy_consent')
        ->not->toContain('SIM-');

    expect($serviceDataSource)
        ->not->toBeFalse()
        ->toContain('dummyVillageServiceApplicationDetails')
        ->toContain('villageServiceProcessSteps')
        ->toContain('findDummyVillageService')
        ->toContain('findDummyVillageServiceApplicationDetail');
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
        ->toContain('Alokasi per Bidang')
        ->toContain('publicDocs.map')
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
