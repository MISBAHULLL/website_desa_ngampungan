<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class GalleryPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'album',
        'caption',
        'image_path',
        'image_alt',
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
