<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    public function __invoke(): Response
    {
        $dbAgendas = Agenda::orderBy('event_date', 'asc')->get()->map(function ($agenda) {
            return [
                'id' => $agenda->id,
                'slug' => $agenda->slug,
                'title' => $agenda->title,
                'category' => $agenda->category,
                'summary' => $agenda->summary,
                'details' => $agenda->details ?? [],
                'eventDate' => $agenda->event_date ? $agenda->event_date->format('Y-m-d') : null,
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
        ]);
    }
}
