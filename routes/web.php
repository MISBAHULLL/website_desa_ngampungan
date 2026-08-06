<?php

use App\Http\Controllers\Admin\ApbdesController;
use App\Http\Controllers\Admin\ApbdesDocumentController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\HeroSlideController;
use App\Http\Controllers\Admin\OrganizationStructureController;
use App\Http\Controllers\Admin\ServiceApplicationController as AdminServiceApplicationController;
use App\Http\Controllers\Admin\ServiceApplicationDocumentController as AdminServiceApplicationDocumentController;
use App\Http\Controllers\Admin\VillageInstitutionController;
use App\Http\Controllers\Admin\VillageLeaderController;
use App\Http\Controllers\Admin\VillageOfficialController;
use App\Http\Controllers\Admin\VillageProfileController as AdminVillageProfileController;
use App\Http\Controllers\Public\AgendaController;
use App\Http\Controllers\Public\AnnouncementController;
use App\Http\Controllers\Public\ContactMessageController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\NewsController;
use App\Http\Controllers\Public\PotentialController;
use App\Http\Controllers\Public\ServiceApplicationController;
use App\Http\Controllers\Public\ServiceApplicationTrackingController;
use App\Http\Controllers\Public\ServiceController;
use App\Http\Controllers\Public\TransparencyController;
use App\Http\Controllers\Public\VillageGovernmentController;
use App\Http\Controllers\Public\VillageProfileController;
use App\Models\Announcement;
use App\Models\ApbdesSummary;
use App\Models\HeroSlide;
use App\Models\News;
use App\Models\VillageLeader;
use App\Models\VillageProfile;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    $villageProfile = VillageProfile::query()->first();
    $villageLeader = VillageLeader::query()
        ->active()
        ->latest('started_at')
        ->first();
    $heroSlides = HeroSlide::active()->get()->map(fn (HeroSlide $slide): array => [
        'id' => $slide->id,
        'title' => $slide->title,
        'subtitle' => $slide->subtitle,
        'description' => $slide->description,
        'primaryCtaText' => $slide->primary_cta_text,
        'primaryCtaUrl' => $slide->primary_cta_url,
        'secondaryCtaText' => $slide->secondary_cta_text,
        'secondaryCtaUrl' => $slide->secondary_cta_url,
        'backgroundImage' => $slide->background_image
            ? Storage::disk('public')->url($slide->background_image)
            : null,
    ]);
    $apbdesSummaries = ApbdesSummary::with(['incomeSources', 'activities'])
        ->orderByDesc('year')
        ->get()
        ->map(fn (ApbdesSummary $summary): array => $summary->toPublicData());
    $dbArticles = News::latestPublished()->get()->map(function ($article) {
        return [
            'id' => $article->id,
            'slug' => $article->slug,
            'title' => $article->title,
            'excerpt' => $article->excerpt,
            'content' => $article->content,
            'category' => $article->category,
            'author' => $article->author,
            'publishedAt' => $article->published_at->format('Y-m-d'),
            'publishedLabel' => $article->published_at->translatedFormat('d F Y'),
            'image' => $article->image_path ?: ($article->is_featured ? '/images/news/featured.png' : '/images/news/default.png'),
            'alt' => $article->image_alt ?: $article->title,
            'featured' => (bool) $article->is_featured,
        ];
    });

    $dbAnnouncements = Announcement::active()->latestFirst()->get()->map(function (Announcement $announcement): array {
        $startsAtLabel = $announcement->starts_at->translatedFormat('j F Y');
        $endsAtLabel = $announcement->ends_at ? $announcement->ends_at->translatedFormat('j F Y') : null;
        $periodLabel = $endsAtLabel ? "{$startsAtLabel}–{$endsAtLabel}" : "Mulai {$startsAtLabel}";

        return [
            'id' => $announcement->id,
            'title' => $announcement->title,
            'slug' => $announcement->slug,
            'summary' => $announcement->summary,
            'content' => $announcement->content,
            'priority' => $announcement->priority,
            'status' => $announcement->effectiveStatus(),
            'pinned' => (bool) $announcement->is_pinned,
            'startsAt' => $announcement->starts_at->format('Y-m-d'),
            'endsAt' => $announcement->ends_at?->format('Y-m-d'),
            'periodLabel' => $periodLabel,
        ];
    });

    return Inertia\Inertia::render('welcome', [
        'dbArticles' => $dbArticles,
        'dbAnnouncements' => $dbAnnouncements,
        'heroSlides' => $heroSlides,
        'apbdesSummaries' => $apbdesSummaries,
        'villageLeader' => $villageLeader?->toPublicData(),
        'villageProfile' => $villageProfile ? [
            'totalPopulation' => $villageProfile->total_population,
            'totalFamilies' => $villageProfile->total_families,
            'totalHamlets' => $villageProfile->total_hamlets,
            'totalAreaHectares' => $villageProfile->total_area_hectares,
        ] : null,
    ]);
})->name('home');

