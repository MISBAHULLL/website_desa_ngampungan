<?php

namespace App\Models;

use Database\Factories\VillagePotentialFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

/** @property-read Collection<int, VillagePotentialOffering> $offerings */
class VillagePotential extends Model
{
    /** @use HasFactory<VillagePotentialFactory> */
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'description' => 'array',
        'tags' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    protected $appends = [
        'image_url',
    ];

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        if (str_starts_with($this->image_path, 'http://') || str_starts_with($this->image_path, 'https://')) {
            return $this->image_path;
        }

        return Storage::disk('public')->url($this->image_path);
    }

    /** @return HasMany<VillagePotentialOffering, $this> */
    public function offerings(): HasMany
    {
        return $this->hasMany(VillagePotentialOffering::class)->orderBy('sort_order');
    }
}
