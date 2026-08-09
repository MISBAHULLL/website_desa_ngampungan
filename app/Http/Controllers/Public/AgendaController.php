<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Support\PublicImageStorage;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Inertia\Inertia;
use Inertia\Response;
use UnexpectedValueException;

class AgendaController extends Controller
{
    public function __construct(private readonly PublicImageStorage $mediaStorage) {}

    public function __invoke(): Response
    {
        $dbAgendas = Agenda::orderBy('event_date', 'asc')->get()->map(function (Agenda $agenda): array {
            $eventDate = $this->eventDate($agenda);

            return [
                'id' => $agenda->id,
                'slug' => $agenda->slug,
                'title' => $agenda->title,
                'category' => $agenda->category,
                'summary' => $agenda->summary,
                'image' => $this->mediaStorage->url($agenda->image_path),
                'imageAlt' => $agenda->image_alt ?: $agenda->title,
                'details' => $agenda->details ?? [],
                'eventDate' => $eventDate->format('Y-m-d'),
                'dayLabel' => $agenda->day_label,
                'dateLabel' => $agenda->date_label,
                'timeLabel' => $agenda->time_label,
                'location' => $agenda->location,
                'organizer' => $agenda->organizer,
                'contact' => $agenda->contact,
                'registrationRequired' => (bool) $agenda->registration_required,
                'status' => $agenda->status,
                'featured' => (bool) $agenda->is_featured,
            ];
        });

        return Inertia::render('agenda/index', [
            'canonicalUrl' => route('agendas.index'),
            'dbAgendas' => $dbAgendas,
            'categoryOptions' => config('village_agenda.categories', []),
            'otherCategoryLabel' => config('village_agenda.other_category_label', 'Lainnya'),
        ]);
    }

    private function eventDate(Agenda $agenda): CarbonInterface
    {
        $eventDate = $agenda->getAttribute('event_date');

        if ($eventDate instanceof CarbonInterface) {
            return $eventDate;
        }

        if (is_string($eventDate)) {
            return CarbonImmutable::parse($eventDate);
        }

        throw new UnexpectedValueException('Tanggal agenda tidak valid.');
    }
}
