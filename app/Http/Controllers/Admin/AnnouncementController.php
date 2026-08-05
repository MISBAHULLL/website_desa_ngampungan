<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $priority = $request->input('priority');
        $status = $request->input('status');

        $query = Announcement::query();

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($priority && $priority !== 'Semua') {
            $query->where('priority', $priority);
        }

        if ($status === 'active') {
            $query->active();
        }

        if ($status === 'archived') {
            $query->archived();
        }

        $announcements = $query->latestFirst()
            ->paginate(10)
            ->through(fn (Announcement $announcement): array => array_replace(
                $announcement->toArray(),
                ['status' => $announcement->effectiveStatus()],
            ))
            ->withQueryString();

        return Inertia::render('admin/announcements/index', [
            'announcements' => $announcements,
            'filters' => [
                'search' => $search ?? '',
                'priority' => $priority ?? 'Semua',
                'status' => $status ?? 'Semua',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/announcements/create');
    }

    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $slug = Announcement::generateUniqueSlug($validated['title']);

        Announcement::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'summary' => $validated['summary'],
            'content' => ! empty($validated['content']) ? array_values(array_filter($validated['content'])) : null,
            'priority' => $validated['priority'],
            'status' => Announcement::resolveStatusForPeriod(
                $validated['status'],
                $validated['ends_at'] ?? null,
            ),
            'is_pinned' => $validated['is_pinned'] ?? false,
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'] ?? null,
        ]);

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function edit(Announcement $announcement): Response
    {
        return Inertia::render('admin/announcements/edit', [
            'announcement' => $announcement,
        ]);
    }

    public function update(UpdateAnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validated();

        $slug = $announcement->title !== $validated['title']
            ? Announcement::generateUniqueSlug($validated['title'], $announcement->id)
            : $announcement->slug;

        $announcement->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'summary' => $validated['summary'],
            'content' => ! empty($validated['content']) ? array_values(array_filter($validated['content'])) : null,
            'priority' => $validated['priority'],
            'status' => Announcement::resolveStatusForPeriod(
                $validated['status'],
                $validated['ends_at'] ?? null,
            ),
            'is_pinned' => $validated['is_pinned'] ?? false,
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'] ?? null,
        ]);

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $announcement->delete();

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Pengumuman berhasil dihapus.');
    }

    public function togglePinned(Announcement $announcement): RedirectResponse
    {
        $announcement->update([
            'is_pinned' => ! $announcement->is_pinned,
        ]);

        return redirect()->back()
            ->with('success', 'Status pin pengumuman berhasil diubah.');
    }
}
