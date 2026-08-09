<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $apbdes_summary_id
 * @property string $code
 * @property string $label
 * @property int $amount
 * @property string|null $description
 */
class ApbdesIncomeSource extends Model
{
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

    /** @return BelongsTo<ApbdesSummary, $this> */
    public function summary(): BelongsTo
    {
        return $this->belongsTo(ApbdesSummary::class, 'apbdes_summary_id');
    }
}