Route::get('profil-desa', VillageProfileController::class)
    ->name('profile.index');
Route::get('pemerintahan-desa', [VillageGovernmentController::class, 'index'])
    ->name('government.index');
Route::get(
    'pemerintahan-desa/perangkat/{slug}',
    [VillageGovernmentController::class, 'show'],
)
    ->where('slug', '[a-z0-9-]+')
    ->name('government.officials.show');
Route::get('berita', [NewsController::class, 'index'])->name('news.index');
Route::get('berita/{slug}', [NewsController::class, 'show'])->name('news.show');
Route::get('pengumuman', [AnnouncementController::class, 'index'])
    ->name('announcements.index');
Route::get('agenda', AgendaController::class)->name('agendas.index');
Route::get('galeri', GalleryController::class)->name('gallery.index');
Route::get('layanan', [ServiceController::class, 'index'])
    ->name('services.index');
Route::redirect('layanan/lacak', '/lacak-pengajuan', 301);
Route::get('layanan/{slug}', [ServiceController::class, 'show'])
    ->where('slug', '[a-z0-9-]+')
    ->name('services.show');
Route::post(
    'layanan/{slug}/pengajuan',
    ServiceApplicationController::class,
)
    ->where('slug', '[a-z0-9-]+')
    ->middleware('throttle:service-applications')
    ->name('service-applications.store');
Route::get('lacak-pengajuan', ServiceApplicationTrackingController::class)
    ->middleware('throttle:service-application-tracking')
    ->name('service-applications.track');
Route::get('transparansi', [TransparencyController::class, 'index'])
    ->name('transparency.index');
Route::get('transparansi/dokumen/{document}/download', [TransparencyController::class, 'downloadDocument'])
    ->name('transparency.documents.download');
Route::get('potensi', [PotentialController::class, 'index'])
    ->name('potentials.index');
