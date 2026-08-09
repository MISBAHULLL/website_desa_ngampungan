<?php

namespace App\Models;

use App\ServiceApplicationStatus;
use Carbon\CarbonImmutable;
use Database\Factories\ServiceApplicationStatusHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $service_application_id
 * @property ServiceApplicationStatus $status
 * @property string|null $public_notes
 * @property int|null $changed_by
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
    'status',
    'public_notes',
    'changed_by',
])]
class ServiceApplicationStatusHistory extends Model
{
    /** @use HasFactory<ServiceApplicationStatusHistoryFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<ServiceApplication, $this>
     */
    public function serviceApplication(): BelongsTo
    {
        return $this->belongsTo(ServiceApplication::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ServiceApplicationStatus::class,
            'public_notes' => 'encrypted',
        ];
    }
}
