<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VillageProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'total_population',
        'total_families',
        'total_hamlets',
        'total_area_hectares',
        'boundary_north',
        'boundary_east',
        'boundary_south',
        'boundary_west',
        'hamlets',
        'land_use',
    ];

    protected function casts(): array
    {
        return [
            'total_population' => 'integer',
            'total_families' => 'integer',
            'total_hamlets' => 'integer',
            'total_area_hectares' => 'integer',
            'hamlets' => 'array',
            'land_use' => 'array',
        ];
    }
}
