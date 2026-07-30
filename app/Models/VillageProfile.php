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
        'map_latitude',
        'map_longitude',
        'map_zoom',
        'map_google_url',
        'map_hd_file_url',
    ];

    protected function casts(): array
    {
        return [
            'total_population' => 'integer',
            'total_families' => 'integer',
            'total_hamlets' => 'integer',
            'total_area_hectares' => 'integer',
            'map_latitude' => 'float',
            'map_longitude' => 'float',
            'map_zoom' => 'integer',
            'hamlets' => 'array',
            'land_use' => 'array',
        ];
    }
}
