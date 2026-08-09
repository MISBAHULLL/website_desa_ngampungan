<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $village_service_id
 * @property string $key
 * @property string $label
 * @property string|null $description
 * @property bool $is_required
 * @property string $accepted_formats
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
    'village_service_id',
    'key',
    'label',
    'description',
    'is_required',
    'accepted_formats',
    'sort_order',
])]
class VillageServiceDocumentRequirement extends Model
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
            'is_required' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
