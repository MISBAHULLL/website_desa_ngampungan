<?php

namespace App\Models;

use Database\Factories\AnnouncementFactory;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $summary
 * @property array<int, string>|null $content
 * @property string $priority
 * @property string $status
 * @property bool $is_pinned
 * @property Carbon $starts_at
 * @property Carbon|null $ends_at
 */
class Announcement extends Model
{
    /** @use HasFactory<AnnouncementFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'content',
        'priority',
        'status',
        'is_pinned',
        'starts_at',
        'ends_at',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'is_pinned' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    public static function resolveStatusForPeriod(string $status, DateTimeInterface|string|null $endsAt): string
    {
        if ($status === 'active' && $endsAt !== null && Carbon::parse($endsAt)->isPast()) {
            return 'archived';
        }

        return $status;
    }

    public function effectiveStatus(): string
    {
        return self::resolveStatusForPeriod((string) $this->status, $this->ends_at);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query
            ->where('status', 'active')
            ->where(function (Builder $periodQuery): void {
                $periodQuery
                    ->whereNull('ends_at')
                    ->orWhere('ends_at', '>=', now());
            });
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeArchived(Builder $query): Builder
    {
        return $query->where(function (Builder $statusQuery): void {
            $statusQuery
                ->where('status', 'archived')
                ->orWhere(function (Builder $expiredQuery): void {
                    $expiredQuery
                        ->where('status', 'active')
                        ->whereNotNull('ends_at')
                        ->where('ends_at', '<', now());
                });
        });
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePinned(Builder $query): Builder
    {
        return $query->where('is_pinned', true);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('is_pinned')->orderByDesc('starts_at')->orderByDesc('id');
    }
}
