<?php

use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\ServiceApplicationController as AdminServiceApplicationController;
use App\Http\Controllers\Admin\ServiceApplicationDocumentController as AdminServiceApplicationDocumentController;
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
use App\Models\News;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
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

    $dbAnnouncements = Announcement::active()->latestFirst()->get()->map(function ($announcement) {
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
            'status' => $announcement->status,
            'pinned' => (bool) $announcement->is_pinned,
            'startsAt' => $announcement->starts_at->format('Y-m-d'),
            'endsAt' => $announcement->ends_at?->format('Y-m-d'),
            'periodLabel' => $periodLabel,
        ];
    });

    return Inertia\Inertia::render('welcome', [
        'dbArticles' => $dbArticles,
        'dbAnnouncements' => $dbAnnouncements,
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
Route::get('layanan/{slug}', [ServiceController::class, 'show'])
    ->whereIn('slug', array_keys((array) config('village_services.services')))
    ->name('services.show');
Route::post(
    'layanan/{slug}/pengajuan',
    ServiceApplicationController::class,
)
    ->whereIn('slug', array_keys((array) config('village_services.services')))
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
        ->names('admin.announcements');
    Route::patch('dashboard/pengumuman/{announcement}/toggle-pinned', [App\Http\Controllers\Admin\AnnouncementController::class, 'togglePinned'])
        ->name('admin.announcements.toggle-pinned');
});

require __DIR__.'/settings.php';
