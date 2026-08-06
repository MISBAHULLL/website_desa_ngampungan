<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $village_service_id
 * @property string $description
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'village_service_id',
    'description',
    'sort_order',
])]
class VillageServiceRequirement extends Model
{
    /**
     * @return BelongsTo<VillageService, $this>
     */
    public function villageService(): BelongsTo
    {
        return $this->belongsTo(VillageService::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }
}
