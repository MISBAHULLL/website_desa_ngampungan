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
            ->withQueryString()
            ->through(fn (News $item): array => $this->withResolvedMedia($item));

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
        $isVideo = $validated['media_type'] === 'video';
        $imagePath = $isVideo
            ? null
            : $this->resolveImagePath($request, $validated['image_url'] ?? null);
        $videoPath = $isVideo ? $this->resolveVideoPath($request) : null;
        $videoUrl = $isVideo && $videoPath === null
            ? ($validated['video_url'] ?? null)
            : null;

        DB::transaction(function () use ($validated, $imagePath, $videoPath, $videoUrl): void {
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
                'video_url' => $videoUrl,
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
            'newsItem' => $this->withResolvedMedia($news),
            ...$this->categoryProps(),
        ]);
    }

    public function update(UpdateNewsRequest $request, News $news): RedirectResponse
    {
        $validated = $request->validated();
        $previousImagePath = $news->image_path;
        $previousVideoPath = $news->video_path;
        $previousVideoUrl = $news->video_url;
        $isVideo = $validated['media_type'] === 'video';

        if ($isVideo) {
            $imagePath = null;
            $videoPath = $previousVideoPath;
            $videoUrl = $previousVideoUrl;

            if (! empty($validated['remove_video'])) {
                $videoPath = null;
                $videoUrl = null;
            } elseif ($request->file('video') instanceof UploadedFile) {
                $videoPath = $this->resolveVideoPath($request);
                $videoUrl = null;
            } elseif (! empty($validated['video_url'])) {
                $videoPath = null;
                $videoUrl = $validated['video_url'];
            }
        } else {
            $imagePath = $this->resolveImagePath(
                $request,
                $validated['image_url'] ?? null,
                $previousImagePath,
            );
            $videoPath = null;
            $videoUrl = null;

            if (! empty($validated['remove_image'])) {
                $imagePath = null;
            }
        }

        DB::transaction(function () use ($validated, $imagePath, $videoPath, $videoUrl, $news): void {
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
                'video_url' => $videoUrl,
                'is_featured' => $validated['is_featured'] ?? false,
                'published_at' => $validated['published_at'] ?? $news->published_at,
            ]);
        });

        if ($previousImagePath !== $imagePath) {
            $this->imageStorage->delete($previousImagePath);
        }

        if ($previousVideoPath !== $videoPath) {
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
        $videoPath = $news->video_path;
        $news->delete();
        $this->imageStorage->delete($imagePath);
        $this->imageStorage->delete($videoPath);

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
    ): ?string {
        $video = $request->file('video');

        if ($video instanceof UploadedFile) {
            return $this->imageStorage->store($video, 'news/videos');
        }

        return null;
    }

    /** @return array<string, mixed> */
    private function withResolvedMedia(News $news): array
    {
        return [
            ...$news->toArray(),
            'image_path' => $this->imageStorage->url($news->image_path),
            'video_path' => $this->imageStorage->url($news->video_path),
        ];
    }
}
