<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

        if ($status && $status !== 'Semua') {
            $query->where('status', $status);
        }

        $announcements = $query->latestFirst()
            ->paginate(10)
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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:300'],
            'content' => ['nullable', 'array'],
            'content.*' => ['nullable', 'string', 'max:10000'],
            'priority' => ['required', 'in:normal,important,emergency'],
            'status' => ['required', 'in:active,archived'],
            'is_pinned' => ['boolean'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        $slug = Announcement::generateUniqueSlug($validated['title']);

        Announcement::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'summary' => $validated['summary'],
            'content' => ! empty($validated['content']) ? array_values(array_filter($validated['content'])) : null,
            'priority' => $validated['priority'],
            'status' => $validated['status'],
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

    public function update(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:300'],
            'content' => ['nullable', 'array'],
            'content.*' => ['nullable', 'string', 'max:10000'],
            'priority' => ['required', 'in:normal,important,emergency'],
            'status' => ['required', 'in:active,archived'],
            'is_pinned' => ['boolean'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        $slug = $announcement->title !== $validated['title']
            ? Announcement::generateUniqueSlug($validated['title'], $announcement->id)
            : $announcement->slug;

        $announcement->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'summary' => $validated['summary'],
            'content' => ! empty($validated['content']) ? array_values(array_filter($validated['content'])) : null,
            'priority' => $validated['priority'],
            'status' => $validated['status'],
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
