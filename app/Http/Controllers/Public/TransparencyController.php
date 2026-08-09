<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ApbdesDocument;
use App\Models\ApbdesSummary;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TransparencyController extends Controller
{
    public function index(): Response
    {
        $summaries = ApbdesSummary::query()
            ->with(['incomeSources', 'activities'])
            ->orderByDesc('year')
            ->get()
            ->map(fn (ApbdesSummary $summary): array => $summary->toPublicData());

        $publicDocuments = ApbdesDocument::query()
            ->orderByDesc('document_date')
            ->get()
            ->map(fn (ApbdesDocument $document): array => $document->toPublicData());

        return Inertia::render('transparency/index', [
            'dbSummaries' => $summaries,
            'dbPublicDocuments' => $publicDocuments,
        ]);
    }

    public function downloadDocument(ApbdesDocument $document): StreamedResponse|HttpResponse
    {
        $extension = mb_strtolower($document->file_format ?: 'PDF');
        $downloadName = Str::slug($document->title).'.'.$extension;

        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            return Storage::disk('public')->download(
                $document->file_path,
                $downloadName,
                array_filter(['Content-Type' => $document->mime_type]),
            );
        }

        abort_unless($extension === 'pdf', 404, 'File dokumen tidak ditemukan.');

        $content = "%PDF-1.4\n1 0 obj\n<< /Title (".$document->title.") >>\nendobj\n";

        return response($content, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$downloadName.'"',
        ]);
    }
}
