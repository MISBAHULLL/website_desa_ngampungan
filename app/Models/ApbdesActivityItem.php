<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $apbdes_summary_id
 * @property string $code
 * @property string $name
 * @property 'pemerintahan'|'pembangunan'|'pembinaan'|'pemberdayaan'|'darurat' $category
 * @property int $budget
 * @property int $realized
 * @property string $location
 * @property 'selesai'|'berjalan'|'direncanakan' $status
 */
class ApbdesActivityItem extends Model
{
    protected $fillable = [
        'apbdes_summary_id',
        'code',
        'name',
        'category',
        'budget',
        'realized',
        'location',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'integer',
            'realized' => 'integer',
        ];
    }

    /** @return BelongsTo<ApbdesSummary, $this> */
    public function summary(): BelongsTo
    {
        return $this->belongsTo(ApbdesSummary::class, 'apbdes_summary_id');
    }
}
