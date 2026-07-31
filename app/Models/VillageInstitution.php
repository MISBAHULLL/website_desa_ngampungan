<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $acronym
 * @property string|null $logo_path
 * @property string $name
 * @property string|null $leader
 * @property int $member_count
 * @property string $focus
 * @property string|null $description
 * @property array<int, string> $responsibilities
 * @property array<int, array{name: string, role: string}>|null $members
 * @property int $sort_order
 * @property bool $is_active
 * @property-read string|null $logo_url
 */
class VillageInstitution extends Model
{
    use HasFactory;

    protected $fillable = [
        'acronym',
        'logo_path',
        'name',
        'leader',
        'member_count',
        'focus',
        'description',
        'responsibilities',
        'members',
        'sort_order',
        'is_active',
    ];

    protected $appends = [
        'logo_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'responsibilities' => 'array',
            'members' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'member_count' => 'integer',
        ];
    }

    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo_path) {
            return null;
        }

        if (str_starts_with($this->logo_path, 'http://') || str_starts_with($this->logo_path, 'https://')) {
            return $this->logo_path;
        }

        return asset('storage/'.$this->logo_path);
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
