<?php

namespace App\Http\Controllers\Admin;

use App\Actions\UpsertApbdesSummary;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreApbdesRequest;
use App\Http\Requests\Admin\UpdateApbdesRequest;
use App\Models\ApbdesDocument;
use App\Models\ApbdesSummary;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ApbdesController extends Controller
{
    public function __construct(private readonly UpsertApbdesSummary $upsertApbdesSummary) {}

    public function index(): Response
    {
        $summaries = ApbdesSummary::query()
            ->withCount(['incomeSources', 'activities'])
            ->withSum('incomeSources', 'amount')
            ->withSum('activities', 'budget')
            ->withSum('activities', 'realized')
            ->orderByDesc('year')
            ->get()
            ->map(fn (ApbdesSummary $summary): array => $this->indexData($summary));

        $documents = ApbdesDocument::query()
            ->orderByDesc('document_date')
            ->get()
            ->map(fn (ApbdesDocument $document): array => [
                'id' => $document->id,
                'title' => $document->title,
                'category' => $document->category,
                'year' => $document->year,
                'documentDateLabel' => $document->document_date->translatedFormat('d F Y'),
                'format' => $document->file_format,
                'fileSize' => $document->file_size,
                'originalName' => $document->original_name,
                'downloadUrl' => route('transparency.documents.download', $document),
            ]);

        return Inertia::render('admin/apbdes/index', [
            'summaries' => $summaries,
            'documents' => $documents,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/apbdes/form', $this->formProps());
    }

    public function store(StoreApbdesRequest $request): RedirectResponse
    {
        $this->upsertApbdesSummary->execute($request->validated());

        return to_route('admin.apbdes.index')->with('success', 'Data APBDes berhasil dibuat.');
    }

    public function edit(ApbdesSummary $apbdes): Response
    {
        $apbdes->load([
            'incomeSources' => fn ($query) => $query->orderBy('id'),
            'activities' => fn ($query) => $query->orderBy('id'),
        ]);

        return Inertia::render('admin/apbdes/form', [
            ...$this->formProps(),
            'summary' => $this->formData($apbdes),
        ]);
    }

    public function update(UpdateApbdesRequest $request, ApbdesSummary $apbdes): RedirectResponse
    {
        $this->upsertApbdesSummary->execute($request->validated(), $apbdes);

        return to_route('admin.apbdes.index')->with('success', 'Data APBDes berhasil diperbarui.');
    }

    public function destroy(ApbdesSummary $apbdes): RedirectResponse
    {
        $apbdes->delete();

        return to_route('admin.apbdes.index')->with('success', 'Data APBDes berhasil dihapus.');
    }

    /** @return array<string, mixed> */
    private function indexData(ApbdesSummary $summary): array
    {
        $budget = (int) ($summary->activities_sum_budget ?? 0);
        $realized = (int) ($summary->activities_sum_realized ?? 0);

        return [
            'id' => $summary->id,
            'year' => $summary->year,
            'updatedDate' => $summary->updated_date?->format('Y-m-d'),
            'updatedLabel' => $summary->updated_date?->translatedFormat('d F Y'),
            'totalIncome' => (int) ($summary->income_sources_sum_amount ?? 0),
            'totalBudget' => $budget,
            'totalRealized' => $realized,
            'realizationPercentage' => $budget > 0 ? (int) round(($realized / $budget) * 100) : 0,
            'incomeSourcesCount' => $summary->income_sources_count,
            'activitiesCount' => $summary->activities_count,
        ];
    }

    /** @return array<string, mixed> */
    private function formData(ApbdesSummary $summary): array
    {
        return [
            'id' => $summary->id,
            'year' => $summary->year,
            'updated_date' => $summary->updated_date?->format('Y-m-d') ?? '',
            'net_financing' => $summary->net_financing,
            'income_sources' => $summary->incomeSources->map->only(['code', 'label', 'amount', 'description'])->values(),
            'activities' => $summary->activities->map->only(['code', 'name', 'category', 'budget', 'realized', 'location', 'status'])->values(),
        ];
    }

    /** @return array<string, mixed> */
    private function formProps(): array
    {
        return [
            'categoryOptions' => [
                ['value' => 'pemerintahan', 'label' => 'Penyelenggaraan Pemerintahan'],
                ['value' => 'pembangunan', 'label' => 'Pembangunan Desa'],
                ['value' => 'pembinaan', 'label' => 'Pembinaan Kemasyarakatan'],
                ['value' => 'pemberdayaan', 'label' => 'Pemberdayaan Masyarakat'],
                ['value' => 'darurat', 'label' => 'Bencana & Keadaan Mendesak'],
            ],
            'statusOptions' => [
                ['value' => 'direncanakan', 'label' => 'Direncanakan'],
                ['value' => 'berjalan', 'label' => 'Berjalan'],
                ['value' => 'selesai', 'label' => 'Selesai'],
            ],
        ];
    }
}
