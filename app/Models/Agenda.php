<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Agenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'summary',
        'details',
        'event_date',
        'day_label',
        'date_label',
        'time_label',
        'location',
        'organizer',
        'contact',
        'registration_required',
        'status',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
            'event_date' => 'date',
            'registration_required' => 'boolean',
            'is_featured' => 'boolean',
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
