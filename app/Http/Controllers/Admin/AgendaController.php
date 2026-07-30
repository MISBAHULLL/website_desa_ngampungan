<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Agenda::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($status && in_array($status, ['upcoming', 'completed'])) {
            $query->where('status', $status);
        }

        $agendas = $query->orderBy('event_date', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/agenda/index', [
            'agendas' => $agendas,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/agenda/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'summary' => ['required', 'string', 'max:1000'],
            'details' => ['nullable', 'array'],
            'details.*' => ['nullable', 'string', 'max:500'],
            'event_date' => ['required', 'date'],
            'time_label' => ['required', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'organizer' => ['required', 'string', 'max:255'],
            'contact' => ['nullable', 'string', 'max:100'],
            'registration_required' => ['boolean'],
            'status' => ['required', 'string', 'in:upcoming,completed'],
            'is_featured' => ['boolean'],
        ]);

        $eventDate = Carbon::parse($validated['event_date']);
        $dayLabel = mb_strtoupper($eventDate->translatedFormat('l'));
        $dateLabel = mb_strtoupper($eventDate->translatedFormat('j F Y'));

        $slug = Agenda::generateUniqueSlug($validated['title']);

        if (! empty($validated['is_featured'])) {
            Agenda::where('is_featured', true)->update(['is_featured' => false]);
        }

        Agenda::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'],
            'summary' => $validated['summary'],
            'details' => array_values(array_filter($validated['details'] ?? [])),
            'event_date' => $validated['event_date'],
            'day_label' => $dayLabel,
            'date_label' => $dateLabel,
            'time_label' => $validated['time_label'],
            'location' => $validated['location'],
            'organizer' => $validated['organizer'],
            'contact' => $validated['contact'] ?? null,
            'registration_required' => $validated['registration_required'] ?? false,
            'status' => $validated['status'],
            'is_featured' => $validated['is_featured'] ?? false,
        ]);

        return redirect()->route('admin.agendas.index')
            ->with('success', 'Agenda desa berhasil dibuat.');
    }

    public function edit(Agenda $agenda): Response
    {
        return Inertia::render('admin/agenda/edit', [
            'agendaItem' => $agenda,
        ]);
    }

    public function update(Request $request, Agenda $agenda): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'summary' => ['required', 'string', 'max:1000'],
            'details' => ['nullable', 'array'],
            'details.*' => ['nullable', 'string', 'max:500'],
            'event_date' => ['required', 'date'],
            'time_label' => ['required', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'organizer' => ['required', 'string', 'max:255'],
            'contact' => ['nullable', 'string', 'max:100'],
            'registration_required' => ['boolean'],
            'status' => ['required', 'string', 'in:upcoming,completed'],
            'is_featured' => ['boolean'],
        ]);

        $eventDate = Carbon::parse($validated['event_date']);
        $dayLabel = mb_strtoupper($eventDate->translatedFormat('l'));
        $dateLabel = mb_strtoupper($eventDate->translatedFormat('j F Y'));

        $slug = $agenda->title !== $validated['title']
            ? Agenda::generateUniqueSlug($validated['title'], $agenda->id)
            : $agenda->slug;

        if (! empty($validated['is_featured']) && ! $agenda->is_featured) {
            Agenda::where('is_featured', true)->update(['is_featured' => false]);
        }

        $agenda->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'],
            'summary' => $validated['summary'],
            'details' => array_values(array_filter($validated['details'] ?? [])),
            'event_date' => $validated['event_date'],
            'day_label' => $dayLabel,
            'date_label' => $dateLabel,
            'time_label' => $validated['time_label'],
            'location' => $validated['location'],
            'organizer' => $validated['organizer'],
            'contact' => $validated['contact'] ?? null,
            'registration_required' => $validated['registration_required'] ?? false,
            'status' => $validated['status'],
            'is_featured' => $validated['is_featured'] ?? false,
        ]);

        return redirect()->route('admin.agendas.index')
            ->with('success', 'Agenda desa berhasil diperbarui.');
    }

    public function toggleFeatured(Agenda $agenda): RedirectResponse
    {
        $newStatus = ! $agenda->is_featured;

        if ($newStatus) {
            Agenda::where('is_featured', true)->update(['is_featured' => false]);
        }

        $agenda->update(['is_featured' => $newStatus]);

        return redirect()->back()
            ->with('success', 'Status agenda utama berhasil diubah.');
    }

    public function destroy(Agenda $agenda): RedirectResponse
    {
        $agenda->delete();

        return redirect()->route('admin.agendas.index')
            ->with('success', 'Agenda desa berhasil dihapus.');
    }
}
