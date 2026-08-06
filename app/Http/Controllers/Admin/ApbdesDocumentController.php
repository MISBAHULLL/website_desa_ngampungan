<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreApbdesDocumentRequest;
use App\Http\Requests\Admin\UpdateApbdesDocumentRequest;
use App\Models\ApbdesDocument;
use App\Models\ApbdesSummary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class ApbdesDocumentController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('admin/apbdes-documents/form', $this->formProps());
    }

    public function store(StoreApbdesDocumentRequest $request): RedirectResponse
    {
        $file = $request->file('document');

        if (! $file instanceof UploadedFile) {
            throw new RuntimeException('Dokumen APBDes tidak ditemukan pada request.');
        }

        ApbdesDocument::query()->create([
            ...$request->safe()->except('document'),
            ...$this->storeFile($file),
        ]);

        return to_route('admin.apbdes.index')->with('success', 'Dokumen APBDes berhasil dipublikasikan.');
    }

    public function edit(ApbdesDocument $apbdesDocument): Response
    {
        return Inertia::render('admin/apbdes-documents/form', [
            ...$this->formProps(),
            'documentItem' => [
                'id' => $apbdesDocument->id,
                'title' => $apbdesDocument->title,
                'category' => $apbdesDocument->category,
                'year' => $apbdesDocument->year,
                'document_date' => $apbdesDocument->document_date->format('Y-m-d'),
                'file_format' => $apbdesDocument->file_format,
                'file_size' => $apbdesDocument->file_size,
                'original_name' => $apbdesDocument->original_name,
            ],
        ]);
    }

    public function update(UpdateApbdesDocumentRequest $request, ApbdesDocument $apbdesDocument): RedirectResponse
    {
        $previousPath = $apbdesDocument->file_path;
        $attributes = $request->safe()->except('document');
        $file = $request->file('document');

        if ($file instanceof UploadedFile) {
            $attributes = [...$attributes, ...$this->storeFile($file)];
        }

        $apbdesDocument->update($attributes);

        if ($file instanceof UploadedFile && $previousPath !== $apbdesDocument->file_path) {
            Storage::disk('public')->delete($previousPath);
        }

        return to_route('admin.apbdes.index')->with('success', 'Dokumen APBDes berhasil diperbarui.');
    }

    public function destroy(ApbdesDocument $apbdesDocument): RedirectResponse
    {
        $filePath = $apbdesDocument->file_path;
        $apbdesDocument->delete();
        Storage::disk('public')->delete($filePath);

        return to_route('admin.apbdes.index')->with('success', 'Dokumen APBDes berhasil dihapus.');
    }

    /** @return array<string, mixed> */
    private function formProps(): array
    {
        return [
            'yearOptions' => ApbdesSummary::query()->orderByDesc('year')->pluck('year'),
            'categoryOptions' => [
                'APBDes',
                'Laporan Realisasi',
                'Peraturan Desa',
                'Laporan Pertanggungjawaban',
                'Baliho Transparansi',
            ],
        ];
    }

    /** @return array{file_path: string, file_format: string, original_name: string, mime_type: string|null, file_size: string} */
    private function storeFile(UploadedFile $file): array
    {
        $storedPath = $file->store('apbdes-documents', 'public');

        if ($storedPath === false) {
            throw new RuntimeException('Dokumen APBDes gagal disimpan.');
        }

        return [
            'file_path' => $storedPath,
            'file_format' => mb_strtoupper($file->extension()),
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => $this->formatFileSize((int) $file->getSize()),
        ];
    }

    private function formatFileSize(int $bytes): string
    {
        if ($bytes >= 1_048_576) {
            return number_format($bytes / 1_048_576, 1, ',', '.').' MB';
        }

        return number_format(max($bytes, 0) / 1_024, 1, ',', '.').' KB';
    }
}
