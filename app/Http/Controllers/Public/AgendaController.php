<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('agenda/index', [
            'canonicalUrl' => route('agendas.index'),
        ]);
    }
}