Route::post('kontak/pesan', [ContactMessageController::class, 'store'])
    ->middleware('throttle:contact-messages')
    ->name('contact-messages.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('dashboard/pesan', [AdminContactMessageController::class, 'index'])
        ->name('admin.contact-messages.index');
    Route::patch(
        'dashboard/pesan/{contactMessage}',
        [AdminContactMessageController::class, 'updateStatus'],
    )->name('admin.contact-messages.update-status');
    Route::get(
        'dashboard/layanan',
        [AdminServiceApplicationController::class, 'index'],
    )->name('admin.service-applications.index');
    Route::get(
        'dashboard/layanan/{serviceApplication}',
        [AdminServiceApplicationController::class, 'show'],
    )->name('admin.service-applications.show');
    Route::patch(
        'dashboard/layanan/{serviceApplication}',
        [AdminServiceApplicationController::class, 'update'],
    )->name('admin.service-applications.update');
    Route::get(
        'dashboard/layanan/{serviceApplication}/dokumen/{document}',
        AdminServiceApplicationDocumentController::class,
    )
        ->scopeBindings()
        ->name('admin.service-applications.documents.download');

    Route::resource('dashboard/berita', App\Http\Controllers\Admin\NewsController::class)
        ->parameters(['berita' => 'news'])
        ->names('admin.news');
    Route::patch('dashboard/berita/{news}/toggle-featured', [App\Http\Controllers\Admin\NewsController::class, 'toggleFeatured'])
        ->name('admin.news.toggle-featured');

    Route::resource('dashboard/pengumuman', App\Http\Controllers\Admin\AnnouncementController::class)
        ->parameters(['pengumuman' => 'announcement'])
        ->except(['show'])
        ->names('admin.announcements');
    Route::patch('dashboard/pengumuman/{announcement}/toggle-pinned', [App\Http\Controllers\Admin\AnnouncementController::class, 'togglePinned'])
        ->name('admin.announcements.toggle-pinned');

    Route::resource('dashboard/galeri', App\Http\Controllers\Admin\GalleryController::class)
        ->parameters(['galeri' => 'gallery'])
        ->names('admin.gallery');
    Route::patch('dashboard/galeri/{gallery}/toggle-featured', [App\Http\Controllers\Admin\GalleryController::class, 'toggleFeatured'])
        ->name('admin.gallery.toggle-featured');

    Route::resource('dashboard/agenda', App\Http\Controllers\Admin\AgendaController::class)
        ->parameters(['agenda' => 'agenda'])
        ->names('admin.agendas');
    Route::patch('dashboard/agenda/{agenda}/toggle-featured', [App\Http\Controllers\Admin\AgendaController::class, 'toggleFeatured'])
        ->name('admin.agendas.toggle-featured');

    Route::resource('dashboard/perangkat-desa', VillageOfficialController::class)
        ->parameters(['perangkat-desa' => 'villageOfficial'])
        ->except(['show'])
        ->names('admin.village-officials');

    Route::resource('dashboard/lembaga-desa', VillageInstitutionController::class)
        ->parameters(['lembaga-desa' => 'villageInstitution'])
        ->names('admin.village-institutions');

    Route::get('dashboard/struktur-organisasi', [OrganizationStructureController::class, 'index'])
        ->name('admin.organization-structure.index');
    Route::post('dashboard/struktur-organisasi/cabang', [OrganizationStructureController::class, 'storeBranch'])
        ->name('admin.organization-structure.branches.store');
    Route::delete('dashboard/struktur-organisasi/cabang/{villageOfficial}', [OrganizationStructureController::class, 'destroyBranch'])
        ->name('admin.organization-structure.branches.destroy');
    Route::patch('dashboard/struktur-organisasi', [OrganizationStructureController::class, 'updateStructure'])
        ->name('admin.organization-structure.update');

    Route::get('dashboard/profil-desa', [AdminVillageProfileController::class, 'index'])
        ->name('admin.village-profile.index');
    Route::get('dashboard/profil-desa/edit', [AdminVillageProfileController::class, 'edit'])
        ->name('admin.village-profile.edit');
    Route::patch('dashboard/profil-desa', [AdminVillageProfileController::class, 'update'])
        ->name('admin.village-profile.update');

    Route::resource('dashboard/kepala-desa', VillageLeaderController::class)
        ->parameters(['kepala-desa' => 'villageLeader'])
        ->names('admin.village-leaders');
    Route::patch(
        'dashboard/kepala-desa/{villageLeader}/sambutan',
        [VillageLeaderController::class, 'updateWelcome'],
    )->name('admin.village-leaders.update-welcome');

    Route::resource('dashboard/hero-slides', HeroSlideController::class)
        ->parameters(['hero-slides' => 'heroSlide'])
        ->except(['show'])
        ->names('admin.hero-slides');

    Route::resource('dashboard/apbdes', ApbdesController::class)
        ->parameters(['apbdes' => 'apbdes'])
        ->except(['show'])
        ->names('admin.apbdes');

    Route::resource('dashboard/apbdes-documents', ApbdesDocumentController::class)
        ->parameters(['apbdes-documents' => 'apbdesDocument'])
        ->only(['create', 'store', 'edit', 'update', 'destroy'])
        ->names('admin.apbdes-documents');

    Route::resource('dashboard/kelola-layanan', App\Http\Controllers\Admin\VillageServiceController::class)
        ->parameters(['kelola-layanan' => 'villageService'])
        ->except(['show'])
        ->names('admin.village-services');
    Route::patch('dashboard/kelola-layanan/{villageService}/toggle-active', [App\Http\Controllers\Admin\VillageServiceController::class, 'toggleActive'])
        ->name('admin.village-services.toggle-active');
});

require __DIR__.'/settings.php';
