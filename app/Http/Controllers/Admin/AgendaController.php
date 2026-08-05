<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAgendaRequest;
use App\Http\Requests\Admin\UpdateAgendaRequest;
use App\Models\Agenda;
use App\Support\PublicImageStorage;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    public function __construct(private readonly PublicImageStorage $imageStorage) {}

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Agenda::query();

        if ($search) {
            $query->where(function ($query) use ($search): void {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($status && in_array($status, ['upcoming', 'completed'], true)) {
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
        return Inertia::render('admin/agenda/create', $this->categoryProps());
    }

    public function store(StoreAgendaRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $eventDate = Carbon::parse($validated['event_date']);
        $imagePath = $this->resolveImagePath($request, $validated['image_url'] ?? null);

        DB::transaction(function () use ($eventDate, $imagePath, $validated): void {
            if (! empty($validated['is_featured'])) {
                Agenda::query()->where('is_featured', true)->update(['is_featured' => false]);
            }

            Agenda::query()->create([
                'title' => $validated['title'],
                'slug' => Agenda::generateUniqueSlug($validated['title']),
                'category' => $validated['category'],
                'summary' => $validated['summary'],
                'image_path' => $imagePath,
                'image_alt' => ($validated['image_alt'] ?? null) ?: $validated['title'],
                'details' => array_values(array_filter($validated['details'] ?? [])),
                'event_date' => $validated['event_date'],
                'day_label' => mb_strtoupper($eventDate->translatedFormat('l')),
                'date_label' => mb_strtoupper($eventDate->translatedFormat('j F Y')),
                'time_label' => $validated['time_label'],
                'location' => $validated['location'],
                'organizer' => $validated['organizer'],
                'contact' => $validated['contact'] ?? null,
                'registration_required' => $validated['registration_required'] ?? false,
                'status' => $validated['status'],
                'is_featured' => $validated['is_featured'] ?? false,
            ]);
        });

        return redirect()->route('admin.agendas.index')
            ->with('success', 'Agenda desa berhasil dibuat.');
    }

    public function edit(Agenda $agenda): Response
    {
        return Inertia::render('admin/agenda/edit', [
            'agendaItem' => $agenda,
            ...$this->categoryProps(),
        ]);
    }

    public function update(UpdateAgendaRequest $request, Agenda $agenda): RedirectResponse
    {
        $validated = $request->validated();
        $eventDate = Carbon::parse($validated['event_date']);
        $previousImagePath = $agenda->image_path;
        $imagePath = $this->resolveImagePath(
            $request,
            $validated['image_url'] ?? null,
            $previousImagePath,
        );

        DB::transaction(function () use ($agenda, $eventDate, $imagePath, $validated): void {
            if (! empty($validated['is_featured']) && ! $agenda->is_featured) {
                Agenda::query()->where('is_featured', true)->update(['is_featured' => false]);
            }

            $slug = $agenda->title !== $validated['title']
                ? Agenda::generateUniqueSlug($validated['title'], $agenda->id)
                : $agenda->slug;

            $agenda->update([
                'title' => $validated['title'],
                'slug' => $slug,
                'category' => $validated['category'],
                'summary' => $validated['summary'],
                'image_path' => $imagePath,
                'image_alt' => ($validated['image_alt'] ?? null) ?: $validated['title'],
                'details' => array_values(array_filter($validated['details'] ?? [])),
                'event_date' => $validated['event_date'],
                'day_label' => mb_strtoupper($eventDate->translatedFormat('l')),
                'date_label' => mb_strtoupper($eventDate->translatedFormat('j F Y')),
                'time_label' => $validated['time_label'],
                'location' => $validated['location'],
                'organizer' => $validated['organizer'],
                'contact' => $validated['contact'] ?? null,
                'registration_required' => $validated['registration_required'] ?? false,
                'status' => $validated['status'],
                'is_featured' => $validated['is_featured'] ?? false,
            ]);
        });

        if ($previousImagePath !== $imagePath) {
            $this->imageStorage->delete($previousImagePath);
        }

        return redirect()->route('admin.agendas.index')
            ->with('success', 'Agenda desa berhasil diperbarui.');
    }

    public function toggleFeatured(Agenda $agenda): RedirectResponse
    {
        $newStatus = ! $agenda->is_featured;

        DB::transaction(function () use ($agenda, $newStatus): void {
            if ($newStatus) {
                Agenda::query()->where('is_featured', true)->update(['is_featured' => false]);
            }

            $agenda->update(['is_featured' => $newStatus]);
        });

        return redirect()->back()
            ->with('success', 'Status agenda utama berhasil diubah.');
    }

    public function destroy(Agenda $agenda): RedirectResponse
    {
        $imagePath = $agenda->image_path;
        $agenda->delete();
        $this->imageStorage->delete($imagePath);

        return redirect()->route('admin.agendas.index')
            ->with('success', 'Agenda desa berhasil dihapus.');
    }

    /** @return array{categoryOptions: list<string>, otherCategoryLabel: string} */
    private function categoryProps(): array
    {
        /** @var list<string> $categoryOptions */
        $categoryOptions = config('village_agenda.categories', []);

        return [
            'categoryOptions' => $categoryOptions,
            'otherCategoryLabel' => (string) config('village_agenda.other_category_label', 'Lainnya'),
        ];
    }

    private function resolveImagePath(
        StoreAgendaRequest $request,
        ?string $imageUrl,
        ?string $fallback = null,
    ): ?string {
        $image = $request->file('image');

        if ($image instanceof UploadedFile) {
            return $this->imageStorage->store($image, 'agendas');
        }

        return $imageUrl ?: $fallback;
    }
}
