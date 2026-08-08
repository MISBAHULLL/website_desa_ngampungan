<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FilterNewsRequest;
use App\Http\Requests\Admin\StoreNewsRequest;
use App\Http\Requests\Admin\UpdateNewsRequest;
use App\Models\News;
use App\Support\PublicImageStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function __construct(private readonly PublicImageStorage $imageStorage) {}

    public function index(FilterNewsRequest $request): Response
    {
        $validated = $request->validated();
        $search = trim((string) ($validated['search'] ?? ''));
        $category = (string) ($validated['category'] ?? 'Semua');
        $standardCategories = $this->standardCategories();
        $otherCategoryLabel = $this->otherCategoryLabel();

        $news = News::query()
            ->when($search !== '', function ($query) use ($search): void {
                $escapedSearch = addcslashes($search, '%_\\');
                $query->where('title', 'like', "%{$escapedSearch}%");
            })
            ->when($category !== '' && $category !== 'Semua', function ($query) use ($category, $otherCategoryLabel, $standardCategories): void {
                if ($category === $otherCategoryLabel) {
                    $query->whereNotIn('category', $standardCategories);

                    return;
                }

                $query->where('category', $category);
            })
            ->latestPublished()
            ->paginate(10)
            ->withQueryString();

        $storedCategories = News::query()
            ->distinct()
            ->pluck('category')
            ->all();
        $categories = array_values(array_filter(
            $standardCategories,
            fn (string $item): bool => in_array($item, $storedCategories, true),
        ));

        if (array_diff($storedCategories, $standardCategories) !== []) {
            $categories[] = $otherCategoryLabel;
        }

        return Inertia::render('admin/news/index', [
            'news' => $news,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/news/create', $this->categoryProps());
    }

    public function store(StoreNewsRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $imagePath = $this->resolveImagePath($request, $validated['image_url'] ?? null);
        $videoPath = $this->resolveVideoPath($request, $validated['video_url'] ?? null);

        DB::transaction(function () use ($validated, $imagePath, $videoPath): void {
            if (! empty($validated['is_featured'])) {
                News::query()->where('is_featured', true)->update(['is_featured' => false]);
            }

            News::query()->create([
                'title' => $validated['title'],
                'slug' => News::generateUniqueSlug($validated['title']),
                'category' => $validated['category'],
                'excerpt' => $validated['excerpt'],
                'content' => array_values(array_filter($validated['content'])),
                'author' => $validated['author'] ?: 'Admin Desa',
                'image_path' => $imagePath,
                'image_alt' => ($validated['image_alt'] ?? null) ?: $validated['title'],
                'video_path' => $videoPath,
                'video_url' => $validated['video_url'] ?? null,
                'is_featured' => $validated['is_featured'] ?? false,
                'published_at' => $validated['published_at'] ?? now(),
            ]);
        });

        return redirect()->route('admin.news.index')
            ->with('success', 'Berita berhasil diterbitkan.');
    }

    public function edit(News $news): Response
    {
        return Inertia::render('admin/news/edit', [
            'newsItem' => $news,
            ...$this->categoryProps(),
        ]);
    }

    public function update(UpdateNewsRequest $request, News $news): RedirectResponse
    {
        $validated = $request->validated();
        $previousImagePath = $news->image_path;
        $previousVideoPath = $news->video_path;
        $imagePath = $this->resolveImagePath(
            $request,
            $validated['image_url'] ?? null,
            $previousImagePath,
        );
        $videoPath = $this->resolveVideoPath(
            $request,
            $validated['video_url'] ?? null,
            $previousVideoPath,
        );

        DB::transaction(function () use ($validated, $imagePath, $videoPath, $news): void {
            if (! empty($validated['is_featured']) && ! $news->is_featured) {
                News::query()->where('is_featured', true)->update(['is_featured' => false]);
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
                'video_path' => $videoPath,
                'video_url' => $validated['video_url'] ?? null,
                'is_featured' => $validated['is_featured'] ?? false,
                'published_at' => $validated['published_at'] ?? $news->published_at,
            ]);
        });

        if ($previousImagePath !== $imagePath) {
            $this->imageStorage->delete($previousImagePath);
        }

        if ($previousVideoPath !== $videoPath && $previousVideoPath && str_starts_with($previousVideoPath, '/storage/')) {
            $this->imageStorage->delete($previousVideoPath);
        }

        return redirect()->route('admin.news.index')
            ->with('success', 'Berita berhasil diperbarui.');
    }

    public function toggleFeatured(News $news): RedirectResponse
    {
        $newStatus = ! $news->is_featured;

        DB::transaction(function () use ($newStatus, $news): void {
            if ($newStatus) {
                News::query()->where('is_featured', true)->update(['is_featured' => false]);
            }

            $news->update(['is_featured' => $newStatus]);
        });

        return redirect()->back()
            ->with('success', $newStatus ? 'Berita dijadikan Berita Utama.' : 'Berita diubah menjadi berita biasa.');
    }

    public function destroy(News $news): RedirectResponse
    {
        $imagePath = $news->image_path;
        $news->delete();
        $this->imageStorage->delete($imagePath);

        return redirect()->route('admin.news.index')
            ->with('success', 'Berita berhasil dihapus.');
    }

    /** @return array{categoryOptions: list<string>, otherCategoryLabel: string} */
    private function categoryProps(): array
    {
        return [
            'categoryOptions' => $this->standardCategories(),
            'otherCategoryLabel' => $this->otherCategoryLabel(),
        ];
    }

    /** @return list<string> */
    private function standardCategories(): array
    {
        /** @var list<string> $categories */
        $categories = config('village_news.categories', []);

        return $categories;
    }

    private function otherCategoryLabel(): string
    {
        return (string) config('village_news.other_category_label', 'Lainnya');
    }

    private function resolveImagePath(
        StoreNewsRequest $request,
        ?string $imageUrl,
        ?string $fallback = null,
    ): ?string {
        $image = $request->file('image');

        if ($image instanceof UploadedFile) {
            return $this->imageStorage->store($image, 'news');
        }

        return $imageUrl ?: $fallback;
    }

    private function resolveVideoPath(
        StoreNewsRequest $request,
        ?string $videoUrl,
        ?string $fallback = null,
    ): ?string {
        $video = $request->file('video');

        if ($video instanceof UploadedFile) {
            return $this->imageStorage->store($video, 'news/videos');
        }

        return $videoUrl ?: $fallback;
    }
}
