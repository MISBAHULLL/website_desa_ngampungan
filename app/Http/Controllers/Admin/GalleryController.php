<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $query = GalleryPhoto::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('album', 'like', "%{$search}%");
            });
        }

        if ($category && $category !== 'Semua') {
            $query->where('category', $category);
        }

        $photos = $query->latest('captured_at')
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        $categories = GalleryPhoto::select('category')->distinct()->pluck('category');

        return Inertia::render('admin/gallery/index', [
            'photos' => $photos,
            'categories' => $categories,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/gallery/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'album' => ['required', 'string', 'max:100'],
            'caption' => ['required', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'max:4096'], // 4MB max
            'image_url' => ['nullable', 'url', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['boolean'],
            'captured_at' => ['nullable', 'date'],
        ]);

        if (! $request->hasFile('image') && empty($validated['image_url'])) {
            return back()->withErrors(['image' => 'Silakan unggah foto atau masukkan URL gambar.']);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery', 'public');
            $imagePath = Storage::url($path);
        } else {
            $imagePath = $validated['image_url'];
        }

        $slug = GalleryPhoto::generateUniqueSlug($validated['title']);

        GalleryPhoto::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'],
            'album' => $validated['album'],
            'caption' => $validated['caption'],
            'image_path' => $imagePath,
            'image_alt' => ($validated['image_alt'] ?? null) ?: $validated['title'],
            'is_featured' => $validated['is_featured'] ?? false,
            'captured_at' => $validated['captured_at'] ?? now()->toDateString(),
        ]);

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Foto galeri berhasil ditambahkan.');
    }

    public function edit(GalleryPhoto $gallery): Response
    {
        return Inertia::render('admin/gallery/edit', [
            'photo' => $gallery,
        ]);
    }

    public function update(Request $request, GalleryPhoto $gallery): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'album' => ['required', 'string', 'max:100'],
            'caption' => ['required', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'url', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['boolean'],
            'captured_at' => ['nullable', 'date'],
        ]);

        $imagePath = $gallery->image_path;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery', 'public');
            $imagePath = Storage::url($path);
        } elseif (! empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        }

        $slug = $gallery->title !== $validated['title']
            ? GalleryPhoto::generateUniqueSlug($validated['title'], $gallery->id)
            : $gallery->slug;

        $gallery->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'],
            'album' => $validated['album'],
            'caption' => $validated['caption'],
            'image_path' => $imagePath,
            'image_alt' => ($validated['image_alt'] ?? null) ?: $validated['title'],
            'is_featured' => $validated['is_featured'] ?? false,
            'captured_at' => $validated['captured_at'] ?? $gallery->captured_at,
        ]);

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Foto galeri berhasil diperbarui.');
    }

    public function toggleFeatured(GalleryPhoto $gallery): RedirectResponse
    {
        $gallery->update(['is_featured' => ! $gallery->is_featured]);

        return redirect()->back()
            ->with('success', 'Status sorotan foto berhasil diperbarui.');
    }

    public function destroy(GalleryPhoto $gallery): RedirectResponse
    {
        $gallery->delete();

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Foto galeri berhasil dihapus.');
    }
}
