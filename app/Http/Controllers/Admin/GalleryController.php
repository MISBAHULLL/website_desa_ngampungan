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
            'media_type' => ['required', 'in:photo,video'],
            'category' => ['required', 'string', 'max:100'],
            'album' => ['required', 'string', 'max:100'],
            'caption' => ['required', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'max:4096'], // 4MB max
            'image_url' => ['nullable', 'url', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'video' => [
                'nullable',
                'file',
                'mimes:mp4,webm,avi,mov',
                'mimetypes:video/mp4,video/webm,video/x-msvideo,video/quicktime',
                'max:102400', // 100MB
            ],
            'video_url' => ['nullable', 'url', 'max:500'],
            'is_featured' => ['boolean'],
            'captured_at' => ['nullable', 'date'],
        ]);

        // Validasi media berdasarkan tipe
        if ($validated['media_type'] === 'photo') {
            if (! $request->hasFile('image') && empty($validated['image_url'])) {
                return back()->withErrors(['image' => 'Silakan unggah foto atau masukkan URL gambar.']);
            }
        } else {
            if (! $request->hasFile('video') && empty($validated['video_url'])) {
                return back()->withErrors(['video' => 'Silakan unggah video atau masukkan URL video (YouTube/Vimeo).']);
            }
        }

        $imagePath = null;
        $videoPath = null;

        if ($validated['media_type'] === 'photo') {
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('gallery/photos', 'public');
                $imagePath = Storage::url($path);
            } else {
                $imagePath = $validated['image_url'];
            }
        } else {
            if ($request->hasFile('video')) {
                $path = $request->file('video')->store('gallery/videos', 'public');
                $videoPath = Storage::url($path);
            } elseif (! empty($validated['video_url'])) {
                $videoPath = $validated['video_url'];
            }
        }

        $slug = GalleryPhoto::generateUniqueSlug($validated['title']);

        GalleryPhoto::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'media_type' => $validated['media_type'],
            'category' => $validated['category'],
            'album' => $validated['album'],
            'caption' => $validated['caption'],
            'image_path' => $imagePath,
            'image_alt' => ($validated['image_alt'] ?? null) ?: $validated['title'],
            'video_path' => $videoPath,
            'video_url' => $validated['video_url'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
            'captured_at' => $validated['captured_at'] ?? now()->toDateString(),
        ]);

        $mediaLabel = $validated['media_type'] === 'photo' ? 'Foto' : 'Video';

        return redirect()->route('admin.gallery.index')
            ->with('success', "{$mediaLabel} galeri berhasil ditambahkan.");
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
            'media_type' => ['required', 'in:photo,video'],
            'category' => ['required', 'string', 'max:100'],
            'album' => ['required', 'string', 'max:100'],
            'caption' => ['required', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'url', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'video' => [
                'nullable',
                'file',
                'mimes:mp4,webm,avi,mov',
                'mimetypes:video/mp4,video/webm,video/x-msvideo,video/quicktime',
                'max:102400',
            ],
            'video_url' => ['nullable', 'url', 'max:500'],
            'is_featured' => ['boolean'],
            'captured_at' => ['nullable', 'date'],
            'remove_video' => ['nullable', 'boolean'],
        ]);

        $removeVideo = filter_var($request->input('remove_video'), FILTER_VALIDATE_BOOLEAN);

        // Validasi: pastikan ada media yang diupload sesuai tipe
        if ($validated['media_type'] === 'photo') {
            $hasNewPhoto = $request->hasFile('image') || ! empty($validated['image_url']);
            $hasExistingPhoto = ! empty($gallery->image_path);

            if (! $hasNewPhoto && ! $hasExistingPhoto) {
                return back()->withErrors(['image' => 'Silakan unggah foto atau masukkan URL gambar.']);
            }
        } else {
            if (! $removeVideo) {
                $hasNewVideo = $request->hasFile('video') || ! empty($validated['video_url']);
                $hasExistingVideo = ! empty($gallery->video_path) || ! empty($gallery->video_url);

                if (! $hasNewVideo && ! $hasExistingVideo) {
                    return back()->withErrors(['video' => 'Silakan unggah video atau masukkan URL video.']);
                }
            }
        }

        $imagePath = $gallery->image_path;
        $videoPath = $gallery->video_path;
        $videoUrl = $gallery->video_url;

        if ($validated['media_type'] === 'photo') {
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('gallery/photos', 'public');
                $imagePath = Storage::url($path);
            } elseif (! empty($validated['image_url'])) {
                $imagePath = $validated['image_url'];
            }
            // Reset video paths when switching to photo
            $videoPath = null;
            $videoUrl = null;
        } else {
            if ($removeVideo) {
                $videoPath = null;
                $videoUrl = null;
            } elseif ($request->hasFile('video')) {
                $path = $request->file('video')->store('gallery/videos', 'public');
                $videoPath = Storage::url($path);
                // Clear video_url when uploading a new file
                $videoUrl = null;
            } elseif (! empty($validated['video_url'])) {
                $videoUrl = $validated['video_url'];
                // Don't override existing videoPath unless explicitly changed
            }
            // Reset image path when switching to video
            $imagePath = null;
        }

        $slug = $gallery->title !== $validated['title']
            ? GalleryPhoto::generateUniqueSlug($validated['title'], $gallery->id)
            : $gallery->slug;

        $gallery->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'media_type' => $validated['media_type'],
            'category' => $validated['category'],
            'album' => $validated['album'],
            'caption' => $validated['caption'],
            'image_path' => $imagePath,
            'image_alt' => ($validated['image_alt'] ?? null) ?: $validated['title'],
            'video_path' => $videoPath,
            'video_url' => $videoUrl,
            'is_featured' => $validated['is_featured'] ?? false,
            'captured_at' => $validated['captured_at'] ?? $gallery->captured_at,
        ]);

        $mediaLabel = $validated['media_type'] === 'photo' ? 'Foto' : 'Video';

        return redirect()->route('admin.gallery.index')
            ->with('success', "{$mediaLabel} galeri berhasil diperbarui.");
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
