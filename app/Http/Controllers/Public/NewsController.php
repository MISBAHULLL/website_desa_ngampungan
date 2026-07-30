<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\News;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    /**
     * Display the public news index.
     */
    public function index(): Response
    {
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
                'image' => $article->image_path ?: 'https://images.unsplash.com/photo-1590059346282-3f136e053912?q=80&w=1400&auto=format&fit=crop',
                'alt' => $article->image_alt ?: $article->title,
                'featured' => (bool) $article->is_featured,
            ];
        });

        return Inertia::render('news/index', [
            'dbArticles' => $dbArticles,
        ]);
    }

    /**
     * Display a public news article by slug.
     */
    public function show(string $slug): Response
    {
        $article = News::where('slug', $slug)->first();

        $articleData = $article ? [
            'id' => $article->id,
            'slug' => $article->slug,
            'title' => $article->title,
            'excerpt' => $article->excerpt,
            'content' => $article->content,
            'category' => $article->category,
            'author' => $article->author,
            'publishedAt' => $article->published_at->format('Y-m-d'),
            'publishedLabel' => $article->published_at->translatedFormat('d F Y'),
            'image' => $article->image_path ?: 'https://images.unsplash.com/photo-1590059346282-3f136e053912?q=80&w=1400&auto=format&fit=crop',
            'alt' => $article->image_alt ?: $article->title,
            'featured' => (bool) $article->is_featured,
        ] : null;

        $relatedArticles = News::where('slug', '!=', $slug)
            ->when($article, fn ($q) => $q->where('category', $article->category))
            ->latestPublished()
            ->take(3)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'slug' => $item->slug,
                'title' => $item->title,
                'excerpt' => $item->excerpt,
                'content' => $item->content,
                'category' => $item->category,
                'author' => $item->author,
                'publishedAt' => $item->published_at->format('Y-m-d'),
                'publishedLabel' => $item->published_at->translatedFormat('d F Y'),
                'image' => $item->image_path ?: 'https://images.unsplash.com/photo-1590059346282-3f136e053912?q=80&w=1400&auto=format&fit=crop',
                'alt' => $item->image_alt ?: $item->title,
                'featured' => (bool) $item->is_featured,
            ]);

        return Inertia::render('news/show', [
            'slug' => $slug,
            'dbArticle' => $articleData,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
