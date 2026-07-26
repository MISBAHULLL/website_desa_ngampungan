<?php

use App\Http\Controllers\Public\AnnouncementController;
use App\Http\Controllers\Public\NewsController;
use App\Http\Controllers\Public\TransparencyController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('berita', [NewsController::class, 'index'])->name('news.index');
Route::get('berita/{slug}', [NewsController::class, 'show'])->name('news.show');
Route::get('pengumuman', [AnnouncementController::class, 'index'])
    ->name('announcements.index');
Route::get('transparansi', TransparencyController::class)
    ->name('transparency.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
