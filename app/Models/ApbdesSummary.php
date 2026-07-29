<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApbdesSummary extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'updated_date',
        'net_financing',
    ];

    protected function casts(): array
    {
        return [
            'updated_date' => 'date',
            'net_financing' => 'integer',
        ];
    }

    public function incomeSources(): HasMany
    {
        return $this->hasMany(ApbdesIncomeSource::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(ApbdesActivityItem::class);
    }
}
