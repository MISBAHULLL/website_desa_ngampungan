<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\News;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Inertia\Inertia;
use Inertia\Response;
use UnexpectedValueException;

class NewsController extends Controller
{
    /**
     * Display the public news index.
     */
    public function index(): Response
    {
        $dbArticles = News::latestPublished()->get()->map(function (News $article): array {
            $publishedAt = $this->publishedAt($article);

            return [
                'id' => $article->id,
                'slug' => $article->slug,
                'title' => $article->title,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'category' => $article->category,
                'author' => $article->author,
                'publishedAt' => $publishedAt->format('Y-m-d'),
                'publishedLabel' => $publishedAt->translatedFormat('d F Y'),
                'image' => $article->image_path ?: 'https://images.unsplash.com/photo-1590059346282-3f136e053912?q=80&w=1400&auto=format&fit=crop',
                'alt' => $article->image_alt ?: $article->title,
                'video' => $article->video_path,
                'videoUrl' => $article->video_url,
                'featured' => (bool) $article->is_featured,
            ];
        });

        return Inertia::render('news/index', [
            'dbArticles' => $dbArticles,
            'categoryOptions' => config('village_news.categories', []),
            'otherCategoryLabel' => config('village_news.other_category_label', 'Lainnya'),
        ]);
    }

    /**
     * Display a public news article by slug.
     */
    public function show(string $slug): Response
    {
        $article = News::where('slug', $slug)->first();

        $articlePublishedAt = $article ? $this->publishedAt($article) : null;
        $articleData = $article && $articlePublishedAt ? [
            'id' => $article->id,
            'slug' => $article->slug,
            'title' => $article->title,
            'excerpt' => $article->excerpt,
            'content' => $article->content,
            'category' => $article->category,
            'author' => $article->author,
            'publishedAt' => $articlePublishedAt->format('Y-m-d'),
            'publishedLabel' => $articlePublishedAt->translatedFormat('d F Y'),
            'image' => $article->image_path ?: ($article->is_featured ? '/images/news/featured.png' : '/images/news/default.png'),
            'alt' => $article->image_alt ?: $article->title,
            'video' => $article->video_path,
            'videoUrl' => $article->video_url,
            'featured' => (bool) $article->is_featured,
        ] : null;

        $relatedArticles = News::where('slug', '!=', $slug)
            ->when($article, fn ($q) => $q->where('category', $article->category))
            ->latestPublished()
            ->take(3)
            ->get()
            ->map(function (News $item): array {
                $publishedAt = $this->publishedAt($item);

                return [
                    'id' => $item->id,
                    'slug' => $item->slug,
                    'title' => $item->title,
                    'excerpt' => $item->excerpt,
                    'content' => $item->content,
                    'category' => $item->category,
                    'author' => $item->author,
                    'publishedAt' => $publishedAt->format('Y-m-d'),
                    'publishedLabel' => $publishedAt->translatedFormat('d F Y'),
                    'image' => $item->image_path ?: ($item->is_featured ? '/images/news/featured.png' : '/images/news/default.png'),
                    'alt' => $item->image_alt ?: $item->title,
                    'video' => $item->video_path,
                    'videoUrl' => $item->video_url,
                    'featured' => (bool) $item->is_featured,
                ];
            });

        return Inertia::render('news/show', [
            'slug' => $slug,
            'dbArticle' => $articleData,
            'relatedArticles' => $relatedArticles,
        ]);
    }

    private function publishedAt(News $article): CarbonInterface
    {
        $publishedAt = $article->getAttribute('published_at');

        if ($publishedAt instanceof CarbonInterface) {
            return $publishedAt;
        }

        if (is_string($publishedAt)) {
            return CarbonImmutable::parse($publishedAt);
        }

        throw new UnexpectedValueException('Tanggal terbit berita tidak valid.');
    }
}
