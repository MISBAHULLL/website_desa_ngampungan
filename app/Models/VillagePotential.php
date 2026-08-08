<?php

namespace App\Models;

use Database\Factories\VillagePotentialFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function offerings()
    {
        return $this->hasMany(VillagePotentialOffering::class)->orderBy('sort_order');
    }
}
