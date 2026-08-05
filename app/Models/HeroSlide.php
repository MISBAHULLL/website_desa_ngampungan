<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title',
    'subtitle',
    'description',
    'primary_cta_text',
    'primary_cta_url',
    'secondary_cta_text',
    'secondary_cta_url',
    'background_image',
    'order',
    'is_active',
])]
class HeroSlide extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }
}
