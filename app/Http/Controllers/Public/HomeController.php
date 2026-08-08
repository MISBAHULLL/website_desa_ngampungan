<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\ApbdesSummary;
use App\Models\HeroSlide;
use App\Models\News;
use App\Models\VillageLeader;
use App\Models\VillageProfile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $villageProfile = VillageProfile::query()->first([
            'total_population',
            'total_families',
            'total_hamlets',
            'total_area_hectares',
        ]);

        $villageLeader = VillageLeader::query()
            ->active()
            ->latest('started_at')
            ->first([
                'id', 'name', 'position', 'photo', 'welcome_title',
                'welcome_message', 'vision', 'mission', 'started_at', 'ended_at',
            ]);

        $heroSlides = HeroSlide::query()
            ->active()
            ->limit(5)
            ->get([
                'id', 'title', 'subtitle', 'description', 'primary_cta_text',
                'primary_cta_url', 'secondary_cta_text', 'secondary_cta_url',
                'background_image',
            ])
            ->map(fn (HeroSlide $slide): array => [
                'id' => $slide->id,
                'title' => $slide->title,
                'subtitle' => $slide->subtitle,
                'description' => $slide->description,
                'primaryCtaText' => $slide->primary_cta_text,
                'primaryCtaUrl' => $slide->primary_cta_url,
                'secondaryCtaText' => $slide->secondary_cta_text,
                'secondaryCtaUrl' => $slide->secondary_cta_url,
                'backgroundImage' => $slide->background_image
                    ? Storage::disk('public')->url($slide->background_image)
                    : null,
            ]);

        $dbArticles = News::query()
            ->latestPublished()
            ->limit(7)
            ->get([
                'id', 'slug', 'title', 'excerpt', 'category', 'author',
                'image_path', 'image_alt', 'video_path', 'video_url',
                'is_featured', 'published_at',
            ])
            ->map(fn (News $article): array => [
                'id' => $article->id,
                'slug' => $article->slug,
                'title' => $article->title,
                'excerpt' => $article->excerpt,
                'category' => $article->category,
                'author' => $article->author,
                'publishedAt' => $article->published_at->format('Y-m-d'),
                'publishedLabel' => $article->published_at->translatedFormat('d F Y'),
                'image' => $article->image_path ?: ($article->is_featured ? '/images/news/featured.png' : '/images/news/default.png'),
                'alt' => $article->image_alt ?: $article->title,
                'video' => $article->video_path,
                'videoUrl' => $article->video_url,
                'featured' => (bool) $article->is_featured,
            ]);

        $dbAnnouncements = Announcement::query()
            ->active()
            ->latestFirst()
            ->limit(3)
            ->get([
                'id', 'title', 'slug', 'summary', 'priority', 'status',
                'is_pinned', 'starts_at', 'ends_at',
            ])
            ->map(function (Announcement $announcement): array {
                $startsAtLabel = $announcement->starts_at->translatedFormat('j F Y');
                $endsAtLabel = $announcement->ends_at?->translatedFormat('j F Y');

                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'slug' => $announcement->slug,
                    'summary' => $announcement->summary,
                    'priority' => $announcement->priority,
                    'status' => $announcement->effectiveStatus(),
                    'pinned' => (bool) $announcement->is_pinned,
                    'startsAt' => $announcement->starts_at->format('Y-m-d'),
                    'endsAt' => $announcement->ends_at?->format('Y-m-d'),
                    'periodLabel' => $endsAtLabel ? "{$startsAtLabel}–{$endsAtLabel}" : "Mulai {$startsAtLabel}",
                ];
            });

        return Inertia::render('welcome', [
            'dbArticles' => $dbArticles,
            'dbAnnouncements' => $dbAnnouncements,
            'heroSlides' => $heroSlides,
            'apbdesSummaries' => Inertia::optional(fn (): array => $this->apbdesSummaries()),
            'villageLeader' => $villageLeader?->toPublicData(),
            'villageProfile' => $villageProfile ? [
                'totalPopulation' => $villageProfile->total_population,
                'totalFamilies' => $villageProfile->total_families,
                'totalHamlets' => $villageProfile->total_hamlets,
                'totalAreaHectares' => $villageProfile->total_area_hectares,
            ] : null,
        ]);
    }

    /** @return array<int, array<string, mixed>> */
    private function apbdesSummaries(): array
    {
        return ApbdesSummary::query()
            ->with([
                'incomeSources:id,apbdes_summary_id,code,label,amount,description',
                'activities:id,apbdes_summary_id,code,name,category,budget,realized,location,status',
            ])
            ->orderByDesc('year')
            ->get(['id', 'year', 'updated_date', 'net_financing'])
            ->map(fn (ApbdesSummary $summary): array => $summary->toPublicData())
            ->all();
    }
}
