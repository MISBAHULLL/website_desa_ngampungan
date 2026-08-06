<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string $short_description
 * @property string $category
 * @property string $audience
 * @property string $channel
 * @property string $estimated_duration
 * @property string $fee
 * @property string|null $service_contact
 * @property string|null $service_hours
 * @property list<string>|null $notes
 * @property bool $is_active
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'slug',
    'title',
    'short_description',
    'category',
    'audience',
    'channel',
    'estimated_duration',
    'fee',
    'service_contact',
    'service_hours',
    'notes',
    'is_active',
    'sort_order',
])]
class VillageService extends Model
{
    use HasFactory;

    /**
     * @return HasMany<VillageServiceRequirement, $this>
     */
    public function requirements(): HasMany
    {
        return $this->hasMany(VillageServiceRequirement::class)
            ->orderBy('sort_order');
    }

    /**
     * @return HasMany<VillageServiceDocumentRequirement, $this>
     */
    public function documentRequirements(): HasMany
    {
        return $this->hasMany(VillageServiceDocumentRequirement::class)
            ->orderBy('sort_order');
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('title');
    }

    public static function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (
            static::query()
                ->where('slug', $slug)
                ->when($excludeId, fn (Builder $query) => $query->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'notes' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
