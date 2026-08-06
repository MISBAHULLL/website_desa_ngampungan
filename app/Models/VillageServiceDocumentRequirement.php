<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $village_service_id
 * @property string $key
 * @property string $label
 * @property string|null $description
 * @property bool $is_required
 * @property string $accepted_formats
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
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
