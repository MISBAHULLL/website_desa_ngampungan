<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    /**
     * Display active and archived public announcements.
     */
    public function index(): Response
    {
        return Inertia::render('announcements/index');
    }
}
