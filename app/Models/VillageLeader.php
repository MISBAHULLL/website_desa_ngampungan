<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\VillageLeaderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * @property CarbonImmutable $started_at
 * @property CarbonImmutable|null $ended_at
 */
#[Fillable([
    'name',
    'position',
    'photo',
    'welcome_title',
    'welcome_message',
    'vision',
    'mission',
    'started_at',
    'ended_at',
    'is_active',
])]
class VillageLeader extends Model
{
    /** @use HasFactory<VillageLeaderFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'started_at' => 'date',
            'ended_at' => 'date',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @return array<string, int|string|null>
     */
    public function toPublicData(): array
    {
        $endingYear = $this->ended_at?->format('Y') ?? 'sekarang';

        return [
            'id' => $this->id,
            'name' => $this->name,
            'position' => $this->position,
            'photo' => $this->photo ? Storage::disk('public')->url($this->photo) : null,
            'welcomeTitle' => $this->welcome_title,
            'welcomeMessage' => $this->welcome_message,
            'vision' => $this->vision,
            'mission' => $this->mission,
            'period' => $this->started_at->format('Y').'–'.$endingYear,
        ];
    }
}
