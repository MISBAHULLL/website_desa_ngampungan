<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApbdesActivityItem extends Model
{
    use HasFactory;

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

    public function summary(): BelongsTo
    {
        return $this->belongsTo(ApbdesSummary::class, 'apbdes_summary_id');
    }
}
