<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\GalleryPhotoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** @property CarbonImmutable|null $captured_at */
class GalleryPhoto extends Model
{
    /** @use HasFactory<GalleryPhotoFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'media_type',
        'category',
        'album',
        'caption',
        'image_path',
        'image_alt',
        'video_path',
        'video_url',
        'is_featured',
        'captured_at',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'captured_at' => 'date',
        ];
    }

    public static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}
