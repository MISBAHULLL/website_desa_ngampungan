<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * Display active and archived public announcements.
     */
    public function index(): Response
    {
        $dbAnnouncements = Announcement::latestFirst()
            ->get()
            ->map(function (Announcement $announcement): array {
                $startsAtLabel = $announcement->starts_at->translatedFormat('j F Y');
                $endsAtLabel = $announcement->ends_at ? $announcement->ends_at->translatedFormat('j F Y') : null;
                $periodLabel = $endsAtLabel ? "{$startsAtLabel}–{$endsAtLabel}" : "Mulai {$startsAtLabel}";

                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'slug' => $announcement->slug,
                    'summary' => $announcement->summary,
                    'content' => $announcement->content,
                    'priority' => $announcement->priority,
                    'status' => $announcement->effectiveStatus(),
                    'pinned' => (bool) $announcement->is_pinned,
                    'startsAt' => $announcement->starts_at->format('Y-m-d'),
                    'endsAt' => $announcement->ends_at?->format('Y-m-d'),
                    'periodLabel' => $periodLabel,
                ];
            });

        return Inertia::render('announcements/index', [
            'dbAnnouncements' => $dbAnnouncements,
        ]);
    }
}
