<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $acronym
 * @property string $name
 * @property string|null $leader
 * @property int $member_count
 * @property string $focus
 * @property array<int, string> $responsibilities
 * @property int $sort_order
 * @property bool $is_active
 */
class VillageInstitution extends Model
{
    use HasFactory;

    protected $fillable = [
        'acronym',
        'name',
        'leader',
        'member_count',
        'focus',
        'responsibilities',
        'sort_order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'responsibilities' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'member_count' => 'integer',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
