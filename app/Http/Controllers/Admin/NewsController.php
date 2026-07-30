<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $query = News::query();

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($category && $category !== 'Semua') {
            $query->where('category', $category);
        }

        $news = $query->latestPublished()
            ->paginate(10)
            ->withQueryString();

        $categories = News::select('category')->distinct()->pluck('category');

        return Inertia::render('admin/news/index', [
            'news' => $news,
            'categories' => $categories,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/news/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['required', 'array', 'min:1'],
            'content.*' => ['required', 'string', 'max:10000'],
            'author' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'max:3072'], // Max 3MB
            'image_url' => ['nullable', 'url', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('news', 'public');
            $imagePath = Storage::url($path);
        } elseif (! empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        }

        if (! empty($validated['is_featured'])) {
            // Un-feature existing featured articles if desired
            News::where('is_featured', true)->update(['is_featured' => false]);
        }

        $slug = News::generateUniqueSlug($validated['title']);

        News::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'],
            'excerpt' => $validated['excerpt'],
            'content' => array_values(array_filter($validated['content'])),
            'author' => $validated['author'] ?: 'Admin Desa',
            'image_path' => $imagePath,
            'image_alt' => ($validated['image_alt'] ?? null) ?: $validated['title'],
            'is_featured' => $validated['is_featured'] ?? false,
            'published_at' => $validated['published_at'] ?? now(),
        ]);

        return redirect()->route('admin.news.index')
            ->with('success', 'Berita berhasil diterbitkan.');
    }

    public function edit(News $news): Response
    {
        return Inertia::render('admin/news/edit', [
            'newsItem' => $news,
        ]);
    }

    public function update(Request $request, News $news): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['required', 'array', 'min:1'],
            'content.*' => ['required', 'string', 'max:10000'],
            'author' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'max:3072'],
            'image_url' => ['nullable', 'url', 'max:500'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);

        $imagePath = $news->image_path;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('news', 'public');
            $imagePath = Storage::url($path);
        } elseif (! empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        }

        if (! empty($validated['is_featured']) && ! $news->is_featured) {
            News::where('is_featured', true)->update(['is_featured' => false]);
        }

        $slug = $news->title !== $validated['title']
            ? News::generateUniqueSlug($validated['title'], $news->id)
            : $news->slug;

        $news->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'],
            'excerpt' => $validated['excerpt'],
            'content' => array_values(array_filter($validated['content'])),
            'author' => $validated['author'] ?: 'Admin Desa',
            'image_path' => $imagePath,
            'image_alt' => ($validated['image_alt'] ?? null) ?: $validated['title'],
            'is_featured' => $validated['is_featured'] ?? false,
            'published_at' => $validated['published_at'] ?? $news->published_at,
        ]);

        return redirect()->route('admin.news.index')
            ->with('success', 'Berita berhasil diperbarui.');
    }

    public function toggleFeatured(News $news): RedirectResponse
    {
        $newStatus = ! $news->is_featured;

        if ($newStatus) {
            News::where('is_featured', true)->update(['is_featured' => false]);
        }

        $news->update(['is_featured' => $newStatus]);

        return redirect()->back()
            ->with('success', $newStatus ? 'Berita dijadikan Berita Utama.' : 'Berita diubah menjadi berita biasa.');
    }

    public function destroy(News $news): RedirectResponse
    {
        $news->delete();

        return redirect()->route('admin.news.index')
            ->with('success', 'Berita berhasil dihapus.');
    }
}
