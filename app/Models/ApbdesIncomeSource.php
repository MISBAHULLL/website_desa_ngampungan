<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApbdesIncomeSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'apbdes_summary_id',
        'code',
        'label',
        'amount',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
        ];
    }

    public function summary(): BelongsTo
    {
        return $this->belongsTo(ApbdesSummary::class, 'apbdes_summary_id');
    }
}
