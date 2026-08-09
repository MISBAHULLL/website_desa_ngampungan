<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $village_service_id
 * @property string $description
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
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
