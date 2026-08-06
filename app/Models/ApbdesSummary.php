<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApbdesSummary extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'updated_date',
        'net_financing',
    ];

    protected function casts(): array
    {
        return [
            'updated_date' => 'date',
            'net_financing' => 'integer',
        ];
    }

    public function incomeSources(): HasMany
    {
        return $this->hasMany(ApbdesIncomeSource::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(ApbdesActivityItem::class);
    }

    /** @return array<string, mixed> */
    public function toPublicData(): array
    {
        $this->loadMissing(['incomeSources', 'activities']);

        $totalIncome = (int) $this->incomeSources->sum('amount');
        $totalBudget = (int) $this->activities->sum('budget');
        $totalRealized = (int) $this->activities->sum('realized');
        $netFinancing = (int) $this->net_financing;
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
        $categoryLabels = [
            'pemerintahan' => 'Pemerintahan',
            'pembangunan' => 'Pembangunan Desa',
            'pembinaan' => 'Pembinaan Kemasyarakatan',
            'pemberdayaan' => 'Pemberdayaan Masyarakat',
            'darurat' => 'Keadaan Mendesak',
        ];

        $allocations = collect($categoryMap)->map(function (string $label, string $category) use ($totalBudget): array {
            $categoryBudget = (int) $this->activities->where('category', $category)->sum('budget');
            $categoryRealized = (int) $this->activities->where('category', $category)->sum('realized');

            return [
                'label' => $label,
                'value' => $this->formatMillions($categoryBudget),
                'percentage' => $totalBudget > 0 ? round(($categoryBudget / $totalBudget) * 100, 1) : 0,
                'realizedValue' => $this->formatMillions($categoryRealized),
                'realizedPercentage' => $totalBudget > 0 ? round(($categoryRealized / $totalBudget) * 100, 1) : 0,
                'absorptionPercentage' => $categoryBudget > 0 ? round(($categoryRealized / $categoryBudget) * 100, 1) : 0,
            ];
        })->values();

        $incomeSources = $this->incomeSources->map(function (ApbdesIncomeSource $source) use ($totalIncome): array {
            return [
                'code' => $source->code,
                'label' => $source->label,
                'amount' => $this->formatRupiah((int) $source->amount),
                'percentage' => $totalIncome > 0 ? round(((int) $source->amount / $totalIncome) * 100, 1) : 0,
                'description' => $source->description ?? '',
            ];
        })->values();

        $activities = $this->activities->map(function (ApbdesActivityItem $activity) use ($categoryLabels): array {
            $percentage = $activity->budget > 0
                ? (int) round(((int) $activity->realized / (int) $activity->budget) * 100)
                : 0;

            return [
                'code' => $activity->code,
                'name' => $activity->name,
                'category' => $activity->category,
                'categoryLabel' => $categoryLabels[$activity->category] ?? $activity->category,
                'budget' => $this->formatRupiah((int) $activity->budget),
                'realized' => $this->formatRupiah((int) $activity->realized),
                'percentage' => $percentage,
                'location' => $activity->location,
                'status' => $activity->status,
            ];
        })->values();

        $formattedIncome = $this->formatBillions($totalIncome);
        $formattedExpense = $this->formatBillions($totalBudget);

        return [
            'year' => (string) $this->year,
            'updatedAt' => $this->updated_date?->format('Y-m-d') ?? '',
            'updatedLabel' => $this->updated_date?->translatedFormat('d F Y') ?? '',
            'realizationPercentage' => $realizationPercentage,
            'incomeAmount' => $totalIncome,
            'expenseAmount' => $totalBudget,
            'realizedAmountValue' => $totalRealized,
            'realizedAmount' => $this->formatBillions($totalRealized),
            'budgetAmount' => $formattedExpense,
            'incomeValue' => $formattedIncome,
            'expenseValue' => $formattedExpense,
            'surplusValue' => $this->formatSignedMillions($totalIncome - $totalBudget),
            'metrics' => [
                ['key' => 'income', 'label' => 'Pendapatan Desa', 'value' => $formattedIncome, 'description' => 'Target pendapatan tahun berjalan.'],
                ['key' => 'expense', 'label' => 'Belanja Desa', 'value' => $formattedExpense, 'description' => 'Pagu belanja seluruh bidang.'],
                ['key' => 'netFinancing', 'label' => 'Pembiayaan Neto', 'value' => $this->formatMillions($netFinancing), 'description' => 'Selisih penerimaan dan pengeluaran pembiayaan.'],
                ['key' => 'estimatedSilpa', 'label' => 'Perkiraan SILPA', 'value' => $this->formatMillions($estimatedSilpa), 'description' => 'Sisa lebih pembiayaan anggaran tahun berjalan.'],
            ],
            'allocations' => $allocations,
            'incomeSources' => $incomeSources,
            'activities' => $activities,
        ];
    }

    private function formatRupiah(int $amount): string
    {
        return 'Rp'.number_format($amount, 0, ',', '.');
    }

    private function formatMillions(int $amount): string
    {
        return 'Rp'.number_format($amount / 1_000_000, 0, ',', '.').' juta';
    }

    private function formatBillions(int $amount): string
    {
        return 'Rp'.number_format($amount / 1_000_000_000, 2, ',', '.').' miliar';
    }

    private function formatSignedMillions(int $amount): string
    {
        $prefix = $amount >= 0 ? '+' : '-';

        return $prefix.$this->formatMillions(abs($amount));
    }
}
