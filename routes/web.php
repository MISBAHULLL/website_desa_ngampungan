<?php

use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Public\AnnouncementController;
use App\Http\Controllers\Public\ContactMessageController;
use App\Http\Controllers\Public\NewsController;
use App\Http\Controllers\Public\PotentialController;
use App\Http\Controllers\Public\TransparencyController;
use App\Http\Controllers\Public\VillageGovernmentController;
use App\Http\Controllers\Public\VillageProfileController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

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
Route::get('transparansi', TransparencyController::class)
    ->name('transparency.index');
Route::get('potensi', [PotentialController::class, 'index'])
    ->name('potentials.index');
Route::get('potensi/{slug}', [PotentialController::class, 'show'])
    ->where('slug', '[a-z0-9-]+')
    ->name('potentials.show');
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
});

require __DIR__.'/settings.php';
