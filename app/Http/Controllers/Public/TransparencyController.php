<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ApbdesDocument;
use App\Models\ApbdesSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TransparencyController extends Controller
{
    public function index(Request $request): Response
    {
        $summaries = ApbdesSummary::with(['incomeSources', 'activities'])
            ->orderByDesc('year')
            ->get()
            ->map(function ($sum) {
                $totalIncome = $sum->incomeSources->sum('amount');
                $totalBudget = $sum->activities->sum('budget');
                $totalRealized = $sum->activities->sum('realized');
                $netFinancing = $sum->net_financing;
                $estimatedSilpa = ($totalIncome - $totalBudget) + $netFinancing;

                $realizationPercentage = $totalBudget > 0
                    ? (int) round(($totalRealized / $totalBudget) * 100)
                    : 0;

                $categoryMap = [
                    'pemerintahan' => 'Penyelenggaraan Pemerintahan Desa',
                    'pembangunan' => 'Pelaksanaan Pembangunan Desa',
                    'pembinaan' => 'Pembinaan Kemasyarakatan',
                    'pemberdayaan' => 'Pemberdayaan Masyarakat',
                    'darurat' => 'Penanggulangan Bencana dan Keadaan Mendesak',
                ];

                $allocations = [];
                foreach ($categoryMap as $key => $label) {
                    $catBudget = $sum->activities->where('category', $key)->sum('budget');
                    $pct = $totalBudget > 0 ? round(($catBudget / $totalBudget) * 100, 1) : 0;
                    $valJuta = number_format($catBudget / 1000000, 0, ',', '.');

                    $allocations[] = [
                        'label' => $label,
                        'value' => "Rp{$valJuta} juta",
                        'percentage' => $pct,
                    ];
                }

                $incomeSources = $sum->incomeSources->map(function ($inc) use ($totalIncome) {
                    $pct = $totalIncome > 0 ? round(($inc->amount / $totalIncome) * 100, 1) : 0;

                    return [
                        'code' => $inc->code,
                        'label' => $inc->label,
                        'amount' => 'Rp'.number_format($inc->amount, 0, ',', '.'),
                        'percentage' => $pct,
                        'description' => $inc->description ?? '',
                    ];
                });

                $categoryLabels = [
                    'pemerintahan' => 'Pemerintahan',
                    'pembangunan' => 'Pembangunan Desa',
                    'pembinaan' => 'Pembinaan Kemasyarakatan',
                    'pemberdayaan' => 'Pemberdayaan Masyarakat',
                    'darurat' => 'Keadaan Mendesak',
                ];

                $activities = $sum->activities->map(function ($act) use ($categoryLabels) {
                    $pct = $act->budget > 0 ? (int) round(($act->realized / $act->budget) * 100) : 0;

                    return [
                        'code' => $act->code,
                        'name' => $act->name,
                        'category' => $act->category,
                        'categoryLabel' => $categoryLabels[$act->category] ?? $act->category,
                        'budget' => 'Rp'.number_format($act->budget, 0, ',', '.'),
                        'realized' => 'Rp'.number_format($act->realized, 0, ',', '.'),
                        'percentage' => $pct,
                        'location' => $act->location,
                        'status' => $act->status,
                    ];
                });

                $formattedIncome = 'Rp'.number_format($totalIncome / 1000000000, 2, ',', '.').' miliar';
                $formattedExpense = 'Rp'.number_format($totalBudget / 1000000000, 2, ',', '.').' miliar';
                $formattedNet = 'Rp'.number_format($netFinancing / 1000000, 0, ',', '.').' juta';
                $formattedSilpa = 'Rp'.number_format($estimatedSilpa / 1000000, 0, ',', '.').' juta';

                return [
                    'year' => (string) $sum->year,
                    'updatedAt' => $sum->updated_date ? $sum->updated_date->format('Y-m-d') : '',
                    'updatedLabel' => $sum->updated_date ? $sum->updated_date->translatedFormat('d F Y') : '',
                    'realizationPercentage' => $realizationPercentage,
                    'realizedAmount' => 'Rp'.number_format($totalRealized / 1000000000, 2, ',', '.').' miliar',
                    'budgetAmount' => $formattedExpense,
                    'incomeValue' => $formattedIncome,
                    'expenseValue' => $formattedExpense,
                    'surplusValue' => '+'.'Rp'.number_format(($totalIncome - $totalBudget) / 1000000, 0, ',', '.').' juta',
                    'metrics' => [
                        [
                            'key' => 'income',
                            'label' => 'Pendapatan Desa',
                            'value' => $formattedIncome,
                            'description' => 'Target pendapatan tahun berjalan.',
                        ],
                        [
                            'key' => 'expense',
                            'label' => 'Belanja Desa',
                            'value' => $formattedExpense,
                            'description' => 'Pagu belanja seluruh bidang.',
                        ],
                        [
                            'key' => 'netFinancing',
                            'label' => 'Pembiayaan Neto',
                            'value' => $formattedNet,
                            'description' => 'Selisih penerimaan dan pengeluaran pembiayaan.',
                        ],
                        [
                            'key' => 'estimatedSilpa',
                            'label' => 'Perkiraan SILPA',
                            'value' => $formattedSilpa,
                            'description' => 'Sisa lebih pembiayaan anggaran tahun berjalan.',
                        ],
                    ],
                    'allocations' => $allocations,
                    'incomeSources' => $incomeSources,
                    'activities' => $activities,
                ];
            });

        $publicDocuments = ApbdesDocument::orderByDesc('document_date')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => (string) $doc->id,
                    'title' => $doc->title,
                    'category' => $doc->category,
                    'year' => (string) $doc->year,
                    'documentDate' => $doc->document_date->format('Y-m-d'),
                    'documentDateLabel' => $doc->document_date->translatedFormat('d F Y'),
                    'format' => 'PDF',
                    'fileSize' => $doc->file_size,
                    'downloadUrl' => route('transparency.documents.download', $doc->id),
                ];
            });

        return Inertia::render('transparency/index', [
            'dbSummaries' => $summaries,
            'dbPublicDocuments' => $publicDocuments,
        ]);
    }

    public function downloadDocument(ApbdesDocument $document)
    {
        if ($document->file_path && file_exists(storage_path('app/public/'.$document->file_path))) {
            return response()->download(storage_path('app/public/'.$document->file_path), $document->title.'.pdf');
        }

        $content = "%PDF-1.4\n1 0 obj\n<< /Title (".$document->title.") >>\nendobj\n";

        return response($content, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.Str::slug($document->title).'.pdf"',
        ]);
    }
}
