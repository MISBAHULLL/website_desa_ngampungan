<?php

namespace App\Models;

use Database\Factories\VillageOfficialFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $slug
 * @property string $name
 * @property string $initials
 * @property string $position
 * @property string $unit
 * @property string $group
 * @property string|null $photo_path
 * @property string|null $term
 * @property string|null $employee_id
 * @property string $summary
 * @property string|null $about
 * @property array<int, string> $responsibilities
 * @property array<int, string> $service_focus
 * @property array<int, string> $education
 * @property array<int, array{period: string, role: string}> $career
 * @property int $sort_order
 * @property int|null $parent_id
 * @property bool $is_active
 * @property-read string|null $photo_url
 */
class VillageOfficial extends Model
{
    /** @use HasFactory<VillageOfficialFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $appends = ['photo_url'];

    protected $fillable = [
        'slug',
        'name',
        'initials',
        'position',
        'unit',
        'group',
        'photo_path',
        'term',
        'employee_id',
        'summary',
        'about',
        'responsibilities',
        'service_focus',
        'education',
        'career',
        'sort_order',
        'parent_id',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'responsibilities' => 'array',
            'service_focus' => 'array',
            'education' => 'array',
            'career' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    // ── Relationships ──

    /** @return BelongsTo<self, $this> */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /** @return HasMany<self, $this> */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    // ── Scopes ──

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
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeByGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    // ── Accessors ──

    public function getPhotoUrlAttribute(): ?string
    {
        if (! $this->photo_path) {
            return null;
        }

        return Storage::disk('public')->url($this->photo_path);
    }

    // ── Static Helpers ──

    public static function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $counter = 1;

        while (
            self::where('slug', $slug)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $original.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * @param  array<int, int|null>  $parentIds
     */
    public static function hierarchyContainsCycle(array $parentIds): bool
    {
        foreach (array_keys($parentIds) as $officialId) {
            $visitedIds = [];
            $currentId = $officialId;

            while (true) {
                if (isset($visitedIds[$currentId])) {
                    return true;
                }

                $visitedIds[$currentId] = true;
                $parentId = $parentIds[$currentId] ?? null;

                if ($parentId === null) {
                    break;
                }

                $currentId = $parentId;
            }
        }

        return false;
    }

    /**
     * Build a nested tree from a flat collection of officials.
     *
     * @param  Collection<int, self>  $officials
     * @return array<int, array<string, mixed>>
     */
    public static function buildTree($officials): array
    {
        $lookup = [];
        $tree = [];

        foreach ($officials as $official) {
            $lookup[$official->id] = [
                'id' => $official->id,
                'slug' => $official->slug,
                'name' => $official->name,
                'initials' => $official->initials,
                'position' => $official->position,
                'unit' => $official->unit,
                'group' => $official->group,
                'photo' => $official->photo_url,
                'term' => $official->term ?? 'Data belum tersedia',
                'employeeId' => $official->employee_id ?? '-',
                'summary' => $official->summary,
                'about' => $official->about ?? '',
                'responsibilities' => $official->responsibilities ?? [],
                'serviceFocus' => $official->service_focus ?? [],
                'education' => $official->education ?? [],
                'career' => $official->career ?? [],
                'sortOrder' => $official->sort_order,
                'parentId' => $official->parent_id,
                'children' => [],
            ];
        }

        foreach ($lookup as $id => &$node) {
            if ($node['parentId'] && isset($lookup[$node['parentId']])) {
                $lookup[$node['parentId']]['children'][] = &$node;
            } else {
                $tree[] = &$node;
            }
        }

        return $tree;
    }
}
