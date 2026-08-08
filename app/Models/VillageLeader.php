<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'name',
    'position',
    'photo',
    'welcome_message',
    'vision',
    'mission',
    'started_at',
    'ended_at',
    'is_active',
])]
class VillageLeader extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'started_at' => 'date',
            'ended_at' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive($query)
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
            'welcomeMessage' => $this->welcome_message,
            'vision' => $this->vision,
            'mission' => $this->mission,
            'period' => $this->started_at->format('Y').'–'.$endingYear,
        ];
    }
}
